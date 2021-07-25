const config = require('../config');

const ERROR_STATUS = {
    [config.ERROR_MESSAGES.invalid_token]: 401,
    [config.ERROR_MESSAGES.invalid_org]: 404,
    [config.ERROR_MESSAGES.invalid_dep_name]: 404,
    [config.ERROR_MESSAGES.internal]: 500
}


const errorHandler = async function (error) {
    // default to 500 Internal Server Error
    if (ERROR_STATUS[error.message] === undefined) {
        return {status: ERROR_STATUS[config.ERROR_MESSAGES.internal], error: config.ERROR_MESSAGES.internal};
    }

    return {status: ERROR_STATUS[error.message], error: error.message};
}

module.exports = {
    errorHandler
}