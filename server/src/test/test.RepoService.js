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
const RepoMock = dbMock.define('Repository', {
});

describe('RepoService', function () {
    describe('create()', function() {
        afterEach(function() {
            RepoMock.$queryInterface.$clearResults();
        });

        it('should throw ValidationError when params are missing', async function() {
            const repoService = new RepoService(null, dbMock.models);
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
            
        it('should create new repo when no duplicate in db', async function () {
            RepoMock.$queryInterface.$useHandler(function(query, queryOptions, done) {
                if (query === 'findOrCreate') {
                    return [
                        RepoMock.build({
                            repo_id: 123,
                            repo_name: 'repo',
                            default_branch: 'master',
                            org_id: 7
                        }),
                        true
                    ];
                }
            });

            const repoService = new RepoService(null, dbMock.models);
            let params = {repoName: 'repo', orgID: 7, defaultBranch: 'master'};
            let expected = {repo_id: 123, repo_name: 'repo', org_id: 7};
            let result = await repoService.create(params)
            assert.deepStrictEqual({
                org_id: result.org_id,
                repo_id: result.repo_id,
                repo_name: result.repo_name,
            }, expected);
        });

        it('should return the repo that is already in the database', async function () {
            RepoMock.$queryInterface.$useHandler(function(query, queryOptions, done) {
                if (query === 'findOrCreate') {
                    return [
                        RepoMock.build({
                            repo_id: 777,
                            repo_name: 'test',
                            default_branch: 'master',
                            org_id: 42
                        }),
                        false
                    ];
                }
            });

            const repoService = new RepoService(null, dbMock.models);
            let params = {repoName: 'test', orgID: 42, defaultBranch: 'master'};
            let expected = {repo_id: 777, repo_name: 'test', org_id: 42, default_branch: 'master'};
            let result = await repoService.create(params);
            assert.deepStrictEqual({
                org_id: result.org_id,
                repo_id: result.repo_id,
                repo_name: result.repo_name,
                default_branch: result.default_branch
            }, expected);
        });

        it('should update default branch and return repo with updated branch', async function () {
            RepoMock.$queryInterface.$useHandler(function(query, queryOptions, done) {
                if (query === 'findOrCreate') {
                    return [
                        RepoMock.build({
                            repo_id: 20,
                            repo_name: 'test',
                            default_branch: 'master',
                            org_id: 42
                        }),
                        false
                    ];
                }
            });

            RepoMock.$queryInterface.$useHandler(function(query, queryOptions, done) {
                if (query === 'update') return RepoMock.build({
                    repo_id: 20,
                    repo_name: 'test',
                    default_branch: 'main',
                    org_id: 42
                });
            });

            const repoService = new RepoService(null, dbMock.models);
            let params = {repoName: 'test', orgID: 42, defaultBranch: 'main'};
            let expected = {repo_id: 20, repo_name: 'test', org_id: 42, default_branch: 'main'};
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