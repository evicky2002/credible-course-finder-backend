const express = require("express");
const {ObjectId} = require('bson')
const loginUser = async (req, res) => {
    try {
        console.log(`Function called: loginUser`);

        let uid = req.body.uid
        console.log(req.body);
        let exisitingUser = await db.collection("users").countDocuments({uid: uid})
        if (exisitingUser > 0) {
            console.log("existing user");
            return res
                .status(200)
                .json({status: "ok", exisitingUser: true});
        } else {
            console.log("new user");
            let insertUser = await db.collection("users").insertOne({uid: uid})
            return res
                .status(200)
                .json({status: "ok", exisitingUser: false});
        }



    } catch (e) {
        console.log(e);
        console.error("Could not loginUser into db");
        console.error(e);
        return res.status(500).json({message: "Internal Server Error"});
    }

}
const addInterests = async (req, res) => {
    try {
        console.log(`Function called: addInterests`);
        let uid = req.body.uid
        let interests = req.body.selectedInterests
        let insertInterests = await db.collection("users").updateOne({uid, uid},
            {$set: {interests: interests}})
        console.log(req.body);
        return res
            .status(200)
            .json({status: "ok"});




    } catch (e) {
        console.log(e);
        console.error("Could not addInterests into db");
        console.error(e);
        return res.status(500).json({message: "Internal Server Error"});
    }

}


const loginRouter = express.Router();
loginRouter.route("/addInterests").post(addInterests);
loginRouter.route("/").post(loginUser);
exports.loginRouter = loginRouter;