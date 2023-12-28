const User = require("../../db/models/index").User;
const ApiError = require('../utils/exceptions/apiError');
const bcrypt = require('bcrypt');
module.exports = {
    create: async ({nickname, email, password, salt}) => {
        if ((await User.findAll({where:{email}})).length)
            throw ApiError.BadRequest(["Error.emailIsExist"]);
        return await User.create({
            nickname, email, salt,
            password: await bcrypt.hash(password + salt, 3),
        })
    },

    login: async ({email, password}) => {
        let user = await User.findOne({where:{email}});
        if (!user?.email || !(await bcrypt.compare(password + user?.salt, user?.password)))
            throw ApiError.BadRequest(["Error.WrongLoginOrPassword"]);
        return user;
    },

    findId: async (id) => {
      return (await User.findOne({where:{id}}))?.dataValues;
    },
};