const express = require('express');
const videoController = require('#controllers/videoController');
const authMiddleware = require("#middlewares/authMiddleware");
const videoRouter = express.Router();

videoRouter.get('/watch/:name', videoController.streamVideo);
videoRouter.get("/search/:text", videoController.Search);
videoRouter.get("/search/global/:text", videoController.GlobalSearch);
videoRouter.get('/category', videoController.getCategory);
videoRouter.get('/all', videoController.getAll);
videoRouter.get('/:id', videoController.get);
videoRouter.post('/upload', authMiddleware, videoController.uploadVideo);
videoRouter.post('/view', authMiddleware, videoController.createOrUpdateView);
videoRouter.get('/view/:video_id/:user_id', videoController.getView);
videoRouter.get('/comment/:video_id', videoController.getAllComment);
videoRouter.post('/comment', authMiddleware, videoController.createComment);
videoRouter.get('/user/:user_id', videoController.getAllByUserId);
videoRouter.get('/subscriptions/:user_id', videoController.getSubscriptions);
videoRouter.get('/favourite/:user_id/:video_id', authMiddleware, videoController.getFavourite);
videoRouter.get('/all/favourite/:user_id', authMiddleware, videoController.getAllFavourite);
videoRouter.post('/favourite', authMiddleware, videoController.createFavourite);
videoRouter.delete('/favourite/:user_id/:video_id', authMiddleware, videoController.deleteFavourite);

module.exports = videoRouter;