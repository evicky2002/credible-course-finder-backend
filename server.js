const express = require('express')
const app = express()
const MongoClient = require("mongodb").MongoClient;
const dotenv = require("dotenv");
dotenv.config();



const courseRouter = require("./routers/courseRouter").courseRouter;

MongoClient.connect(process.env.MONGO_URL)
    .then((client) => {
        db = client.db("courses");
        console.log(`Selected DB: courses`);
        app.use("/api/v1/course", courseRouter);

        app.listen(process.env.PORT, () => {
            console.log(`Started listening on port: ${process.env.PORT}`);
        });
    })
    .catch((err) => console.log(err));