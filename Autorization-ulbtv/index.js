const express = require("express");
const mongoose = require("mongoose");
const authRouter = require("./autoRoutes.js");
const PORT = process.env.PORT || 5000;

const app = express();

app.use(express.json());
app.use("/auth", authRouter);

const start = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://lorf91:97865900@cluster0.mlhjo.mongodb.net/auto_exec?retryWrites=true&w=majority`
    );
    app.listen(PORT, () => console.log(`server started on port ${PORT} !!!`));
  } catch (e) {
    console.log(e);
  }
};

start();

/*
mongodb + srv://lorf91:<password>@cluster0.mlhjo.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
*/
