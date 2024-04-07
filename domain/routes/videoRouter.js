const express = require('express');
const videoController = require('#controllers/videoController');
const videoRouter = express.Router();

videoRouter.get("/search/:text", videoController.Search);

module.exports = videoRouter;