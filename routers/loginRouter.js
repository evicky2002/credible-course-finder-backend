const express = require("express");
const {ObjectId} = require('bson')
const loginUser = async (req, res) => {
    try {
        console.log(`Function called: loginUser`);

        let uid = req.body.uid
        let exisitingUser = await db.collection("users").countDocuments({uid: uid})
        if (exisitingUser > 0) {
            return res
                .status(200)
                .json({status: "ok", exisitingUser: true});
        } else {
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
        let fav = await db
            .collection("users")
            .find({uid: uid})
            .toArray();
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

const getInterests = async (req, res) => {
    try {
        console.log(`Function called: getInterests`);
        let uid = req.body.uid

        // let interests = req.body.selectedInterests
        // let insertInterests = await db.collection("users").updateOne({uid, uid},
        //     {$set: {interests: interests}})
        let user = await db.collection("users").find({uid, uid}).toArray()
        return res
            .status(200)
            .json({status: "ok", user: user[0]});




    } catch (e) {
        console.log(e);
        console.error("Could not getInterests from db");
        console.error(e);
        return res.status(500).json({message: "Internal Server Error"});
    }

}



const loginRouter = express.Router();
loginRouter.route("/addInterests").post(addInterests);
loginRouter.route("/getInterests").post(getInterests);
loginRouter.route("/removeFromFavorites").post(removeFromFavorites);
loginRouter.route("/addToFavorites").post(addToFavorites);
loginRouter.route("/getFavorites").post(getFavorites);
loginRouter.route("/").post(loginUser);
exports.loginRouter = loginRouter;