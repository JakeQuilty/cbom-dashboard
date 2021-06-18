const { Octokit } = require("@octokit/rest");
const mysql = require('mysql');
const Database = require('./database.js');

class Organization {
    constructor(orgName, oauthToken){
        this.name = orgName;
        this.token = oauthToken;
        this.dbtable = "organization";
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

    get getGithubID(){
        return this.githubID;
    }

    //401 if bad
    validateToken(){
        const result = new Octokit({
            auth: `token ${this.token}`
          });
        if (result.status == 200){
            console.log('user token verified');
            return true;
        }
        else{
            console.log(`Unable to validate OAuth Token is valid`);
            return false;
        }
    }

    validateOrg(){
        const octokit = new Octokit({
            auth: `token ${this.token}`
          });
        octokit.rest.orgs.get({
            org: this.name
        }).then(response => {
            console.log(`org:${this.name} verified`);
            // get the org's github given id
            this.githubID = response.data.id;
            return true;
        }).catch(error => {
            console.log(`Unable to validate org:${this.name} exists`);
            return false;
        });
    }

    createDBEntry(){
        // if either token or org is not valid, throw err instead of putting in db
        let tokenVal = this.validateToken();
        let orgVal = this.validateOrg();
        if (!tokenVal || !orgVal){
            console.log('cannot create db entry for broken data');
            throw new Error("invalid data");
        }
        var db = new Database().connect(
        ).catch(error => {
            console.log('unable to connect to db');
            throw error;
        });

        this.id = db.getRandomId;
        // Here we are putting user inputs into a SQL command.
        // I think we are okay, because we validate they are GH orgs and tokens first.
        // need to figure out way to encrypt and decrypt token
        var sql = `INSERT INTO ${this.dbtable} VALUES (${this.id}, ${this.githubID}, ${this.name}, ${this.token})`;

        db.query(sql, function (err, result) {
            if (err){
                console.log('unable to insert into db');
                throw new Error(err);
            }
            else{
                console.log(result.message);
            }
        });


        
    }
}

module.exports = Organization;