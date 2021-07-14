const Logger = require('../../loaders/logger');
const path = require('path');

module.exports = class DependencyFile {
    constructor(fileInfo) {
        this.path = fileInfo.path;
        this.mode = fileInfo.mode;
        this.type = fileInfo.type;
        this.sha = fileInfo.sha;
        this.size = fileInfo.size;
        this.url = fileInfo.url;
    }

    async parse(){
        let parser = determineParser(this.path);

    }

}

async function determineParser(filePath) {
    let fileName = path.basename(filePath)
    switch (fileName) {
        case 'package.json':
            return require('./parsers/package-json.parser.js');
    }
}

/*
backend_1   | {
backend_1   |   path: 'package.json',
backend_1   |   mode: '100644',
backend_1   |   type: 'blob',
backend_1   |   sha: 'efa06499f54f456d98a7568662d12ea7610fe112',
backend_1   |   size: 2146,
backend_1   |   url: 'https://api.github.com/repos/adobe/reactor-bridge/git/blobs/efa06499f54f456d98a7568662d12ea7610fe112'
backend_1   | }
*/