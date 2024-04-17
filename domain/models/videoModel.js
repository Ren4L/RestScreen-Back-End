const {User, Video, VideoCategory} = require("#db/models/index");
const {literal} = require("sequelize");
module.exports = {
    getAll: async () => {
        return (await Video.findAll({
            include: [
                {
                    model: User,
                    as: 'author'
                },
                {
                    model: VideoCategory,
                    as: 'category'
                },
            ],
            attributes:{
                include:[
                    [literal('(SELECT COUNT(*) FROM `Views` WHERE `Views`.`video_id` = `Video`.`id`)'), 'views']
                ]
            }
        }));
    },
    get: async (id) => {
        return (await Video.findOne({
            where:{
                id
            },
            include: [
                {
                    model: User,
                    as: 'author'
                },
                {
                    model: VideoCategory,
                    as: 'category'
                }
            ]
        }));
    },
    create: async (data) => {
        return (await Video.create(data));
    },
    getAllByUserId: async (user_id) => {
        return (await Video.findAll({
            where:{
                author_id: user_id,
            },
            include: [
                {
                    model: User,
                    as: 'author'
                },
                {
                    model: VideoCategory,
                    as: 'category'
                },
            ],
            attributes:{
                include:[
                    [literal('(SELECT COUNT(*) FROM `Views` WHERE `Views`.`video_id` = `Video`.`id`)'), 'views']
                ]
            }
        }));
    },
};