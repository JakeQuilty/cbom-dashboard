const assert = require('assert');
const SequelizeMock = require('sequelize-mock');
const RepoService = require('../services/RepoService');

// setup mock db
const dbMock = new SequelizeMock({
    options: {
        timestamps: false,
        autoQueryFallback: false
    }
});
var RepoMock = dbMock.define('Repository', {
    // repo_id: '200',
    // repo_name: 'test-repo',
    // default_branch: 'main',
    // org_id: '5'
});


describe('create()', function() {
    afterEach(function() {
        RepoMock.$clearQueue();
    });

    describe('param validation', async function() {
        const repoService = new RepoService(null, dbMock.models);
        
        it('should throw ValidationError', async function() {
            let params = {};
            (async () => {
                await assert.rejects(
                    repoService.create(params),
                    (err) => {
                        assert.strictEqual(err.name, 'ValidationError');
                        return true;
                    }
                );
            });
        });
    });

    describe('create db entry', function() {
        afterEach(function() {
            RepoMock.$clearQueue();
        });
        
        describe('none in db', function () {
            const repoService = new RepoService(null, dbMock.models);

            let params = {repoName: 'repo', orgID: 7, defaultBranch: 'master'};
            // repo_id is undefined, bc MySQL does the assigning
            // this shit mocker doesn't account for the defaults on findOrCreate, so
            // we can't test if the default_branch gets set. Through integration tests ik it does
            let expected = {repo_id: undefined, repo_name: 'repo', org_id: 7};
            it('should create new repo', async function () {
                let result = await repoService.create(params)
                assert.deepStrictEqual({
                    org_id: result.org_id,
                    repo_id: result.repo_id,
                    repo_name: result.repo_name,
                }, expected);
            });
        });

        describe('one in db', function () {
            const repoService = new RepoService(null, dbMock.models);

            RepoMock.$queueResult(RepoMock.build({
                repo_id: 777,
                repo_name: 'test',
                deffault_branch: 'master',
                org_id: 42
            }));

            let params = {repoName: 'test', orgID: 42, defaultBranch: 'master'};
            // repo_id is undefined, bc MySQL does the assigning
            // this shit mocker doesn't account for the defaults on findOrCreate, so
            // we can't test if the default_branch gets set. Through integration tests ik it does
            let expected = {repo_id: undefined, repo_name: 'test', org_id: 42};
            it('should return the repo', async function () {
                let result = await repoService.create(params)
                assert.deepStrictEqual({
                    org_id: result.org_id,
                    repo_id: result.repo_id,
                    repo_name: result.repo_name,
                }, expected);
            });
        });

        // we can't test for this, because the mocker doesn't understand the defaults in findOrCreate.
        describe.skip('one in db - with outdated main branch', function () {
            const repoService = new RepoService(null, dbMock.models);

            RepoMock.$queueResult(RepoMock.build({
                repo_id: undefined,
                repo_name: 'test',
                default_branch: 'master',
                org_id: 42
            }));

            let params = {repoName: 'test', orgID: 42, defaultBranch: 'main'};
            // repo_id is undefined, bc MySQL does the assigning
            let expected = {repo_id: undefined, repo_name: 'test', org_id: 42, default_branch: 'main'};
            it('should update default branch and return repo with updated branch', async function () {
                let result = await repoService.create(params)
                assert.deepStrictEqual({
                    default_branch: result.default_branch,
                    org_id: result.org_id,
                    repo_id: result.repo_id,
                    repo_name: result.repo_name,
                }, expected);
            });
        });

    });

});