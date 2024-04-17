require('dotenv').config();
const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const Router = require('#routes/index');
const ErrorMiddleware = require('#middlewares/errorMiddleware');
const Log = require("#log");
const http = require("http");
const WebSocket = require( "ws");

const app = express();

app.use(cors({
    credentials: true,
    origin: process.env.FRONT_END_DOMAIN
}));
app.use('/public', express.static('public'));
app.use(express.json());
app.use(fileUpload({}));
app.use(cookieParser());
app.use("/api", Router);
app.use(ErrorMiddleware);

const server = http.createServer(app);
const webSocketServer = new WebSocket.Server({ server });
webSocketServer.rooms = {};

webSocketServer.on('connection', function connection(ws) {
    ws.on('message', function (message) {
        message = JSON.parse(message)
        ws.room_id = message.room_id;
        ws.user = message.user;
        switch (message.event_server) {
            case 'message':
                broadcastMessage(message, message.room_id)
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
                    broadcastMessage(message, message.room_id)
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
                    broadcastMessage(response, message.room_id)
                }
                break;
            case "message_chat":
                webSocketServer.rooms[message.room_id].messages.unshift(message)
                broadcastMessage(message, message.room_id)
                break;
            case "save":
                webSocketServer.rooms[message.room_id].timeCode = message.timeCode;
                break;
            case "sync":
                webSocketServer.rooms[message.room_id].timeCode = message.timeCode;
                webSocketServer.rooms[message.room_id].isPause = message.isPause;
                webSocketServer.rooms[message.room_id].speed = message.speed;
                broadcastMessage(message, message.room_id);
                break;
            case "playing":
                webSocketServer.rooms[message.room_id].isPause = message.isPause;
                broadcastMessage(message, message.room_id);
                break;
            case "speeding":
                webSocketServer.rooms[message.room_id].speed = message.speed;
                broadcastMessage(message, message.room_id);
                break;
            case "timing":
                webSocketServer.rooms[message.room_id].timeCode = message.timeCode;
                broadcastMessage(message, message.room_id);
                break;
        }
    })
})

function broadcastMessage(message, room_id) {
    webSocketServer.clients.forEach(client => {
        if (client.room_id === room_id){
            client.send(JSON.stringify(message))
        }
    })
}

server.listen(process.env.PORT, () => Log.info(`Server start at port = ${process.env.PORT}`));