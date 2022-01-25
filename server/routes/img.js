const express = require('express');
const router = express.Router();
const pictureSchema = require("../models/pictureSchema");
const commentSchema = require("../models/commentSchema");
const utils = require("../utils");
const userSchema = require("../models/userSchema");
const ut = new utils();
// const multer = require('multer');
// const path = require("path");
// const fs = require('fs');

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'uploads');
//     },
//     filename: (req, file, cb) => {
//         cb(null, file.fieldname + '-' + ut.giveBackDateString());
//     }
// });

// const upload = multer({storage: storage});

/**
 * Handles an up vote
 * @param metadata The metadata of the picture being voted up
 * @param user The user voting it up
 * @param res The result to be sent
 */
function handleUp(metadata, user, res) {
    pictureSchema.find({metadata: metadata}, (err, lst) => {
        if (err) {
            console.log("503: Connection to db picture failed");
            ut.sendIfNotAlready(res, 503, "Connection to db picture failed");
        } else {
            if (lst.length === 0) {
                console.log("400: No picture with this metadata found");
                ut.sendIfNotAlready(res, 400, "No picture with this metadata found");
            }
            let pict = lst[0];
            let upVoters = pict.upVoters;
            if (user in upVoters) {
                console.log("400: You have already up voted this");
                ut.sendIfNotAlready(res, 400, "You have already up voted this");
            }
            pict.downVoters = pict.downVoters.filter((elem) => elem !== user);
            pict.upVoters.push(user);

            console.log("200: Picture update succeeded");
            ut.sendIfNotAlready(res, 200, "Picture update succeeded");
        }
    });
}

/**
 * Handles a down vote
 * @param metadata The metadata of the picture being voted down
 * @param user The user voting it down
 * @param res The result to be sent
 */
function handleDown(metadata, user, res) {
    pictureSchema.find({metadata: metadata}, (err, lst) => {
        if (err) {
            console.log("503: Connection to db picture failed");
            ut.sendIfNotAlready(res, 503, "Connection to db picture failed");
        } else {
            if (lst.length === 0) {
                console.log("400: No picture with this metadata found");
                ut.sendIfNotAlready(res, 400, "No picture with this metadata found");
            }
            let pict = lst[0];
            let downVoters = pict.downVoters;
            if (user in downVoters) {
                console.log("400: You have already down voted this");
                ut.sendIfNotAlready(res, 400, "You have already down voted this");
            }
            pict.upVoters = pict.upVoters.filter((elem) => elem !== user);
            pict.downVoters.push(user);

            console.log("200: Picture downdate succeeded");
            ut.sendIfNotAlready(res, 200, "Picture downdate succeeded");
        }
    });
}

/**
 * Handles posting a comment
 * @param comment The comment to be posted
 * @param metadata The metadata of the picture
 * @param user The user posting the comment
 * @param res The result to give back
 */
function handleComment(comment, metadata, user, res) {
    const currentDate = ut.giveBackDateString();
    const comm = {
        dateOfCreation: currentDate,
        creator: user,
        comment: comment
    };
    pictureSchema.find({metadata: metadata}, (err, lst) => {
        if (err) {
            console.log("503: Connection to db picture failed");
            ut.sendIfNotAlready(res, 503, "Connection to db picture failed");
        } else {
            if (lst.length === 0) {
                console.log("400: No picture with this metadata found");
                ut.sendIfNotAlready(res, 400, "No picture with this metadata found");
            }
            let pict = lst[0];
            commentSchema.create(comm, _ => {
                console.log("503: Connection to db comment failed");
                ut.sendIfNotAlready(res, 503, "Connection to db comment failed");

                commentSchema.find({comment: comment, creator: user}, (err, lst) => {
                    if (err) {
                        console.log("503: Connection to db comment failed");
                        ut.sendIfNotAlready(res, 503, "Connection to db comment failed");
                    } else {
                        if (lst.length === 0) {
                            console.log("400: No comment with this user and string found");
                            ut.sendIfNotAlready(res, 400, "No comment with this user and string" +
                                " found");
                        }
                        let toPush = lst[0]
                        pict.comments.push(toPush);
                        user.lastComments.push(toPush);
                        console.log("200: Picture comment add succeeded");
                        ut.sendIfNotAlready(res, 200, "Picture comment add succeeded");
                    }
                });
            });
        }
    });
}

router.post("/", (req, res) => {
    let metadata = req.body.metadata;
    let userToken = req.query.token;
    let upVote = req.body.up;
    let downVote = req.body.down;
    let comment = req.body.comment;
    userSchema.find({currentToken: userToken}, (err, lst) => {
        if (err) {
            console.log("503: Connection to db user failed");
            ut.sendIfNotAlready(res, 503, "Connection to db user failed");
        } else {
            if (lst.length === 0) {
                console.log("400: No user with this token found");
                ut.sendIfNotAlready(res, 400, "No user with this token found");
            }
            let user = lst[0];
            if (upVote !== undefined) {
                handleUp(metadata, user, res);
            }
            if (downVote !== undefined) {
                handleDown(metadata, user, res);
            }
            if (comment !== undefined) {
                handleComment(comment, metadata, user, res);
            }
        }
    });
});

router.get("/", (req, res) => {
    const sortBy = req.body.sortBy;
    const filterBy = req.body.filterBy;
    const start = req.body.start;
    const end = req.body.end;
    pictureSchema.find({}, (err, items) => {
        if (err) {
            console.log(err);
            ut.sendIfNotAlready(res, 500, 'No images findable' + err);
        } else {
            if (filterBy) {
                items = items.filter(item => {
                    return item.creator.username === filterBy;
                });
            }
            if (sortBy === "up desc") {
                items = items.sort((a, b) => {
                    if (a.upVoters.length > b.upVoters.length) {
                        return -1;
                    }
                    if (a.upVoters.length < b.upVoters.length) {
                        return 1;
                    }
                    return 0;
                });
            }
            if (sortBy === "up asc") {
                items = items.sort((a, b) => {
                    if (a.upVoters.length > b.upVoters.length) {
                        return 1;
                    }
                    if (a.upVoters.length < b.upVoters.length) {
                        return -1;
                    }
                    return 0;
                });
            }
            if (sortBy === "down desc") {
                items = items.sort((a, b) => {
                    if (a.downVoters.length > b.downVoters.length) {
                        return -1;
                    }
                    if (a.downVoters.length < b.downVoters.length) {
                        return 1;
                    }
                    return 0;
                });
            }
            if (sortBy === "down asc") {
                items = items.sort((a, b) => {
                    if (a.downVoters.length > b.downVoters.length) {
                        return 1;
                    }
                    if (a.downVoters.length < b.downVoters.length) {
                        return -1;
                    }
                    return 0;
                });
            }
            if (start !== undefined && typeof start === "number" && end !== undefined && typeof end === "number") {
                items = items.slice(start, end);
                ut.sendIfNotAlready(res, 200, null);
                res.send(items);
            } else {
                console.log("400: You have to give a number as start and a number as end," +
                    " which part of the items you want");
                ut.sendIfNotAlready(res, 400, "You have to give a number as start and a number as" +
                    " end," +
                    " which part of the items you want");
            }
        }
    });

})

module.exports = router;