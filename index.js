const express = require('express');
const cors = require('cors');
const userRouter = require('./routes/userRouter');

const app = express();

app.use(express.json());
app.use(cors());

app.use("/users", userRouter);

app.listen(process.env.PORT, () => console.log("Server started!"));