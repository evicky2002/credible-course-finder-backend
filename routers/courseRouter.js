const express = require("express");
const app = express()
app.use(express.json())
const getAllCourses = async (req, res) => {
    try {
        console.log(`Function called: getAllCourses`);
        let courses = await db.collection("standardised").find({}).limit(10)
            .toArray()
        let coursesCount = await db.collection("standardised").count()

        return res.status(200).json({status: 'ok', coursesCount: coursesCount, courses: courses});

    } catch (e) {
        console.log(e);
        console.error("Could not getAllCourses from db");
        console.error(e);
        return res.status(500).json({message: "Internal Server Error"});
    }
}


const courseRouter = express.Router();
courseRouter.route("/").get(getAllCourses);
exports.courseRouter = courseRouter;