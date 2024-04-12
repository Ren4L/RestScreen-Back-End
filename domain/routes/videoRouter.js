const express = require('express');
const videoController = require('#controllers/videoController');
const videoRouter = express.Router();

videoRouter.get('/watch/:name', videoController.streamVideo);
videoRouter.get("/search/:text", videoController.Search);
videoRouter.get('/category', videoController.getCategory);
videoRouter.get('/all', videoController.getAll);
videoRouter.get('/:id', videoController.get);
videoRouter.post('/upload', videoController.uploadVideo);

module.exports = videoRouter;