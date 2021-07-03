const { Octokit } = require("@octokit/rest");

async function validateToken(authToken){
    console.log("Validating token...");
    try{
        const octokit = new Octokit({
            auth: `token ${authToken}`
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

async function validateOrg(){
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