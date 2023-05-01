const express = require("express");
const getAllCourses = async (req, res) => {
    try {
        console.log(`Function called: getAllCourses`);
        console.log(req.body);
        let cond = [];
        let searchText = req.body.searchText || "";

        //TODO if searchText is empty we should use the interest tags in the user collection to recommend courses
        if (searchText != "") {
            cond.push({
                $match: {name: {$regex: searchText, $options: "i"}},
            });
        }
        let courses = await db
            .collection("standardised")
            .aggregate([
                ...cond,
                {
                    $limit: 10,
                },
            ])
            .toArray();

        let coursesCount = await db.collection("standardised").count();

        return res
            .status(200)
            .json({status: "ok", coursesCount: coursesCount, courses: courses});
    } catch (e) {
        console.log(e);
        console.error("Could not getAllCourses from db");
        console.error(e);
        return res.status(500).json({message: "Internal Server Error"});
    }
};

const getTopSkills = async (req, res) => {
    try {
        console.log(`Function called: getTopSkills`);

        let skills = await db
            .collection("standardised")
            .aggregate([
                {
                    $unwind: {
                        path: "$skills",
                    },
                },
                {
                    $group: {
                        _id: "$skills",
                        count: {
                            $sum: 1,
                        },
                    },
                }, {
                    $match: {
                        _id: {$ne: ""}
                    }
                },
                {
                    $sort:

                    {
                        count: -1,
                    },
                },
                {
                    $limit: 8,
                },
            ])
            .toArray();
        console.log(skills);



        return res
            .status(200)
            .json({status: "ok", skills: skills, });
    } catch (e) {
        console.log(e);
        console.error("Could not getTopSkills from db");
        console.error(e);
        return res.status(500).json({message: "Internal Server Error"});
    }
};

const courseRouter = express.Router();
courseRouter.route("/getTopSkills").get(getTopSkills);
courseRouter.route("/").post(getAllCourses);

exports.courseRouter = courseRouter;
