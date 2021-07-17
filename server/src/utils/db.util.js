const dbResultToObject= (dbResult) => {
    for (result of dbResult) {
        for (const [key, value] of Object.entries(result[0].dataValues)) {
            resultObject[key] = value;
        }
    }
    return resultObject;
}

module.exports = {
    dbResultToObject
}