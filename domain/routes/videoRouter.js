const express = require('express');
const videoController = require('#controllers/videoController');
const videoRouter = express.Router();

videoRouter.get('/watch/:name', videoController.streamVideo);
videoRouter.get("/search/:text", videoController.Search);
videoRouter.get('/category', videoController.getCategory);
videoRouter.get('/all', videoController.getAll);
videoRouter.get('/:id', videoController.get);
videoRouter.post('/upload', videoController.uploadVideo);
videoRouter.post('/view', videoController.createOrUpdateView);
videoRouter.get('/view/:video_id/:user_id', videoController.getView);
videoRouter.get('/comment/:video_id', videoController.getAllComment);
videoRouter.post('/comment', videoController.createComment);
videoRouter.get('/user/:user_id', videoController.getAllByUserId);

module.exports = videoRouter;