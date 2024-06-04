const {Favourite, Video, VideoCategory, User} = require("#db/models/index");
const {literal} = require("sequelize");
module.exports = {
    getAll: async (user_id) => {
        return (await Favourite.findAll({
            where: {
                user_id
            },
            include: [
                {
                    model: Video,
                    as: 'video',
                    include:[
                        {
                            model: VideoCategory,
                            as: 'category'
                        },
                        {
                            model: User,
                            as: 'author'
                        },
                    ],
                    attributes:{
                        include:[
                            [literal('(SELECT COUNT(*) FROM `Views` WHERE `Views`.`video_id` = `video`.`id`)'), 'views']
                        ]
                    },
                },
            ],
        }));
    },
    get: async (user_id, video_id) => {
        return (await Favourite.findOne({
            where:{
                user_id,
                video_id
            }
        }));
    },
    create: async (data) => {
        return (await Favourite.create(data));
    },
    delete: async (data) => {
        return (await Favourite.destroy({ where: data }));
    },
};