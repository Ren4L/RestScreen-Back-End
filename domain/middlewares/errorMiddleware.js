const ApiError = require('#utils/exceptions/apiError');
const Log = require('#log');

module.exports = function (err, req, res, next) {
    if (err.statusCode < 400 || err.statusCode > 499)
        Log.error(err.obj, `${err.controller ? err.controller : ""} ${err.stack.replace('Error: ', "")}`);
    if (err instanceof ApiError){
        return res.status(err.statusCode).json({message: err.message, errors: err.errors});
    }
    return res.status(500).json({message: "Unexpected error"});
}