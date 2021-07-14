const extend = require('extend');

module.exports = class GitHubModel {

    constructor (params) {
        // default values
        var config = extend({
            validateToken: true,
            validateOrg: true
        }, params);

        this.validateToken_ = config.validateToken;
        this.validateOrg_ = config.validateOrg;
    }

    async validateToken(token){
        return this.validateToken_;
    }

    async validateOrg(authToken, orgName) {
        return this.validateOrg_;
    }

}