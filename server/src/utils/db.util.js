const dbResultToObject = (dbResult) => {
    for (result of dbResult) {
        for (const [key, value] of Object.entries(result[0].dataValues)) {
            resultObject[key] = value;
        }
    }
    return resultObject;
}

const getDate = () => {
    let dateObject = new Date();
    return dateObject.getFullYear()+"-"+dateObject.getMonth()+"-"+("0" + dateObject.getDate()).slice(-2);
}

module.exports = {
    dbResultToObject,
    getDate
}