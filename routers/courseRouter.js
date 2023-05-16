const express = require("express");
const getAllCourses = async (req, res) => {
    try {
        console.log(`Function called: getAllCourses`);
        console.log(req.body);
        let cond = [];
        const pageNo = req.body.pageNumber || 1;
        const itemsPerPage = req.body.itemsPerPage || 20;
        const providerFilter = req.body.providerFilter || [];
        const uid = req.body.uid
        let searchText = req.body.searchText || "";

        if (searchText === "" && providerFilter.length === 0) {
            console.log("truthy");
            //TODO if searchText is empty we should use the interest tags in the user collection to recommend courses
            let user = await db.collection("users").find({uid, uid}).toArray()
            let interests = user[0].interests
            console.log(user[0].interests);
            let courses = await db
                .collection("standardised")
                .aggregate([
                    {
                        $match: {
                            'skills': {$in: interests}
                        }

                    },

                    {
                        $skip: (pageNo - 1) * itemsPerPage,
                    },
                    {
                        $limit: itemsPerPage,
                    }

                ])
                .toArray();
            let coursesCount = await db.collection("standardised").count();

            return res
                .status(200)
                .json({status: "ok", coursesCount: coursesCount, courses: courses});
        } else {
            console.log("falsy");

            if (searchText != "") {
                cond.push({
                    $match: {name: {$regex: searchText, $options: "i"}},
                });
            }
            if (providerFilter.length !== 0) {
                cond.push({
                    $match: {
                        course_provider: {
                            $in: providerFilter
                        }
                    }
                });
            }
            let courses = await db
                .collection("standardised")
                .aggregate([
                    ...cond,
                    {
                        $skip: (pageNo - 1) * itemsPerPage,
                    },
                    {
                        $limit: itemsPerPage,
                    }

                ])
                .toArray();
            let coursesCount = await db.collection("standardised").count();

            return res
                .status(200)
                .json({status: "ok", coursesCount: coursesCount, courses: courses});
        }


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
