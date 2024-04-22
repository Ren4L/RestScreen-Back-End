const Token = require("#db/models/index").Token;
module.exports = {
    create: async (user_id, refresh_token) => {
        let user = (await Token.findOne({where:{user_id}}));
        if (user?.id){
            await user.update({refresh_token});
            return user;
        }

        return await Token.create({
            user_id, refresh_token
        });
    },

    delete: async (refresh_token) => {
        return await Token.destroy({where:{refresh_token}});
    },

    deleteByUserId: async (user_id) => {
        return await Token.destroy({where:{user_id}});
    },
    find: async (refresh_token) => {
        return await Token.findOne({where:{refresh_token}});
    }
};