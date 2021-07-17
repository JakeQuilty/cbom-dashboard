const assert = require('assert');
const OrgService = require('../services/OrgService');
const MockGitHubModel = require('./mocks/mock.github-api.model');
const MockDBService = require('./mocks/mock.DatabaseService');

describe('OrgService', function () {
    describe('CreateNewOrg()', function() {
        it('should return with 401 when token is invalid', async function() {
            let expected = {status: 401, data: {message: "invalid token"}};
            let ghMock = new MockGitHubModel({validateToken: false});
            let dbMock = new MockDBService({orgExists: false});
            let orgService = new OrgService(ghMock,dbMock);
            let reqBody = {name: 'testOrg', ghAuthToken: 'invalid token', userID: '1'};
            assert.deepStrictEqual(await orgService.CreateNewOrg(reqBody), expected);
        });

        it('should return with 404 when org is invalid', async function() {
            let expected = {status: 404, data: {message: "invalid organization"}};
            let ghMock = new MockGitHubModel({validateOrg: false});
            let dbMock = new MockDBService({orgExists: false});
            let orgService = new OrgService(ghMock,dbMock);
            let reqBody = {name: 'invalid org', ghAuthToken: 'asdlkfksa3123gfdsnv', userID: '1'};
            assert.deepStrictEqual(await orgService.CreateNewOrg(reqBody), expected);
        })

        it('should return with 409 when organization already exists', async function() {
            let expected = {status: 409, data: {message: "organization already exists"}};
            let ghMock = new MockGitHubModel({});
            let dbMock = new MockDBService({});
            let orgService = new OrgService(ghMock,dbMock);
            let reqBody = {name: 'duplicate org', ghAuthToken: 'asdlkfksa3123gfdsnv', userID: '1'};
            assert.deepStrictEqual(await orgService.CreateNewOrg(reqBody), expected);
        })
        it('should return with 200 when run successfully', async function() {
            let expected = {status: 200, data: {name: 'testorg'}};
            let ghMock = new MockGitHubModel({});
            let dbMock = new MockDBService({orgExists: false});
            let orgService = new OrgService(ghMock,dbMock);
            let reqBody = {name: 'testorg', ghAuthToken: 'asdlkfksa3123gfdsnv', userID: '1'};
            assert.deepStrictEqual(await orgService.CreateNewOrg(reqBody), expected);
        })
    });
});