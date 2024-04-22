const express = require('express');
const userController = require('#controllers/userController');
const friendController = require('#controllers/friendController');
const chatController = require('#controllers/chatController');
const authMiddleware = require('#middlewares/authMiddleware');
const userRouter = express.Router();

userRouter.post("/register", userController.register);
userRouter.post("/auth", userController.auth);
userRouter.delete("/logout", authMiddleware, userController.logout);
userRouter.get("/refresh", userController.refresh);
userRouter.get("/get/:id", authMiddleware, userController.get);

userRouter.put("/description", authMiddleware, userController.editDescription);
userRouter.put("/image", authMiddleware, userController.changeImage);

userRouter.post("/link", authMiddleware, userController.createLink);
userRouter.delete("/link/:id", authMiddleware, userController.deleteLink);
userRouter.get("/links/:id", authMiddleware, userController.getLinks);

userRouter.get('/friends/:id', authMiddleware, friendController.getFriends)
userRouter.get('/friends/:id/:text', authMiddleware, friendController.getFriendsByText)
userRouter.get('/requests/:id', authMiddleware, friendController.getRequests)
userRouter.post('/request',  authMiddleware, friendController.createRequest)
userRouter.put('/request/status', authMiddleware, friendController.updateStatusFriend)
userRouter.delete('/request', authMiddleware, friendController.deleteRequest)
userRouter.get('/friend/check/:user_1/:user_2', authMiddleware, friendController.checkFriend)

userRouter.get('/chat/:user_id_1/:user_id_2', authMiddleware, chatController.getOrCreateChat);
userRouter.get('/messages/:id', authMiddleware, chatController.getAllMessage);
userRouter.put('/message/view', authMiddleware, chatController.updateView);


module.exports = userRouter;