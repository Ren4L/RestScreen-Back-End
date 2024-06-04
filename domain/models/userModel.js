const User = require("#db/models/index").User;
const ApiError = require('#utils/exceptions/apiError');
const bcrypt = require('bcrypt');
const { Op } = require("sequelize");
module.exports = {
    create: async ({nickname, email, password, salt }) => {
        if ((await User.findAll({where:{email}})).length)
            throw ApiError.BadRequest(["Error.emailIsExist"], "[UserController]");
        return await User.create({
            nickname, email, salt,
            password: await bcrypt.hash(password + salt, 3),
        })
    },

    createGoogle: async ({nickname, email, photo}) => {
        return await User.create({ nickname, email, photo })
    },


    login: async ({email, password}) => {
        let user = await User.findOne({where:{email}});
        if (!user?.email)
            throw ApiError.BadRequest(["Error.wrongLoginOrPassword"], "[UserController]");
        if (!user.password)
            throw ApiError.BadRequest(["Error.regByGoogle"], "[UserController]");
        if (!(await bcrypt.compare(password + user?.salt, user?.password)))
            throw ApiError.BadRequest(["Error.wrongLoginOrPassword"], "[UserController]");
        return user;
    },

    findId: async (id) => {
      return (await User.findOne({where:{id}}))?.dataValues;
    },

    editOneColumn: async (id, nameColumn, value) => {
        let user = await User.findOne({where:{id}});
        if (!user?.dataValues?.id)
            throw ApiError.BadRequest(["Error.serverError"], "[UserController]");
        await user.update({[nameColumn]: value});
        await user.save();
        return user.dataValues;
    },

    findByText: async (text, limit = false) => {
        let limitQuery = {};
        if (!limit)
            limitQuery = { limit: 3 }
        return (await User.findAll({
            where:{
                nickname: {[Op.like]: `%${text}%`}
            },
            ...limitQuery
        }));
    },

    findByEmail: async (email) => {
        return (await User.findOne({
            where:{
                email
            }
        }));
    }
};