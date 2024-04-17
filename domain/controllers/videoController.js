require('dotenv').config();
const userModel = require("#models/userModel");
const videoCategoryModel = require('#models/videoCategoryModel');
const videoModel = require('#models/videoModel');
const viewModel = require('#models/viewModel');
const commentModel = require('#models/commentModel');
const fs = require("fs");
const VideoValidator = require("#utils/validators/videoValidator");
const ApiError = require("#utils/exceptions/apiError");
const { v4: uuidv4 } = require('uuid');

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
            const users = await userModel.findByText(req?.params?.text);
            res.status(200).json({users});
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
            if (!data?.poster?.data) {
                data.poster = null;
            }
            else {
                data.poster = 'data:image/png;base64, ' + data.poster.data.toString('base64');
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
            const {user_id, video_id} = req.body;
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
            const video = await videoModel.get(video_id);
            video.dataValues.likes = (await viewModel.getAll(video_id, true)).length;
            video.dataValues.dislikes = (await viewModel.getAll(video_id, false)).length;
            video.dataValues.views = (await viewModel.getAll(video_id)).length;
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
            const comments = await commentModel.getAll(id);
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
}