const {View} = require("#db/models/index");
module.exports = {
    getAll: async (video_id, grade) => {
        if (typeof grade != "undefined"){
            return (await View.findAll({
                where:{
                    video_id,
                    grade
                }
            }));
        }
        else {
            return (await View.findAll({
                where:{
                    video_id
                }
            }));
        }
    },
    get: async (user_id, video_id) => {
        return (await View.findOne({
            where:{
                user_id,
                video_id
            }
        }));
    },
    create: async (data) => {
        return (await View.create(data));
    },
    update: async ({id, user_id, video_id, grade}) => {
        return (await View.update({grade, user_id, video_id}, {
            where:{id},
            returning: true
        }));
    }
};