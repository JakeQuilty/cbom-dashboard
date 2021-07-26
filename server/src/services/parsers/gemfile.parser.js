const { interpret } = require('gemfile');

let parsedDeps = []
async function gemfileParser(blob) {
    let parsedGemfile = interpret(blob);

    for (const key in parsedGemfile.GEM.specs) {
        parsedDeps.push({
            name: key,
            version: parsedGemfile.GEM.specs[key].version
        });
    }
    return parsedDeps;
}

module.exports = {
    gemfileParser
}