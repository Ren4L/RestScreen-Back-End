require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const Router = require('./domain/routes/index');
const ErrorMiddleware = require('./domain/middlewares/errorMiddleware');

const app = express();

app.use(cors({
    credentials: true,
    origin:'http://localhost:8080'
}));
app.use(express.json());
app.use(cookieParser());
app.use("/api", Router);
app.use(ErrorMiddleware);

app.listen(process.env.PORT, () => console.log(`Server start at port = ${process.env.PORT}`));