const extend = require('extend');

module.exports = class DatabaseService {
    constructor (params) {
        // default values
        var config = extend({
            orgExists: true,
            orgCreateEntry: '1234',
        }, params);

        this.orgExists_ =  config.orgExists;
        this.orgCreateEntry_ = config.orgCreateEntry;
    }

    async orgExists (params) {
        return this.orgExists_;
    }

    async orgCreateEntry(params) {
        return this.orgCreateEntry_;
    }

    // async orgRetrieve(params) {

    // }
}