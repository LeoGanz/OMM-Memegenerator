const express = require('express');
const router = express.Router();
const memeSchema = require("../models/memeSchema");
const commentSchema = require("../models/commentSchema");
const userSchema = require("../models/userSchema");
const utils = require("../utils");
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
 * @param memeId The memeId of the meme being voted up
 * @param user The user voting it up
 * @param res The result to be sent
 */
function handleUp(memeId, user, res) {
    memeSchema.find({memeId: memeId}, (err, lst) => {
        if (err) {
            ut.respond(res, 503, "Connection to db meme failed");
        } else {
            if (lst.length === 0) {
                ut.respond(res, 400, "No meme with this memeId found");
            }
            let pict = lst[0];
            let upVoters = pict.upVoters;
            if (user in upVoters) {
                ut.respond(res, 400, "You have already up voted this");
            }
            pict.downVoters = pict.downVoters.filter((elem) => elem !== user);
            pict.upVoters.push(user);

            ut.respond(res, 200, "Meme update succeeded");
        }
    });
}

/**
 * Handles a down vote
 * @param memeId The memeId of the meme being voted down
 * @param user The user voting it down
 * @param res The result to be sent
 */
function handleDown(memeId, user, res) {
    memeSchema.find({memeId: memeId}, (err, lst) => {
        if (err) {
            ut.respond(res, 503, "Connection to db meme failed");
        } else {
            if (lst.length === 0) {
                ut.respond(res, 400, "No meme with this memeId found");
            }
            let pict = lst[0];
            let downVoters = pict.downVoters;
            if (user in downVoters) {
                ut.respond(res, 400, "You have already down voted this");
            }
            pict.upVoters = pict.upVoters.filter((elem) => elem !== user);
            pict.downVoters.push(user);

            ut.respond(res, 200, "Meme downdate succeeded");
        }
    });
}

/**
 * Handles posting a comment
 * @param comment The comment to be posted
 * @param memeId The memeId of the meme
 * @param user The user posting the comment
 * @param res The result to give back
 */
function handleComment(comment, memeId, user, res) {
    const currentDate = ut.getCurrentDateString();
    const comm = {
        dateOfCreation: currentDate,
        creator: user,
        comment: comment
    };
    memeSchema.find({memeId: memeId}, (err, lst) => {
        if (err) {
            ut.dbConnectionFailureHandler(res, err)
        } else {
            if (lst.length === 0) {
                ut.respond(res, 400, "No meme with this memeId found");
            }
            let pict = lst[0];
            commentSchema.create(comm, _ => {
                ut.dbConnectionFailureHandler(res, err)

                commentSchema.find({comment: comment, creator: user}, (err, lst) => {
                    if (err) {
                        ut.dbConnectionFailureHandler(res, err)
                    } else {
                        if (lst.length === 0) {
                            ut.respond(res, 400, "No comment with this user and string found");
                        }
                        let toPush = lst[0]
                        pict.comments.push(toPush);
                        user.lastComments.push(toPush);
                        ut.respond(res, 200, "Meme comment add succeeded");
                    }
                });
            });
        }
    });
}

router.post("/", (req, res) => {
    let memeId = req.body.memeId;
    let userToken = req.query.token;
    let upVote = req.body.up;
    let downVote = req.body.down;
    let comment = req.body.comment;
    userSchema.find({currentToken: userToken}, (err, lst) => {
        if (err) {
            ut.dbConnectionFailureHandler(res, err)
        } else {
            if (lst.length === 0) {
                ut.respond(res, 400, "No user with this token found");
            }
            let user = lst[0];
            if (upVote !== undefined) {
                handleUp(memeId, user, res);
            } else if (downVote !== undefined) {
                handleDown(memeId, user, res);
            } else if (comment !== undefined) {
                handleComment(comment, memeId, user, res);
            } else {
                ut.respond(res, 200, "Nothing done");
            }
        }
    });
});

router.get("/", (req, res) => {
    const sortBy = req.body.sortBy;
    const filterBy = req.body.filterBy;
    const start = req.body.start;
    const end = req.body.end;
    memeSchema.find({status:2}, (err, items) => {
        if (err) {
            ut.respond(res, 500, 'No images found', err);
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
                ut.respond(res, 200, null);
                // TODO adapt to looking up rendered images via memeId
                res.send(items);
            } else {
                ut.respond(res, 400, "You have to give a number as start and a number as end," +
                    " which part of the items you want");
            }
        }
    });

})

module.exports = router;