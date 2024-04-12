const friendModel = require("#models/friendModel");
const UserValidator = require("#utils/validators/userValidator");
const ApiError = require("#utils/exceptions/apiError");

module.exports = {
    getFriends: async (req, res, next) => {
        try{
            const friends = await friendModel.findByUserId(+req?.params?.id);
            res.status(200).json(friends);
        }
        catch (e) {
            next(e);
        }
    },
    getFriendsByText: async (req, res, next) => {
        try{
            const friends = await friendModel.findByUserIdAndText(+req?.params?.id, req?.params?.text);
            res.status(200).json(friends);
        }
        catch (e) {
            next(e);
        }
    },
    getRequests: async (req, res, next) => {
        try{
            const requests = await friendModel.findRequestsByUserId(+req?.params?.id);
            res.status(200).json(requests);
        }
        catch (e) {
            next(e);
        }
    },
    createRequest: async (req, res, next) => {
        try{
            const { user_id_1, user_id_2 } = req?.body;
            const validator = new UserValidator(req?.body, {user_id_1: ["notNull", "number"], user_id_2: ["notNull", "number"]});
            if (validator.errors.length)
                throw ApiError.BadRequest(validator.errors, "[UserController]");
            const friendsAndRequest = await friendModel.findByUsersId(user_id_1, user_id_2);
            if (friendsAndRequest.length !== 0)
                throw ApiError.BadRequest([], "[UserController]");
            const requests = await friendModel.createRequest(user_id_1, user_id_2);
            res.status(200).json(requests);
        }
        catch (e) {
            next(e);
        }
    },
    updateStatusFriend: async (req, res, next) => {
        try{
            const { id, is_friend } = req?.body;
            const validator = new UserValidator(req?.body, {id: ["notNull", "number"], is_friend: ["notNull", "boolean"]});
            if (validator.errors.length)
                throw ApiError.BadRequest(validator.errors, "[UserController]");
            const requests = await friendModel.updateStatus(id, is_friend);
            res.status(200).json(requests);
        }
        catch (e) {
            next(e);
        }
    },
    deleteRequest: async (req, res, next) => {
        try{
            const id = req?.params?.id;
            const validator = new UserValidator(req?.params, {id: ["notNull", "number"]});
            if (validator.errors.length)
                throw ApiError.BadRequest(validator.errors, "[UserController]");
            const requests = await friendModel.deleteRequest(id);
            res.status(200).json(requests);
        }
        catch (e) {
            next(e);
        }
    },
    checkFriend: async (req, res, next) => {
        try{
            const user_1 = +req?.params?.user_1,
                user_2 = +req?.params?.user_2;

            const validator = new UserValidator({user_1, user_2}, {user_1: ["notNull", "number"], user_2: ["notNull", "number"]});
            if (validator.errors.length)
                throw ApiError.BadRequest(validator.errors, "[UserController]");

            const requests = await friendModel.findByUsersId(user_1, user_2);
            res.status(200).json(requests);
        }
        catch (e) {
            next(e);
        }
    }
};