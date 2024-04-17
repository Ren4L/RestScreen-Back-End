const {User, Comment} = require("#db/models/index");
module.exports = {
    getAll: async (video_id) => {
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
            ]
        }));
    },
    create: async (data) => {
        return (await Comment.create(data));
    }
};