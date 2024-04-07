const Friend = require("#db/models/index").Friend;
const User = require("#db/models/index").User;
const { Op } = require("sequelize");
module.exports = {
    findByUserId: async (id) => {
        return (await Friend.findAll({
            where: {
                is_friend: true,
                [Op.or]: [
                    {user_id_1: id},
                    {user_id_2: id},
                ]
            },
            include: [
                {
                    model: User,
                    as: 'user_1'
                },
                {
                    model: User,
                    as: 'user_2'
                }
            ]
        }));
    },

    findByUserIdAndText: async (id, text) => {
        return (await Friend.findAll({
            where: {
                is_friend: true,
                [Op.or]: [
                    {user_id_1: id},
                    {user_id_2: id},
                ]
            },
            include: [
                {
                    model: User,
                    as: 'user_1',
                    where: {
                        [Op.or]:[
                            {nickname: {[Op.like]: `%${text}%`}},
                            {id}
                        ]
                    }
                },
                {
                    model: User,
                    as: 'user_2',
                    where: {
                        [Op.or]:[
                            {nickname: {[Op.like]: `%${text}%`}},
                            {id}
                        ]
                    }
                }
            ]
        }));
    },

    findRequestsByUserId: async (id) => {
        return (await Friend.findAll({
            where: {
                is_friend: false,
                user_id_2: id
            },
            include: [
                {
                    model: User,
                    as: 'user_1'
                }
            ]
        }));
    },

    findByUsersId: async (user_id_1, user_id_2) => {
        return (await Friend.findAll({
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
    createRequest: async (user_id_1, user_id_2) => {
        return (await Friend.create({
            user_id_1,
            user_id_2,
            is_friend: false
        }));
    },

    updateStatus: async (id, is_friend) => {
        return (await Friend.update({
            is_friend
        },{
            where:{
                id,
            }
        }))[0];
    },

    deleteRequest: async (id) => {
        return (await Friend.destroy({
            where:{
                id
            }
        }));
    },
};