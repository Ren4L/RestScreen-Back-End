const chatModel = require('#models/chatModel');
const messageModel = require('#models/messageModel');
const UserValidator = require("#utils/validators/userValidator");
const ApiError = require("#utils/exceptions/apiError");

module.exports = {
    getOrCreateChat: async (req, res, next) => {
        try{
            const validator = new UserValidator({user_id_1: +req.params?.user_id_1, user_id_2: +req.params?.user_id_2}, {user_id_1: ["notNull", "number"], user_id_2: ["notNull", "number"]});
            if (validator.errors.length)
                throw ApiError.BadRequest(validator.errors, "[ChatController]");
            const chat = await chatModel.findByUsersId(+req.params?.user_id_1, +req.params?.user_id_2);
            if (chat)
                return res.status(200).json(chat);
            const newChat = await chatModel.create(+req.params?.user_id_1, +req.params?.user_id_2);
            res.status(200).json(newChat);
        }
        catch (e) {
            next(e);
        }
    },

    getAllMessage: async (req, res, next) => {
        try{
            const validator = new UserValidator({chat_id: +req.params?.id}, {chat_id: ["notNull", "number"]});
            if (validator.errors.length)
                throw ApiError.BadRequest(validator.errors, "[ChatController]");
            const messages = await messageModel.findAll(+req.params?.id);
            res.status(200).json(messages);
        }
        catch (e) {
            next(e);
        }
    },

    updateView: async (req, res, next) => {
        try{
            const validator = new UserValidator(req.body, {id: ["notNull", "number"]});
            if (validator.errors.length)
                throw ApiError.BadRequest(validator.errors, "[ChatController]");
            const status = await messageModel.updateView(+req.body?.id);
            res.status(200).json(status);
        }
        catch (e) {
            next(e);
        }
    }
};