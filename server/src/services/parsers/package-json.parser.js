

async function javascriptParser(blob) {
    //https://fix.code-error.com/how-to-decode-base64-encoded-json-object-string-in-node-js/
    let objectBlob = JSON.parse(blob);

    // Purposfully not including devDependencies
    // since this app is for monitoring prod deps
    if (objectBlob.dependencies === undefined) {
        return null;
    }

    let parsedDeps = []
    for (const [key, value] of Object.entries(objectBlob.dependencies)) {
        parsedDeps.push({
            name: key,
            version: value
        });
    }
    return parsedDeps;
}

module.exports = {
    javascriptParser
}