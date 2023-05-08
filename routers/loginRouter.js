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

const getFavorites = async (req, res) => {
    try {
        console.log(`Function called: getFavorites`);
        let uid = req.body.uid
        console.log(req.body);
        let fav = await db
            .collection("users")
            .find({uid: uid})
            .toArray();
        console.log(fav[0].favorites);
        let favObjIds = []
        fav[0].favorites.forEach(element => {
            favObjIds.push(new ObjectId(element))
        });

        let courses = await db
            .collection("standardised")
            .aggregate([{
                $match: {
                    _id: {
                        $in: favObjIds
                    }
                }
            }


            ])
            .toArray();



        let coursesCount = await db.collection("standardised").count();

        return res
            .status(200)
            .json({status: "ok", coursesCount: coursesCount, courses: courses});

    } catch (e) {
        console.log(e);
        console.error("Could not getFavorites from db");
        console.error(e);
        return res.status(500).json({message: "Internal Server Error"});
    }
}
const addToFavorites = async (req, res) => {
    try {
        console.log(`Function called: addToFavorites`);
        let uid = req.body.uid
        let courseId = req.body.courseId


        // let interests = req.body.selectedInterests
        let insertInterests = await db.collection("users").updateOne({uid, uid},
            {$addToSet: {favorites: courseId}})
        console.log(req.body);
        return res
            .status(200)
            .json({status: "ok"});




    } catch (e) {
        console.log(e);
        console.error("Could not addToFavorites into db");
        console.error(e);
        return res.status(500).json({message: "Internal Server Error"});
    }

}
const removeFromFavorites = async (req, res) => {
    try {
        console.log(`Function called: removeFromFavorites`);
        let uid = req.body.uid
        let courseId = req.body.courseId

        // let interests = req.body.selectedInterests
        // let insertInterests = await db.collection("users").updateOne({uid, uid},
        //     {$set: {interests: interests}})
        let insertInterests = await db.collection("users").updateOne({uid, uid},
            {$pull: {favorites: courseId}})
        console.log(req.body);
        return res
            .status(200)
            .json({status: "ok"});




    } catch (e) {
        console.log(e);
        console.error("Could not removeFromFavorites into db");
        console.error(e);
        return res.status(500).json({message: "Internal Server Error"});
    }

}



const loginRouter = express.Router();
loginRouter.route("/addInterests").post(addInterests);
loginRouter.route("/removeFromFavorites").post(removeFromFavorites);
loginRouter.route("/addToFavorites").post(addToFavorites);
loginRouter.route("/getFavorites").post(getFavorites);
loginRouter.route("/").post(loginUser);
exports.loginRouter = loginRouter;