require('dotenv').config();
const userModel = require("#models/userModel");
const videoCategoryModel = require('#models/videoCategoryModel');
const videoModel = require('#models/videoModel');
const friendModel = require('#models/friendModel');
const viewModel = require('#models/viewModel');
const commentModel = require('#models/commentModel');
const favouriteModel = require('#models/favouriteModel');
const fs = require("fs");
const VideoValidator = require("#utils/validators/videoValidator");
const ApiError = require("#utils/exceptions/apiError");
const { v4: uuidv4 } = require('uuid');
const Log = require("#log");
const raccoon = require('raccoon');
raccoon.config.className = 'recommendations';
raccoon.config.nearestNeighbors = 3;
raccoon.config.numOfRecsStore = 10;


module.exports = {
    streamVideo: async (req, res, next) => {
        try {
            const videoPath = './public/video/'
            const fileName = req.params.name;
            const filePath = videoPath+fileName;
            if(!filePath){
                return res.status(404).send('File not found')
            }

            const stat = fs.statSync(filePath);
            const fileSize = stat.size;
            const range = req.headers.range;

            if(range){
                const parts = range.replace(/bytes=/, '').split('-')
                const start = parseInt(parts[0], 10);
                const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

                const chunksize = end - start + 1;
                const file = fs.createReadStream(filePath, {start, end});
                const head = {
                    'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                    'Accept-Ranges': 'bytes',
                    'Content-Length': chunksize,
                    'Content-Type': 'video/mp4'
                };
                res.writeHead(206, head);
                file.pipe(res);
            }
            else{
                const head = {
                    'Content-Length': fileSize,
                    'Content-Type': 'video/mp4'
                };
                res.writeHead(200, head);
                fs.createReadStream(filePath).pipe(res)
            }
        } catch (e) {
            next(e);
        }
    },
    Search: async (req, res, next) => {
        try {
            if (req.query.timing == 'undefined' || req.query.timing == 'null')
                req.query.timing = undefined;
            if (req.query.sorting == 'undefined' || req.query.sorting == 'null')
                req.query.sorting = undefined;
            if (req.query.dateDownload == 'undefined' || req.query.dateDownload == 'null')
                req.query.dateDownload = undefined;
            const users = await userModel.findByText(req?.params?.text);
            const videos = await videoModel.findByTextAndFilter(req?.params?.text, req.query);
            res.status(200).json({users, videos});
        } catch (e) {
            next(e);
        }
    },
    getCategory: async (req, res, next) => {
        try {
            const category = await videoCategoryModel.getAll();
            res.status(200).json(category);
        } catch (e) {
            next(e);
        }
    },
    uploadVideo: async (req, res, next) => {
        try {
            const data = {...req.body, category_id: +req.body?.category_id, author_id: +req.body?.author_id, url: req?.files?.video, poster: req?.files?.poster};
            const validator = new VideoValidator(data,
                {
                    title: ["notNull", "title"],
                    description: ["notNull", "description"],
                    category_id: ["notNull", "category"],
                    author_id: ["notNull"],
                    url: ["fileNotNull"]
                });
            if (validator.errors.length)
                throw ApiError.BadRequest(validator.errors, "[VideoController]");
            if (req?.files?.video?.mimetype != "video/mp4")
                throw ApiError.BadRequest(['Video.notFormat'], "[VideoController]");
            if (!data?.poster?.data) {
                data.poster = null;
            }
            else {
                if (!req.files.poster.mimetype.includes('image'))
                    throw ApiError.BadRequest(['Video.notImage'], "[VideoController]");
                data.poster =`/public/poster/${uuidv4()}${req.files.poster.name.slice(req.files.poster.name.lastIndexOf('.'))}`;
                await req.files.poster.mv('.' + data.poster);
                data.poster = process.env.DOMAIN + data.poster;
            }
            data.url =`/public/video/${uuidv4()}${req.files.video.name.slice(req.files.video.name.lastIndexOf('.'))}`;
            await req.files.video.mv('.' + data.url);
            const video = await videoModel.create({...data, url: process.env.DOMAIN + data.url});
            res.status(200).json(video);
        } catch (e) {
            next(e);
        }
    },
    getAll: async (req, res, next) => {
        try {
            const videos = await videoModel.getAll();
            res.status(200).json(videos);
        } catch (e) {
            next(e);
        }
    },
    get: async (req, res, next) => {
        try {
            const id = +req?.params?.id;
            const validator = new VideoValidator({id}, {id: ["notNull", "number"]});
            if (validator.errors.length)
                throw ApiError.BadRequest(validator.errors, "[VideoController]");
            const video = await videoModel.get(id);
            video.dataValues.likes = (await viewModel.getAll(id, true)).length;
            video.dataValues.dislikes = (await viewModel.getAll(id, false)).length;
            video.dataValues.views = (await viewModel.getAll(id)).length;
            video.dataValues.comments = (await commentModel.getAll(id)).length;
            res.status(200).json(video);
        } catch (e) {
            next(e);
        }
    },
    getView: async (req, res, next) => {
        try {
            const {user_id, video_id} = req.params;
            const validator = new VideoValidator({user_id: +req.params?.user_id, video_id: +req.params?.video_id}, {user_id: ["notNull", "number"], video_id: ["notNull", "number"]});
            if (validator.errors.length)
                throw ApiError.BadRequest(validator.errors, "[VideoController]");
            const view = await viewModel.get(user_id, video_id);
            res.status(200).json(view);
        } catch (e) {
            next(e);
        }
    },
    createOrUpdateView: async (req, res, next) => {
        try {
            const {user_id, video_id, grade} = req.body;
            const validator = new VideoValidator(req.body, {user_id: ["notNull", "number"], video_id: ["notNull", "number"]});
            if (validator.errors.length)
                throw ApiError.BadRequest(validator.errors, "[VideoController]");
            let view;
            const checkView = await viewModel.get(user_id, video_id);
            if (!checkView)
                view = await viewModel.create({...req.body});
            else{
                view = await viewModel.update({id: checkView.id, ...req.body});
            }
            if (grade == 1){
                await raccoon.undisliked(user_id, video_id);
                await raccoon.liked(user_id, video_id);
            }else if (grade == null || typeof grade == "undefined"){
                await raccoon.liked(user_id, video_id);
            }
            else{
                await raccoon.unliked(user_id, video_id);
                await raccoon.disliked(user_id, video_id);
            }
            const video = await videoModel.get(video_id);
            video.dataValues.likes = (await viewModel.getAll(video_id, true)).length;
            video.dataValues.dislikes = (await viewModel.getAll(video_id, false)).length;
            video.dataValues.views = (await viewModel.getAll(video_id)).length;
            video.dataValues.comments = (await commentModel.getAll(video_id)).length;
            res.status(200).json(video);
        } catch (e) {
            next(e);
        }
    },
    getAllComment: async (req, res, next) => {
        try {
            const id = +req.params?.video_id;
            const validator = new VideoValidator({id}, {id: ["notNull", "number"]});
            if (validator.errors.length)
                throw ApiError.BadRequest(validator.errors, "[VideoController]");
            const comments = await commentModel.getAll(id, +req.query?.limit, +req.query?.page);
            res.status(200).json(comments);
        } catch (e) {
            console.log(e)
            next(e);
        }
    },
    createComment: async (req, res, next) => {
        try {
            const validator = new VideoValidator(req.body, {user_id: ["notNull", "number"], video_id: ["notNull", "number"], comment: ["notNull", "string", "comment"]});
            if (validator.errors.length)
                throw ApiError.BadRequest(validator.errors, "[VideoController]");
            const video = await commentModel.create(req.body);
            res.status(200).json(video);
        } catch (e) {
            next(e);
        }
    },
    getAllByUserId: async (req, res, next) => {
        try {
            const videos = await videoModel.getAllByUserId(+req.params?.user_id);
            res.status(200).json(videos);
        } catch (e) {
            next(e);
        }
    },
    getSubscriptions: async (req, res, next) => {
        try {
            const subscriptions = await friendModel.findForSubscriptionsByUserId(+req.params?.user_id);
            const subscriptionList = [];
            for (const el of subscriptions) {
                subscriptionList.push(el.user_id_1 === +req.params?.user_id ? el.user_id_2 : el.user_id_1)
            }
            const videos = await videoModel.getSubscriptions(subscriptionList);
            res.status(200).json(videos);
        } catch (e) {
            next(e);
        }
    },
    GlobalSearch: async (req, res, next) => {
        try {
            if (req.query.timing == 'undefined' || req.query.timing == 'null')
                req.query.timing = undefined;
            if (req.query.sorting == 'undefined' || req.query.sorting == 'null')
                req.query.sorting = undefined;
            if (req.query.dateDownload == 'undefined' || req.query.dateDownload == 'null')
                req.query.dateDownload = undefined;
            let users = (await userModel.findByText(req?.params?.text, true));
            users = Array.isArray(users) ? users : [users];
            for (const user of users) {
                user.dataValues.subscribers = (await friendModel.findSubscribersByUserId(user.id)).length;
                user.dataValues.videos = (await videoModel.getAllByUserId(user.id)).length;
            }
            let videos = (await videoModel.findByTextAndFilter(req?.params?.text, req.query, true));
            videos = Array.isArray(videos) ? videos : [videos];
            const result = [...users, ...videos].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
            res.status(200).json(result);
        } catch (e) {
            next(e);
        }
    },
    createFavourite: async (req, res, next) => {
        try {
            const validator = new VideoValidator(req.body, {user_id: ["notNull", "number"], video_id: ["notNull", "number"]});
            if (validator.errors.length)
                throw ApiError.BadRequest(validator.errors, "[VideoController]");
            const video = await favouriteModel.create(req.body);
            res.status(200).json(video);
        } catch (e) {
            next(e);
        }
    },
    getFavourite: async (req, res, next) => {
        try {
            const favourite = await favouriteModel.get(+req.params?.user_id, +req.params?.video_id);
            res.status(200).json(favourite);
        } catch (e) {
            next(e);
        }
    },
    deleteFavourite: async (req, res, next) => {
        try {
            const video = await favouriteModel.delete({
                user_id: +req.params?.user_id,
                video_id: +req.params?.video_id
            });
            res.status(200).json(video);
        } catch (e) {
            next(e);
        }
    },
    getAllFavourite: async (req, res, next) => {
        try {
            const favourites = await favouriteModel.getAll(+req.params?.user_id);
            res.status(200).json(favourites);
        } catch (e) {
            next(e);
        }
    },
    getRecommendation: async (req, res, next) => {
        try {
            let recommendIds = await raccoon.recommendFor(+req.params?.user_id, 10);
            let recommendsVideo = await videoModel.getByIds(recommendIds);
            let anotherVideo = await videoModel.getByNotIncludeIds(recommendIds);
            res.status(200).json(recommendsVideo.concat(anotherVideo));
        } catch (e) {
            next(e);
        }
    },
}