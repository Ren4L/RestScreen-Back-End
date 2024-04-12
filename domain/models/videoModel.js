const {User, Video, VideoCategory} = require("#db/models/index");
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
                }
            ]
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
    }
};