const ApiError = require("#utils/exceptions/apiError");
const TokenController = require("#controllers/tokenController");
const Log = require("#log");

module.exports = function (req, res, next) {
    try {
        const authorizationHeader = req.headers.authorization;
        if (!authorizationHeader)
            return next(ApiError.UnauthorizedError());
        const accessToken = authorizationHeader.split(' ')[1];
        if (!accessToken)
            return next(ApiError.UnauthorizedError());
        const userData = TokenController.validateAccessToken(accessToken);
        if (!userData)
            return next(ApiError.UnauthorizedError());
        next();
    }
    catch (e) {
        return next(ApiError.UnauthorizedError());
    }
}