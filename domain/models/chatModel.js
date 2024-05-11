const Chat = require("#db/models/index").Chat;
const { Op, literal} = require("sequelize");
const User = require("#db/models/index").User;
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

    getAllChats: async (user_id, str = '', filter = 'all') => {
        let having = {
            'lastMessage': {[Op.ne]: null}
        }
        switch (filter){
            case 'notRead':
                having = {
                    'notView': {[Op.gte]: 1},
                    'lastMessage': {[Op.ne]: null}
                }
                break;
            case 'read':
                having = {
                    'notView': {[Op.eq]: 0},
                    'lastMessage': {[Op.ne]: null}
                }
                break;
        }
        return (await Chat.findAll({
            where: {
                [Op.or]: [
                    {
                        user_id_1: user_id,
                    },
                    {
                        user_id_2: user_id,
                    },
                ]
            },
            order: [
                ['lastMessageDate', "DESC"]
            ],
            include: [
                {
                    model: User,
                    as: 'user_1',
                    where: {
                        [Op.or]:[
                            {nickname: {[Op.like]: `%${str}%`}},
                            {id: user_id}
                        ]
                    }
                },
                {
                    model: User,
                    as: 'user_2',
                    where: {
                        [Op.or]:[
                            {nickname: {[Op.like]: `%${str}%`}},
                            {id: user_id}
                        ]
                    }
                }
            ],
            attributes:{
                include:[
                    [literal('(SELECT COUNT(*) FROM `Messages` WHERE `Messages`.`chat_id` = `Chat`.`id` AND `Messages`.`author_id` != '+ user_id +' AND `Messages`.`view` = 0)'), 'notView'],
                    [literal('(SELECT `Messages`.`message` FROM `Messages` WHERE `Messages`.`chat_id` = `Chat`.`id` ORDER BY `Messages`.`createdAt` DESC limit 1)'), 'lastMessage'],
                    [literal('(SELECT `Messages`.`createdAt` FROM `Messages` WHERE `Messages`.`chat_id` = `Chat`.`id` ORDER BY `Messages`.`createdAt` DESC limit 1)'), 'lastMessageDate']
                ]
            },
            having
        }));
    },
};