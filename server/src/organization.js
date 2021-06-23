const { Octokit } = require("@octokit/rest");
const db = require('./database.js');

const dbCol = {
    org_id: "org_id",
    gh_id: "gh_id",
    org_name: "org_name",
    auth_token: "auth_token",
    user_id: "user_id"
};

class Organization {
    constructor(orgName, oauthToken){
        this.name = orgName;
        this.token = oauthToken;
        this.dbtable = "organization";
        this.githubID;
    }

    getRandomId(){
        return Math.floor(Math.random() * 10000000);
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
                console.log(`org:${this.name} GitHub ID retrieval: fail`);
                return undefined;
            }
        }else{
            return this.githubID;
        }
    }

    async validateToken(){
        console.log("Validating token...")
        try{
            const octokit = new Octokit({
                auth: `token ${this.token}`
              }); 
            let result = await octokit.rest.users.getAuthenticated();
            if (result.status == 200){
                console.log(`user:${result.data.login} token verified`);
                return true;
            } else {
                console.log("Unknown result");
                console.log(result);
                return false;
            }
        }catch (error) {
            if (error.status == 401) {
                console.log(`Unable to validate OAuth Token is valid`);
                return false;
            } else {
                console.log(`Error validating token`);
                throw error;
              }
        }
    }

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

    // true - if there is another org with same gh_id in database
    // the ghub id is unique, so this is a good way to tell
    async isDuplicate(ghID){
        console.log(`Checking db for duplicate org: ${this.name}:${ghID}`);
        var sql = `SELECT 1 FROM ${this.dbtable} WHERE ${dbCol.gh_id} = ${ghID}`;
        db.query(sql, function(err, result){
            if (err) throw new Error(err);
            else {
                console.log(`DEBUG: RESULT`);
                console.log(result);
                // Object.keys(result).forEach(function(key){
                //     var row = result[key];
                //     console.log(row.name);
                // });
                // result.length > 0 means a list of results were returned
                // from db meaning it's a duplicate
                let len = result.length
                console.log(Boolean(len > 0));
                return (Boolean(len > 0));
            }
        });
    }

    async initializeDB(){
        console.log(`Adding org: ${this.name}:${await this.getGithubID()} to database...`)
        this.id = this.getRandomId();
        
        // Here we are putting user inputs into a SQL command.
        // I think we are okay, because we validate they are GH orgs and tokens first.
        // need to figure out way to encrypt and decrypt token
        // this needs work
        var sql = `INSERT INTO ${this.dbtable} (${dbCol.org_id}, ${dbCol.gh_id}, ${dbCol.org_name}, ${dbCol.auth_token}) 
        VALUES (${this.id}, ${await this.getGithubID()}, '${this.name}', '${this.token}')`;
        db.query(sql, function(err, result){
            if (err) throw new Error(err);
            else{
                console.log(`DEBUG: db entry result\n${result}`);
                console.log(result);
            }
        });
        
    }
}

module.exports = Organization;