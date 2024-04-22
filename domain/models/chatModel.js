const Chat = require("#db/models/index").Chat;
const { Op } = require("sequelize");
module.exports = {
    findByUsersId: async (user_id_1, user_id_2) => {
        return (await Chat.findOne({
            where: {

                [Op.or]: [
                    {
                        user_id_1,
                        user_id_2,
                    },
                    {
                        user_id_1:user_id_2,
                        user_id_2:user_id_1,
                    },
                ]
            }
        }));
    },

    create: async (user_id_1, user_id_2) => {
        return (await Chat.create({
            user_id_1,
            user_id_2,
        }));
    },
};