const express = require("express");
const mongoose = require("mongoose");

const PORT = process.env.PORT || 5500;

const app = express();

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
