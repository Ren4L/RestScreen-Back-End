const jwt = require('jsonwebtoken');
const tokenModel = require('#models/tokenModel');
const ApiError = require("#utils/exceptions/apiError");
const Log = require("#log");
require('dotenv').config();

module.exports = {
    generateTokens(payload){
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {expiresIn: '15m'});
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {expiresIn: '1d'});
        return {accessToken, refreshToken};
    },

    async saveToken(user_id, refresh_token){
        await tokenModel.deleteByUserId(user_id);
        await tokenModel.create(user_id, refresh_token);
    },

    async deleteToken(refresh_token){
        if (!refresh_token)
            throw ApiError.UnauthorizedError();
        let deleteToken = await tokenModel.delete(refresh_token);
        return deleteToken;
    },

    async refreshToken(refresh_token){
        if (!refresh_token)
            throw ApiError.UnauthorizedError();
        const userData = this.validateRefreshToken(refresh_token);
        const tokenIncludeDB = await tokenModel.find(refresh_token);
        if(!userData || !tokenIncludeDB)
            throw ApiError.UnauthorizedError();
        return userData;
    },

    validateAccessToken(token) {
        try{
            return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        }
        catch (e) {
            return null;
        }
    },

    validateRefreshToken(token) {
        try{
            return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
        }
        catch (e) {
            return null;
        }
    },
}