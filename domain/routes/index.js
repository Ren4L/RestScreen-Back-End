const express = require('express');
const userRouter = require('./userRouter');
const Router = express.Router();


Router.use("/user", userRouter);

module.exports = Router;