const express = require("express");
const app = express()
app.use(express.json())
const getAllCourses = async (req, res) => {
    try {
        console.log(`Function called: getAllCourses`);
        let courses = await db.collection("coursera").find({})
            .limit(10)
            .toArray()
        return res.status(200).json({courses: courses});

    } catch (e) {
        console.error("Could not getAllCourses from db");
        console.error(e);
        return res.status(500).json({message: "Internal Server Error"});
    }
}


const courseRouter = express.Router();
courseRouter.route("/courses").get(getAllCourses);
exports.courseRouter = courseRouter;