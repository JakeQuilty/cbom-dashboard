const assert = require('assert');
const OrgService = require('../services/OrgService');
const MockGitHubModel = require('./mocks/mock.github-api.model');
const MockDBService = require('./mocks/mock.DatabaseService');

describe('CreateNewOrg()', function() {
    describe('invalid api token', function() {
        let expected = {status: 401, data: {message: "invalid token"}};
        let ghMock = new MockGitHubModel({validateToken: false});
        let dbMock = new MockDBService({orgExists: false});
        let orgService = new OrgService(ghMock,dbMock);
        it('should return with 401', async function() {
            let reqBody = {name: 'testOrg', ghAuthToken: 'invalid token', userID: '1'};
            assert.deepStrictEqual(await orgService.CreateNewOrg(reqBody), expected);
        })
    });

    describe('invalid org', function() {
        let expected = {status: 404, data: {message: "invalid organization"}};
        let ghMock = new MockGitHubModel({validateOrg: false});
        let dbMock = new MockDBService({orgExists: false});
        let orgService = new OrgService(ghMock,dbMock);
        it('should return with 404', async function() {
            let reqBody = {name: 'invalid org', ghAuthToken: 'asdlkfksa3123gfdsnv', userID: '1'};
            assert.deepStrictEqual(await orgService.CreateNewOrg(reqBody), expected);
        })
    });

    describe('org already exists in db', function() {
        let expected = {status: 409, data: {message: "organization already exists"}};
        let ghMock = new MockGitHubModel({});
        let dbMock = new MockDBService({});
        let orgService = new OrgService(ghMock,dbMock);
        it('should return with 409', async function() {
            let reqBody = {name: 'duplicate org', ghAuthToken: 'asdlkfksa3123gfdsnv', userID: '1'};
            assert.deepStrictEqual(await orgService.CreateNewOrg(reqBody), expected);
        })
    });

    describe('successful run', function() {
        let expected = {status: 200, data: {name: 'testorg'}};
        let ghMock = new MockGitHubModel({});
        let dbMock = new MockDBService({orgExists: false});
        let orgService = new OrgService(ghMock,dbMock);
        it('should return with 200', async function() {
            let reqBody = {name: 'testorg', ghAuthToken: 'asdlkfksa3123gfdsnv', userID: '1'};
            assert.deepStrictEqual(await orgService.CreateNewOrg(reqBody), expected);
        })
    });
});