const express = require('express')
const app = express()
const MongoClient = require("mongodb").MongoClient;
const dotenv = require("dotenv");
const bodyParser = require('body-parser');
dotenv.config();



const courseRouter = require("./routers/courseRouter").courseRouter;
const loginRouter = require("./routers/loginRouter").loginRouter;

MongoClient.connect(process.env.MONGO_URL)
    .then((client) => {
        db = client.db("courses");
        console.log(`Selected DB: courses`);
        app.use(express.json())
        app.use(bodyParser.json());
        app.use("/api/v1/courses", courseRouter);
        app.use("/api/v1/login", loginRouter);

        app.listen(process.env.PORT, () => {
            console.log(`Started listening on port: ${process.env.PORT}`);
        });
    })
    .catch((err) => console.log(err));