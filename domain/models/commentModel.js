const {User, Comment} = require("#db/models/index");
module.exports = {
    getAll: async (video_id, limit = 99999999, page = 1) => {
        return (await Comment.findAll({
            where:{
                video_id
            },
            include:[
                {
                    model: User,
                    as: 'user'
                }
            ],
            order:[
                ['createdAt', 'DESC']
            ],
            limit,
            offset: limit * (page - 1)
        }));
    },
    create: async (data) => {
        return (await Comment.create(data));
    }
};