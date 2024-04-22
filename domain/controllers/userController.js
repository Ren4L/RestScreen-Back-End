const userModel = require("#models/userModel");
const linkModel = require("#models/linkModel");
const friendModel = require("#models/friendModel");
const videoModel = require("#models/videoModel");
const UserValidator = require("#utils/validators/userValidator");
const tokenController = require("#controllers/tokenController");
const ApiError = require("#utils/exceptions/apiError");
const Log = require('#log');
const {v4: uuidv4} = require("uuid");
require('dotenv').config();

module.exports = {
    register: async (req, res, next) => {
        try{
            let salt = Math.round(100 - 0.5 + Math.random() * (1000 - 100 + 1));
            const validator = new UserValidator(req.body, {nickname: ["nickname"], email:["email"], password: ["password", "passwordCompare:password:passwordRepeat"]});

            if (validator.errors.length)
                throw ApiError.BadRequest(validator.errors, "[UserController]");

            const user = await userModel.create({...req.body, salt});
            const tokens = tokenController.generateTokens({...user.dataValues, password: undefined, salt: undefined});
            await tokenController.saveToken(user.id, tokens.refreshToken);

            res.clearCookie('refreshToken');
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
                throw ApiError.BadRequest(validator.errors, "[UserController]");

            const user = await userModel.login(req.body);
            const tokens = tokenController.generateTokens({...user.dataValues, password: undefined, salt: undefined});
            await tokenController.saveToken(user.id, tokens.refreshToken);

            res.clearCookie('refreshToken');
            res.cookie('refreshToken', tokens.refreshToken, {maxAge: 30*24*60*60*1000, httpOnly:true})
            res.status(200).json({...user.dataValues, password: undefined, salt: undefined, accessToken: tokens.accessToken});
        }
        catch (e){
            Log.info(e.message);
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

            res.clearCookie('refreshToken');
            res.cookie('refreshToken', tokens.refreshToken, {maxAge: 24*60*60*1000, httpOnly:true});
            res.status(200).json({...user.dataValues, password: undefined, salt: undefined, accessToken: tokens.accessToken});
        }
        catch (e){
            Log.error(e.message)
            next(e);
        }
    },

    get: async (req, res, next) => {
        try{
            const user = await userModel.findId(req.params?.id);
            if (!user)
                throw ApiError.BadRequest([], "[UserController]");
            user.subscribers = (await friendModel.findSubscribersByUserId(+req.params?.id)).length;
            user.videos = (await videoModel.getAllByUserId(+req.params?.id)).length;
            res.status(200).json({...user, password: undefined, salt: undefined});
        }
        catch (e){
            next(e);
        }
    },

    editDescription: async (req, res, next) => {
        try{
            const validator = new UserValidator(req?.body, {id: ["number"], description: ["string", "description"]});
            if (validator.errors.length)
                throw ApiError.BadRequest(validator.errors, "[UserController]");
            const { id, description } = req?.body;
            const user = await userModel.editOneColumn(id, "description", description);
            res.status(200).json({...user, password: undefined, salt: undefined});
        }
        catch (e) {
            next(e);
        }
    },
    createLink: async (req, res, next) => {
        try{
            const data = {...req?.body, user_id: +req?.body?.user_id, icon: req?.files?.icon};
            const validator = new UserValidator(data, {user_id: ["notNull"], title: ["string", "min-2", "max-30"], link:["string", "url"]});
            if (validator.errors.length)
                throw ApiError.BadRequest(validator.errors, "[UserController]");
            if (!data?.icon?.data)
                data.icon = null;
            else{
                data.icon =`/public/icon/${uuidv4()}${req.files.icon.name.slice(req.files.icon.name.lastIndexOf('.'))}`;
                await req.files.icon.mv('.' + data.icon);
                data.icon = process.env.DOMAIN + data.icon;
            }
            const link = await linkModel.create(data);
            const links = await linkModel.findUserId(link.user_id);
            res.status(200).json(links);
        }
        catch (e) {
            next(e);
        }
    },
    getLinks: async (req, res, next) => {
        try{
            const links = await linkModel.findUserId(+req?.params?.id);
            res.status(200).json(links);
        }
        catch (e) {
            next(e);
        }
    },
    deleteLink: async (req, res, next) => {
        try{
            const link = await linkModel.findById(+req?.params?.id);
            const user_id = link.user_id;
            await link.destroy();
            const links = await linkModel.findUserId(user_id);
            res.status(200).json(links);
        }
        catch (e) {
            next(e);
        }
    },
    changeImage: async (req, res, next) => {
        try{
            const data = {user_id: +req.body?.user_id, image: req?.files?.image, column: req.body?.column};
            const validator = new UserValidator(data, {user_id: ["notNull", "number"], image: ["notNull"], column: ["notNull", "string"]});
            if (validator.errors.length)
                throw ApiError.BadRequest(validator.errors, "[UserController]");
            data.image =`/public/image/${uuidv4()}${req.files.image.name.slice(req.files.image.name.lastIndexOf('.'))}`;
            await req.files.image.mv('.' + data.image);
            const user = await userModel.editOneColumn(data.user_id, data.column, process.env.DOMAIN + data.image);
            res.status(200).json(user);
        }
        catch (e) {
            next(e);
        }
    },
};