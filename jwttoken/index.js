const express = require("express");
const mongoose = require("mongoose");
const authRouter = require("./authRouter");

const PORT = process.env.PORT || 5001;

const app = express();

app.use(express.json());
app.use("/auth", authRouter);

const start = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://lorf:97865900Ff@cluster0.klfq6.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
    );
    app.listen(PORT, () => console.log(`server started on port ${PORT}...`));
  } catch (e) {
    console.log(e);
  }
};

start();
