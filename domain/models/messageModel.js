const {User, Message} = require("#db/models/index");
module.exports = {
    create: async (data) => {
        return (await Message.create(data));
    },

    findAll: async (chat_id) => {
        return await Message.findAll({
            where:{
                chat_id,
            },
            include: [
                {
                    model: User,
                    as: 'author'
                }
            ]
        });
    },

    updateView: async (id) => {
        console.log(id)
        return await Message.update({
            view: true
        }, {
            where:{
                id,
            }
        });
    },
};