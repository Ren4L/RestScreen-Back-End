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
const WebSocketController = require('#controllers/webSocketController');

const app = express();

app.use(cors({
    credentials: true,
    origin: process.env.FRONT_END_DOMAIN
}));
app.use(express.json());
app.use(fileUpload({}));
app.use(cookieParser());
app.use("/api", Router);
app.use(ErrorMiddleware);
app.use('/public', express.static('public'));

const server = http.createServer(app);
const webSocketServer = new WebSocket.Server({ server });
webSocketServer.rooms = {};

webSocketServer.on('connection', function connection(ws) {
    ws.on('message', function (message) {
        message = JSON.parse(message)
        switch (message.type) {
            case 'room':
                WebSocketController.Room(message, ws, webSocketServer)
                break;
            case 'chat':
                WebSocketController.Chat(message, ws, webSocketServer)
                break;
        }
    })
})

server.listen(process.env.PORT, () => Log.info(`Server start at port = ${process.env.PORT}`));