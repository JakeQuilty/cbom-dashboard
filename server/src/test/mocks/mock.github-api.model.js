const extend = require('extend');

module.exports = class GitHubModel {

    constructor (params) {
        // default values
        var config = extend({
            validateToken: true,
            validateOrg: true,
            getOrgGithubID: '12345'
        }, params);

        this.validateToken_ = config.validateToken;
        this.validateOrg_ = config.validateOrg;
        this.getOrgGithubID_ = config.getOrgGithubID;
    }

    async validateToken(token){
        return this.validateToken_;
    }

    async validateOrg(authToken, orgName) {
        return this.validateOrg_;
    }

    async getOrgGithubID(authToken, orgName) {
        return this.getOrgGithubID_;
    }

}