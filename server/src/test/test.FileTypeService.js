const assert = require('assert');
const SequelizeMock = require('sequelize-mock');
const FileTypeService = require('../services/FileTypeService');
// const { models } = require('../models/db');

// setup mock db
const dbMock = new SequelizeMock({
    options: {
        timestamps: false,
        autoQueryFallback: false
    }
});
const FileTypeMock = dbMock.define('FileType', {
    options: {
        timestamps: false,
        autoQueryFallback: false,
        isNewRecord: false
    }
});

describe('FileTypeService', function () {
    afterEach(async function() {
        await FileTypeMock.$queryInterface.$clearQueue();
        await FileTypeMock.$queryInterface.$clearHandlers();
        await FileTypeMock.$queryInterface.$clearResults();
    });

    describe('getLanguageID()', function() {
        it('should return the file type id from db', async function () {
            FileTypeMock.$queryInterface.$useHandler(function(query, queryOptions, done) {
                if (query === 'findOne') {
                    return FileTypeMock.build({
                        type_id: 3,
                        language_name: 'javascript'
                    });
                }
            });
            
            const param = 'javascript';
            const ftService = new FileTypeService(dbMock.models);
            const expected = 3;
            assert.strictEqual(await ftService.getLanguageID(param), expected);
        });
        
        it('should return null', async function () {
            FileTypeMock.$queryInterface.$useHandler(function(query, queryOptions, done) {
                return Promise.resolve(null);
            });
            const param = 'python';
            const ftService = new FileTypeService(dbMock.models);
            const expected = null;
            assert.strictEqual(await ftService.getLanguageID(param), expected);
        });
    });

    describe('getAllLanguageID()', function() {
    
        it('should return an array of the languages and ids', async function () {
            FileTypeMock.$queryInterface.$useHandler(function(query, queryOptions, done) {
                if (query === "findAll") {
                    return [ FileTypeMock.build({
                            type_id: 1,
                            language_name: 'python'
                            }),
                        FileTypeMock.build({
                            type_id: 2,
                            language_name: 'ruby'
                        }),
                        FileTypeMock.build({
                            type_id: 3,
                            language_name: 'javascript'
                        })
                    ];
                }
            });

                const ftService = new FileTypeService(dbMock.models);
                const expected = {python: 1, ruby: 2, javascript: 3};
            assert.deepStrictEqual(await ftService.getAllLanguageID(), expected);
        });

        // it('integration test', async function () {
        //     const ftService = new FileTypeService(models);
        //     const expected = {python: 1, ruby: 2, javascript: 3};
        //     assert.deepStrictEqual(await ftService.getAllLanguageID(), expected);
        // })
    });

});