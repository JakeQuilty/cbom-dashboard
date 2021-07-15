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

var UserMock = dbMock.define('User', {
    user_id: '1',
    user_name: 'root',
    user_password: 'p@ssW0rd',
    first_name: 'Jake',
    last_name: 'Quilty',
    account_priv: '0'
});
var OrgMock = dbMock.define('Organization', {
    org_id: '',
    gh_id: '',
    org_name: '',
    auth_token: {
        iv: '',
        content: ''
    },
    user_id: ''
});
var RepoMock = dbMock.define('Repository', {
    repo_id: '200',
    repo_name: 'test-repo',
    default_branch: 'main',
    org_id: '5'
});

describe('hooks', function() {
    afterEach(function() {
        UserMock.$clearQueue();
        OrgMock.$clearQueue();
        RepoMock.$clearQueue();
    })

    // This needs to stay first, because the org id will go up one with each
    // test that adds to the mock db
    describe('orgCreateEntry()', function() {
        describe('create entry for org in db', async function() {
            let dbService = new DatabaseService(dbMock.models);

            let params = {orgName: 'testOrg', userID: '1', githubID: '12345', token: 'jdaskcnjkasndjkfa'};
            let result = await dbService.orgCreateEntry(params)
            it('should return org id number',function() {
                let expected = 1;
                assert.strictEqual(result, expected);
            });
            // it('should create with expected values', function(){
            //     let expected = {
            //         org_id: 
            //     }
            // });
        })
    });

    describe('orgExists()', function() {
        describe('duplicate', function() {

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
            //let modelsMock = new MockModels({});
            let dbService = new DatabaseService(dbMock.models);
            it('should return true', async function() {
                let params = {orgName: 'testorgs', userID: '1'};
                assert.strictEqual(await dbService.orgExists(params), expected);
            });
        });

        describe('no duplicate', function() {
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
            it('should return false', async function() {
                let params = {orgName: 'testOrg', userID: '1'};
                assert.strictEqual(await dbService.orgExists(params), expected);
            });
        });
    });

});