const userModel = require("../models/userModel");
const UserValidator = require("../utils/validators/userValidator");
const tokenController = require("../controllers/tokenController");
const ApiError = require("../utils/exceptions/apiError");

module.exports = {
    register: async (req, res, next) => {
        try{
            let salt = Math.round(100 - 0.5 + Math.random() * (1000 - 100 + 1));
            const validator = new UserValidator(req.body, {nickname: ["nickname"], email:["email"], password: ["password", "passwordCompare:password:passwordRepeat"]});

            if (validator.errors.length)
                throw ApiError.BadRequest(validator.errors);

            const user = await userModel.create({...req.body, salt});
            const tokens = tokenController.generateTokens({...user.dataValues, password: undefined, salt: undefined});
            await tokenController.saveToken(user.id, tokens.refreshToken);

            res.cookie('refreshToken', tokens.refreshToken, {maxAge: 30*24*60*60*1000, httpOnly:true})
            res.status(201).json({...user.dataValues, password: undefined, salt: undefined, accessToken: tokens.accessToken});
        }
        catch (e){
            next(e);
        }
    },

    auth: async (req, res, next) => {
        try{
            const validator = new UserValidator(req.body, {email:["email"], password: ["password"]});

            if (validator.errors.length)
                throw ApiError.BadRequest(validator.errors);

            const user = await userModel.login(req.body);
            const tokens = tokenController.generateTokens({...user.dataValues, password: undefined, salt: undefined});
            await tokenController.saveToken(user.id, tokens.refreshToken);

            res.cookie('refreshToken', tokens.refreshToken, {maxAge: 30*24*60*60*1000, httpOnly:true})
            res.status(200).json({...user.dataValues, password: undefined, salt: undefined, accessToken: tokens.accessToken});
        }
        catch (e){
            next(e);
        }
    },

    logout: async (req, res, next) => {
        try{
            const {refreshToken} = req.cookies;
            await tokenController.deleteToken(refreshToken);
            res.clearCookie("refreshToken");
            res.status(200).json();
        }
        catch (e){
            next(e);
        }
    },

    refresh: async (req, res, next) => {
        try{
            const {refreshToken} = req.cookies;
            const userData = await tokenController.refreshToken(refreshToken);
            const user = await userModel.findId(userData.id);
            const tokens = tokenController.generateTokens({...user, password: undefined, salt: undefined});
            await tokenController.saveToken(user.id, tokens.refreshToken);

            res.cookie('refreshToken', tokens.refreshToken, {maxAge: 30*24*60*60*1000, httpOnly:true})
            res.status(200).json({...user.dataValues, password: undefined, salt: undefined, accessToken: tokens.accessToken});
        }
        catch (e){
            next(e);
        }
    },

    get: async (req, res, next) => {
        try{
            const user = await userModel.findId(req.params?.id);
            if (!user)
                throw ApiError.BadRequest();
            res.status(200).json({...user, password: undefined, salt: undefined});
        }
        catch (e){
            next(e);
        }
    },

};