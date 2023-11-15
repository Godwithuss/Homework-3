const express = require("express");
const userRouter = require("./middlwares/users");
const postRouter = require("./middlwares/post");
const followRouter = require("./middlwares/follow");

const app = express();

app.use(express.json());

app.use("/users", userRouter);
app.use("/posts", postRouter);
app.use("/follows", followRouter);

app.listen(3000, () => console.log("listening on:3000"));
