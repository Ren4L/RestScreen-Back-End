const express = require('express');
const userRouter = require('./userRouter');
const videoRouter = require('./videoRouter');
const Router = express.Router();


Router.use("/user", userRouter);
Router.use("/video", videoRouter);

module.exports = Router;