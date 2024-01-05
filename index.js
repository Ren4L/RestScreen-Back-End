require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const Router = require('#routes/index');
const ErrorMiddleware = require('#middlewares/errorMiddleware');
const Log = require("#log");

const app = express();


app.use(cors({
    credentials: true,
    origin: process.env.FRONT_END_DOMAIN
}));
app.use(express.json());
app.use(cookieParser());
app.use("/api", Router);
app.use(ErrorMiddleware);

app.listen(process.env.PORT, () => Log.info(`Server start at port = ${process.env.PORT}`));