const userModel = require("#models/userModel");
const UserValidator = require("#utils/validators/userValidator");
const tokenController = require("#controllers/tokenController");
const ApiError = require("#utils/exceptions/apiError");
const Log = require('#log');

module.exports = {
    register: async (req, res, next) => {
        try{
            Log.info(req.body, "[UserController] Start user registration");
            let salt = Math.round(100 - 0.5 + Math.random() * (1000 - 100 + 1));
            const validator = new UserValidator(req.body, {nickname: ["nickname"], email:["email"], password: ["password", "passwordCompare:password:passwordRepeat"]});

            if (validator.errors.length)
                throw ApiError.BadRequest(validator.errors, "[UserController]");

            const user = await userModel.create({...req.body, salt});
            const tokens = tokenController.generateTokens({...user.dataValues, password: undefined, salt: undefined});
            await tokenController.saveToken(user.id, tokens.refreshToken);

            res.cookie('refreshToken', tokens.refreshToken, {maxAge: 30*24*60*60*1000, httpOnly:true})
            Log.info("[UserController] End user registration");
            res.status(201).json({...user.dataValues, password: undefined, salt: undefined, accessToken: tokens.accessToken});
        }
        catch (e){
            next(e);
        }
    },

    auth: async (req, res, next) => {
        try{
            Log.info(req.body, "[UserController] Start user authorization");
            const validator = new UserValidator(req.body, {email:["email"], password: ["password"]});

            if (validator.errors.length)
                throw ApiError.BadRequest(validator.errors, "[UserController]");

            const user = await userModel.login(req.body);
            const tokens = tokenController.generateTokens({...user.dataValues, password: undefined, salt: undefined});
            await tokenController.saveToken(user.id, tokens.refreshToken);

            res.cookie('refreshToken', tokens.refreshToken, {maxAge: 30*24*60*60*1000, httpOnly:true})
            Log.info("[UserController] End user authorization");
            res.status(200).json({...user.dataValues, password: undefined, salt: undefined, accessToken: tokens.accessToken});
        }
        catch (e){
            next(e);
        }
    },

    logout: async (req, res, next) => {
        try{
            Log.info("[UserController] Start user logout");
            const {refreshToken} = req.cookies;
            await tokenController.deleteToken(refreshToken);
            res.clearCookie("refreshToken");
            Log.info("[UserController] End user logout");
            res.status(200).json();
        }
        catch (e){
            next(e);
        }
    },

    refresh: async (req, res, next) => {
        try{
            Log.info("[UserController] Start user refresh token");
            const {refreshToken} = req.cookies;
            const userData = await tokenController.refreshToken(refreshToken);
            const user = await userModel.findId(userData.id);
            const tokens = tokenController.generateTokens({...user, password: undefined, salt: undefined});
            await tokenController.saveToken(user.id, tokens.refreshToken);

            res.cookie('refreshToken', tokens.refreshToken, {maxAge: 30*24*60*60*1000, httpOnly:true});
            Log.info("[UserController] End user refresh token");
            res.status(200).json({...user.dataValues, password: undefined, salt: undefined, accessToken: tokens.accessToken});
        }
        catch (e){
            next(e);
        }
    },

    get: async (req, res, next) => {
        try{
            Log.info("[UserController] Start get user");
            const user = await userModel.findId(req.params?.id);
            if (!user)
                throw ApiError.BadRequest([], "[UserController]");
            Log.info("[UserController] End get user");
            res.status(200).json({...user, password: undefined, salt: undefined});
        }
        catch (e){
            next(e);
        }
    },

};