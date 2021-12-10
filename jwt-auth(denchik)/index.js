const express = require("express");
const mongoose = require("mongoose");
const authRouter = require('./authRouter')

const PORT = 5000;
const app = express();

app.use(express.json())
app.use('/auth', authRouter)

const start = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/test');
        app.listen(PORT, () => console.log(`Server started on PORT = ${PORT}`));
    } catch (e) {
        console.log(e);
    }
};

app.get("/", (req, res) => {
    res.send("Hello World!");
});

start();
