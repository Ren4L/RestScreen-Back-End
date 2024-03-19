const {where} = require("sequelize");
const Link = require("#db/models/index").Link;
module.exports = {
    create: async (body) => {
        return await Link.create(body);
    },

    findById: async (id) => {
        return await Link.findByPk(+id);
    },

    delete: async (id) => {
      return await Link.destroy({where: {id}});
    },

    findUserId: async (id) => {
      return (await Link.findAll({where:{user_id: id}}));
    }
};