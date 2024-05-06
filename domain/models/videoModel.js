const {User, Video, VideoCategory} = require("#db/models/index");
const {literal, Op} = require("sequelize");
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
    findByTextAndFilter: async (text, filter, limit = false) => {
        let sorting = ['title', filter.direction], dateDownload;
        let timing = dateDownload = {};
        let limitQuery = {};
        if (!limit)
            limitQuery = { limit: 3 }
        switch (filter.timing){
            case 'less4':
                timing = { duration: {[Op.lte]: '00:04:00'}}
                break;
            case 'from4to20':
                timing = { duration: {[Op.and]:{
                            [Op.gte]: '00:04:00',
                            [Op.lte]: '00:20:00',
                        }}}
                break;
            case 'more20':
                timing = { duration: {[Op.gte]: '00:20:00'}}
                break;
        }

        switch (filter.sorting){
            case 'dateDownload':
                sorting = ['createdAt', filter.direction];
                break;
            case 'timing':
                sorting = ['duration', filter.direction];
                break;
        }

        switch (filter.dateDownload){
            case 'lastHour':
                dateDownload = {createdAt: {[Op.gte]: new Date(Date.now() - 60*60*1000)}};
                break;
            case 'today':
                dateDownload = {createdAt: {[Op.gte]: new Date(Date.now() - 24*60*60*1000)}};
                break;
            case 'atThisWeek':
                dateDownload = {createdAt: {[Op.gte]: new Date(Date.now() - 7*24*60*60*1000)}};
                break;
            case 'atThisMonth':
                dateDownload = {createdAt: {[Op.gte]: new Date(Date.now() - 30*24*60*60*1000)}};
                break;
            case 'atThisYear':
                dateDownload = {createdAt: {[Op.gte]: new Date(Date.now() - 365*24*60*60*1000)}};
                break;
        }

        return (await Video.findAll({
            where: {
                title: {[Op.like]: `%${text}%`},
                ...timing,
                ...dateDownload
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
            },
            order: [
                sorting
            ],
            ...limitQuery
        }));
    },
    getSubscriptions: async (users_id = []) => {
        return (await Video.findAll({
            where:{
                author_id: {[Op.in]:users_id},
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
            },
            order:[
                ['createdAt', 'DESC']
            ]
        }));
    },
};