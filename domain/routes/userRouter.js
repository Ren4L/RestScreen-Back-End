const express = require('express');
const userController = require('#controllers/userController');
const authMiddleware = require('#middlewares/authMiddleware');
const userRouter = express.Router();

userRouter.post("/register", userController.register);
userRouter.post("/auth", userController.auth);
userRouter.delete("/logout", authMiddleware, userController.logout);
userRouter.get("/refresh", userController.refresh);
userRouter.get("/get/:id", authMiddleware, userController.get);

userRouter.put("/description", authMiddleware, userController.editDescription);

userRouter.post("/link", authMiddleware, userController.createLink);
userRouter.delete("/link/:id", authMiddleware, userController.deleteLink);
userRouter.get("/links/:id", authMiddleware, userController.getLinks);

module.exports = userRouter;