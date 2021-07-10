const Logger = require("../loaders/logger");
const config = require("../config");
const path = require('path');

const DEP_FILES = [
    'Gemfile',
    'Gemfile.lock',
    'requirements.txt',
    'package.json',
    'package-lock.json'
];

const isDepFile = async function(type, fullPath){
    if (type !== 'blob') return false;
    
    let fileName = path.basename(fullPath)
    if (DEP_FILES.includes(fileName)) return true;
    
    return false;
}

module.exports = {
    isDepFile,
}

/*
backend_1   | {
backend_1   |   path: 'src/extensions/default/StaticServer/StaticServer.js',
backend_1   |   mode: '100644',
backend_1   |   type: 'blob',
backend_1   |   sha: '87db4b50ec1ca4dcf6c1fc45db92f1e819428008',
backend_1   |   size: 8502,
backend_1   |   url: 'https://api.github.com/repos/adobe/brackets/git/blobs/87db4b50ec1ca4dcf6c1fc45db92f1e819428008'
backend_1   | }
*/