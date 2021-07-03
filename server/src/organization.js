const { Octokit } = require("@octokit/rest");
const db = require('./database.js');
const extend = require('extend');

const dbColumn = {
    org_id: "org_id",
    gh_id: "gh_id",
    org_name: "org_name",
    auth_token: "auth_token",
    user_id: "user_id"
};

class Organization {
    constructor(params){
        // default values
        var config = extend({
            name: undefined,
            token: undefined,
            dbtable: "organization",
            githubID: undefined,
            userID: undefined,
        }, params);

        this.name = config.name;
        this.token = config.token;
        this.dbtable = config.dbtable;
        this.githubID = config.githubID;
        this.userID = config.userID;

        // a value existsInDB that defaults as false, but if it's true grabs all data from db
        // seperate function for grabbing from db
    }

    get getName(){
        return this.name;
    }

    get getToken(){
        return this.token;
    }

    get getDBTable(){
        return this.dbtable;
    }

    get getID(){
        // need to fio where to get this
        // maybe db?
    }

    // returns undefined if ID not set and unable to retrieve it
    async getGithubID(){
        if (this.githubID === undefined){
            console.log(`org:${this.name} GitHub ID undefined... Getting new one`);
            try {
                const octokit = new Octokit({
                    auth: `token ${this.token}`
                  });
                let result = await octokit.rest.orgs.get({
                    org: this.name
                });
                if (result.status == 200){
                    console.log(`org:${this.name} GitHub ID retrieval: success`);
                    this.githubID = result.data.id;
                    return this.githubID;
                }
                else{
                    console.log("Unknown result");
                    console.log(result);
                    return undefined;
                }
            }catch (error) {
                if (error.status == 404) {
                    console.log(`org:${this.name} GitHub ID retrieval: fail\nMake sure to use validateOrg() first`);
                    return undefined;
                }
                else {
                    console.log(`Error retrieving GitHub ID`);
                    throw error;
                }

            }
        }else{
            return this.githubID;
        }
    }

    // async validateToken(authToken){
    //     console.log("Validating token...");
    //     try{
    //         const octokit = new Octokit({
    //             auth: `token ${authToken}`
    //           }); 
    //         let result = await octokit.rest.users.getAuthenticated();
    //         if (result.status == 200){
    //             console.log(`user:${result.data.login} token verified`);
    //             return true;
    //         } else {
    //             console.log("Unknown result");
    //             console.log(result);
    //             return false;
    //         }
    //     }catch (error) {
    //         if (error.status == 401) {
    //             console.log(`Unable to validate OAuth Token is valid`);
    //             return false;
    //         } else {
    //             console.log(`Error validating token`);
    //             throw error;
    //           }
    //     }
    // }

    async validateOrg(){
        try{
            const octokit = new Octokit({
                auth: `token ${this.token}`
              });
            let result = await octokit.rest.orgs.get({
                org: this.name
            });
            if (result.status == 200){
                console.log(`org:${this.name} verified`);
                return true;
            }
            else{
                console.log("Unknown result");
                console.log(result);
                return false;
            }
        } catch (error) {
            if (error.status == 404) {
                console.log(`Unable to validate org:${this.name} exists`);
                return false;
            } else {
                console.log(`Error validating org:${this.name}`);
                throw error;
            }
        }
        
    }

    /*
     true - if there is another org owned by current user with same name
     false - not duplicate
    */
    async existsInDB(userID){
        console.log(`Checking if org: ${this.name} exists in db`);
        var sql = `SELECT 1 FROM ${this.dbtable} WHERE ${dbColumn.org_name} = '${this.name}' AND ${dbColumn.user_id} = '${userID}' LIMIT 1;`;

        try {
            var result = await db.query(sql);
        } catch (error) {
            console.log("ERROR: existsInDB failed on query");
            throw error;
        }
        // console.log(`DEBUG: existsInDB Result`);
        // console.log(result);

        // result.length > 0 means a list of results were returned
        // from db meaning it's a duplicate
        let len = result[0].length
        console.log(len);
        return (Boolean(len > 0));
    }

    async initializeDB(){
        console.log(`Adding org: ${this.name}:${await this.getGithubID()} to database...`)
        //this.id = this.getRandomId();
        try{
            this.githubID = await this.getGithubID();
        } catch (error) {
            console.log("ERROR: failed to get GitHub ID while making new DB entry\n", error);
            throw error;
        }
        
        // Here we are putting user inputs into a SQL command.
        // I think we are okay, because we validate they are GH orgs and tokens first.
        // need to figure out way to encrypt and decrypt token
        // this needs work
        var sql = `INSERT INTO ${this.dbtable} (${dbColumn.gh_id}, 
        ${dbColumn.org_name}, ${dbColumn.auth_token}, ${dbColumn.user_id}) 
        VALUES (${this.githubID}, '${this.name}', '${this.token}', ${this.userID})`;
        
        try {
            var result = await db.query(sql);
        } catch (error) {
            console.log(`ERROR: query to make new DB entry for org:${this.name} failed\n`, error);
            throw error;
        }
        // console.log(`DEBUG: db entry result`);
        // console.log(result);
    }

    // requires userID and name to be set
    async getFromDatabase(){
        console.log("Getting org data from db");
        if (this.userID === undefined){
            throw new Error ("Attemping to retrieve org from database but userID is not set");
        }

        if (!this.existsInDB(this.userID)){
            throw new Error ("Attempted to retrieve org that does not exist in database");
        }

        let sql = `SELECT * FROM ${this.dbtable} WHERE ${dbColumn.org_name} = '${this.name}' AND ${dbColumn.user_id} = '${this.userID}'`;
        
        try {
            var result = await db.query(sql);
        } catch (error) {
            console.log("ERROR: getOrgFromDatabase failed", error);
            throw error;
        }

        /////////////////////////////////////
        console.log(result);
        result.forEach(function(currentValue, index, arr){
            console.log(`currVal: ${currentValue} ind: ${index} arr: ${arr}`);
        })
        ////////////////////////////////

        let row = result[0].TextRow;
        console.log(row);
    }

    async getReposList(){
        var repos;
        const octokit = new Octokit({
            auth: `token ${this.token}`
          });
        for await (const response of octokit.paginate(octokit.rest.repos.listForOrg({
            org: this.name,
            per_page: 100
        })
        )) {
            response.forEach(element => {
                repos.append(element.name)
            });
        }
        return repos;
    }

    async scanOrg(){
        // get all repos
        const repos = getReposList();
        console.log(repos);
        // create a repo object for each repo
        // tell each repo object to scan itself and create db entries as needed
        //     octokit.rest.repos.getContent
        // parser class?
    }
}

module.exports = Organization;