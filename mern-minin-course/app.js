const express = require("express");
const config = require("config");
const mongoose = require("mongoose");

const app = express();

app.use(express.json({ extended: true }));

app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/link", require("./routes/link.routes"));

const PORT = config.get("port") || 5000;
const URL = config.get("mongoUri");

async function start() {
  try {
    await mongoose.connect(URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // useCreateIndex: true,
    });
    app.listen(PORT, () =>
      console.log(`App has been started on port => ${PORT} ...`)
    );
  } catch (e) {
    console.log("server Error", e.message);
    process.exit(1);
  }
}

start();
