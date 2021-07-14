const Logger = require("../loaders/logger");
const config = require("../config");
const path = require('path');

const DEP_FILES = [
    'Gemfile',
    'Gemfile.lock',
    'requirements.txt',
    'package.json',
    //'package-lock.json'
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