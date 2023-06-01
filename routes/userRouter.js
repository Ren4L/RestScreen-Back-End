const express = require('express');
const userController = require('../controllers/userController');
const validation = require('../middlewares/validation');
const userRouter = express.Router();

userRouter.post("/create", validation.auth, userController.create);

module.exports = userRouter;