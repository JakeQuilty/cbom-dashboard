const Logger = require("../../loaders/logger");

// examples:
// https://github.com/mozilla/bigquery-etl/blob/main/requirements.txt
// https://github.com/mozilla/libmozevent/blob/master/requirements.txt
// https://github.com/adobe/stringlifier/blob/main/requirements.txt
// https://github.com/adobe/antialiased-cnns/blob/master/requirements.txt
async function requirementsParser(blob) {
    try {
        // regex failing here:
        // https://github.com/ProtonMail/haproxy-health-check/blob/master/requirements.txt
        const regexp = /^[a-z]*-?_?[a-z]*[<=>]{2}[\d.\w]*|^[\w-_]*$/gim;
        
        let regged = blob.matchAll(regexp);

        let formattedDeps = []
        for (const line of regged) {
            console.log(line);
            if (line[0] !== '') {
                console.log(line[0].split(/(?=[<=>]{2})/));
                const depVersionSplit = line[0].split(/(?=[<=>]{2})/);
                // if there is no version specified
                // filling in with a space, bc db rules won't let it be empty
                if (depVersionSplit.length === 1) {
                    formattedDeps.push({
                        name: depVersionSplit[0],
                        version: ' '
                    });
                } else {
                    formattedDeps.push({
                        name: depVersionSplit[0],
                        version: depVersionSplit[1]
                    });
                }
            }
        }
        console.log(formattedDeps);
        return formattedDeps;
    } catch (error) {
        Logger.error("Requirements.txt parser failed to parse:", blob);
        throw error;
    }
    
}

module.exports = {
    requirementsParser
}