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

    get getGithubID(){
        return this.githubID;
    }

    async validateToken(){
        const octokit = new Octokit({
            auth: `token ${this.token}`
          });
        let result = await octokit.rest.users.getAuthenticated();
        if (result.status == 200){
            console.log(`user:${result.data.login} token verified`);
            return true;
        }
        else{ //401 if bad
            console.log(`Unable to validate OAuth Token is valid`);
            return false;
        }
    }

    async validateOrg(){
        const octokit = new Octokit({
            auth: `token ${this.token}`
          });
        let result = await octokit.rest.orgs.get({
            org: this.name
        });
        if (result.status == 200){
            console.log(`org:${this.name} verified`);
            // get the org's github given id
            this.githubID = result.data.id;
            return true;
        }
        else{
            console.log(`Unable to validate org:${this.name} exists`);
            return false;
        }
    }

    checkDuplicate(){
        var sql = `SELECT 1 FROM ${this.dbtable} WHERE ${dbCol.gh_id} = ${this.gh_id}`;
        db.query(sql,)
    }

    async initializeDB(){
        this.id = this.getRandomId();
        
        // Here we are putting user inputs into a SQL command.
        // I think we are okay, because we validate they are GH orgs and tokens first.
        // need to figure out way to encrypt and decrypt token
        // this needs work
        var sql = `INSERT INTO ${this.dbtable} (${dbCol.org_id}, ${dbCol.gh_id}, ${dbCol.org_name}, ${dbCol.auth_token}) 
        VALUES (${this.id}, ${this.githubID}, '${this.name}', '${this.token}')`;
        db.query(sql, function(err, result){
            if (err){
                /*
                Need to handle this error gracefully, by spinning up a new key and trying again.
                
                 Error: Error: Duplicate entry '111111' for key 'organization.PRIMARY'
backend_1   |     at Query.onResult (/cbom-maker/src/organization.js:107:23)
backend_1   |     at Query.execute (/cbom-maker/node_modules/mysql2/lib/commands/command.js:30:14)
backend_1   |     at Connection.handlePacket (/cbom-maker/node_modules/mysql2/lib/connection.js:425:32)
backend_1   |     at PacketParser.onPacket (/cbom-maker/node_modules/mysql2/lib/connection.js:75:12)
backend_1   |     at PacketParser.executeStart (/cbom-maker/node_modules/mysql2/lib/packet_parser.js:75:16)
backend_1   |     at Socket.<anonymous> (/cbom-maker/node_modules/mysql2/lib/connection.js:82:25)
backend_1   |     at Socket.emit (node:events:394:28)
backend_1   |     at addChunk (node:internal/streams/readable:312:12)
backend_1   |     at readableAddChunk (node:internal/streams/readable:287:9)
backend_1   |     at Socket.Readable.push (node:internal/streams/readable:226:10)
*/
                console.log('unable to insert into db');
                throw new Error(err);
            }
            else{
                console.log(`DEBUG: db entry result: ${result}`);
            }
        });
        
    }
}

module.exports = Organization;