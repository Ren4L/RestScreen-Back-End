const messageModel = require('#models/messageModel');
const userModel = require('#models/userModel');
const {User, Message} = require("#db/models/index");
module.exports = {
    Room(message, ws, webSocketServer){
        ws.room_id = message.room_id;
        ws.user = message.user;
        switch (message.event_server) {
            case 'message':
                this.broadcastMessage(message, message.room_id, webSocketServer)
                break;
            case 'room_connection':
                if (!webSocketServer.rooms[message.room_id]){
                    webSocketServer.rooms[message.room_id] = {
                        video_id: message.video_id,
                        messages: [],
                        timeCode: 0,
                        isPause: true,
                        speed: 1,
                    }
                    this.broadcastMessage(message, message.room_id, webSocketServer)
                }
                else{
                    let response = {
                        event_client: "new_user",
                        user: message.user,
                        video_id: webSocketServer.rooms[message.room_id].video_id,
                        room_id: message.room_id,
                        messages: webSocketServer.rooms[message.room_id].messages,
                        timeCode: webSocketServer.rooms[message.room_id].timeCode,
                        isPause: webSocketServer.rooms[message.room_id].isPause,
                        speed: webSocketServer.rooms[message.room_id].speed,
                    }
                    this.broadcastMessage(response, message.room_id, webSocketServer)
                }
                break;
            case "message_chat":
                webSocketServer.rooms[message.room_id].messages.unshift(message)
                this.broadcastMessage(message, message.room_id, webSocketServer)
                break;
            case "save":
                webSocketServer.rooms[message.room_id].timeCode = message.timeCode;
                break;
            case "sync":
                webSocketServer.rooms[message.room_id].timeCode = message.timeCode;
                webSocketServer.rooms[message.room_id].isPause = message.isPause;
                webSocketServer.rooms[message.room_id].speed = message.speed;
                this.broadcastMessage(message, message.room_id, webSocketServer);
                break;
            case "playing":
                webSocketServer.rooms[message.room_id].isPause = message.isPause;
                this.broadcastMessage(message, message.room_id, webSocketServer);
                break;
            case "speeding":
                webSocketServer.rooms[message.room_id].speed = message.speed;
                this.broadcastMessage(message, message.room_id, webSocketServer);
                break;
            case "timing":
                webSocketServer.rooms[message.room_id].timeCode = message.timeCode;
                this.broadcastMessage(message, message.room_id, webSocketServer);
                break;
        }
    },

    broadcastMessage(message, room_id, webSocketServer) {
        webSocketServer.clients.forEach(client => {
            if (client.room_id === room_id){
                client.send(JSON.stringify(message))
            }
        })
    },

    async Chat(message, ws, webSocketServer) {
        ws.chat_id = message.chat_id;
        switch (message.event_server) {
            case 'message':
                message.chatMessage = (await messageModel.create({
                    message: message.message,
                    author_id: message.user.id,
                    chat_id: message.chat_id,
                    view: false,
                })).dataValues;
                message.chatMessage.author = await userModel.findId(message.chatMessage.author_id);
                this.broadcastMessageChat(message, message.chat_id, webSocketServer)
                break;
            case 'connection':
                this.broadcastMessageChat(message, message.chat_id, webSocketServer)
                break;
        }
    },

    broadcastMessageChat(message, chat_id, webSocketServer) {
        webSocketServer.clients.forEach(client => {
            if (client.chat_id === chat_id){
                client.send(JSON.stringify(message))
            }
        })
    }
}