const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv').config();
const userRouter = require('./domain/routes/userRouter');

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/user", userRouter);
app.listen(process.env.PORT, () => console.log(`Server start at port = ${process.env.PORT}`));