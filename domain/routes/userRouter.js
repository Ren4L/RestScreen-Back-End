const express = require('express');
const userController = require('#controllers/userController');
const authMiddleware = require('#middlewares/authMiddleware');
const userRouter = express.Router();


userRouter.post("/register", userController.register);
userRouter.post("/auth", userController.auth);
userRouter.delete("/logout", authMiddleware, userController.logout);
userRouter.get("/refresh", userController.refresh);
userRouter.get("/get/:id", authMiddleware, userController.get);

module.exports = userRouter;