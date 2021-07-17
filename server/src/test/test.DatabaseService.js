const assert = require('assert');
const SequelizeMock = require('sequelize-mock');
const proxyquire = require('proxyquire');
const DatabaseService = require('../services/DatabaseService');

// setup mock db
const dbMock = new SequelizeMock({
    options: {
        timestamps: false,
        autoQueryFallback: false
    }
});
const OrgMock = dbMock.define('Organization', {
});

describe('DatabaseService', function() {

    describe('orgCreateEntry()', function() {
        afterEach(function() {
            OrgMock.$queryInterface.$clearResults();
        })

        // have to skip this bc shitty mock won't handle if query is create
        it.skip('should return org id number from db', async function() {
            OrgMock.$queryInterface.$useHandler(function(query, queryOptions, done) {
                if (query === 'create') {
                    return OrgMock.build({
                        org_id: 123,
                        org_name: 'testOrg',
                        userID: '1',
                        githubID: '12345',
                        token: 'jdaskcnjkasndjkfa'
                    });
                }
            });

            let dbService = new DatabaseService(dbMock.models);
            let params = {orgName: 'testOrg', userID: '1', githubID: '12345', token: 'jdaskcnjkasndjkfa'};
            let result = await dbService.orgCreateEntry(params);
            let expected = 123;
            assert.strictEqual(result, expected);
        });
    });

    describe('orgExists()', function() {
        afterEach(function() {
            OrgMock.$clearQueue();
        })

        it('should return true when orgExists', async function() {
            OrgMock.$queueResult(OrgMock.build({
                org_id: '5',
                gh_id: '12345',
                org_name: 'testorg',
                auth_token: { // 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
                    iv: '69e4afbe141a94093c2b4e522e6f6818',
                    content: 'f67623c78fcb900649b022dee5e53ee4b80f821d6314cf878d55521b35933e8063c8d0ee48fda9db'
                },
                user_id: '1'
            }));

            let expected = true;
            let dbService = new DatabaseService(dbMock.models);
            let params = {orgName: 'testorgs', userID: '1'};
            assert.strictEqual(await dbService.orgExists(params), expected);
        });

        it('should return false when org doesnt exist', async function() {
            // cant figure out how to make the mock not send back a default value
            let modelsMock = new class {
                Organization = {
                    async findOne(params) {
                        return null;
                    }
                }
            };

            let expected = false;
            let dbService = new DatabaseService(modelsMock);
            let params = {orgName: 'testOrg', userID: '1'};
            assert.strictEqual(await dbService.orgExists(params), expected);
        });
    });

});