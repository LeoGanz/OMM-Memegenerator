const express = require('express');
const router = express.Router();
const memeSchema = require("../models/memeSchema");
const commentSchema = require("../models/commentSchema");
const userSchema = require("../models/userSchema");
const {getOrRenderMemes} = require("../renderManager");
const {
    respond,
    getCurrentDateString,
    dbConnectionFailureHandler,
    respondSilently,
    parseMetadata
} = require("../utils");

/**
 * Handles an up vote
 * @param memeId The memeId of the meme being voted up
 * @param user The user voting it up
 * @param res The result to be sent
 */
function handleUp(memeId, user, res) {
    memeSchema.find({memeId: memeId}, (err, lst) => {
        if (err) {
            respond(res, 503, "Connection to db meme failed");
        } else {
            if (lst.length === 0) {
                respond(res, 400, "No meme with this memeId found");
            }
            let pict = lst[0];
            let upVoters = pict.upVoters;
            if (upVoters.includes(user._id)) {
                respond(res, 400, "You have already up voted this");
            } else {
                pict.downVoters = pict.downVoters.filter((elem) => !elem.equals(user._id));
                pict.upVoters.push(user);
                pict.save();
                respond(res, 200, "Meme upvote succeeded");
            }
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
            respond(res, 503, "Connection to db meme failed");
        } else {
            if (lst.length === 0) {
                respond(res, 400, "No meme with this memeId found");
            }
            let pict = lst[0];
            let downVoters = pict.downVoters;
            if (downVoters.includes(user._id)) {
                respond(res, 400, "You have already down voted this");
            } else {
                pict.upVoters = pict.upVoters.filter((elem) => !elem.equals(user._id));
                pict.downVoters.push(user);
                pict.save();
                respond(res, 200, "Meme downvote succeeded");
            }
        }
    });
}

function handleRemoveVotes(memeId, user, res) {
    memeSchema.find({memeId: memeId}, (err, lst) => {
        if (err) {
            respond(res, 503, "Connection to db meme failed");
        } else {
            if (lst.length === 0) {
                respond(res, 400, "No meme with this memeId found");
            }
            let pict = lst[0];
            pict.upVoters = pict.upVoters.filter((elem) => !elem.equals(user._id));
            pict.downVoters = pict.downVoters.filter((elem) => !elem.equals(user._id));
            pict.save();
            respond(res, 200, "Removal of votes succeeded");
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
    const currentDate = getCurrentDateString();
    const comm = {
        memeId: memeId,
        dateOfCreation: currentDate,
        creator: user,
        text: comment
    };
    memeSchema.find({memeId: memeId}, (err, lst) => {
        if (err) {
            dbConnectionFailureHandler(res, err)
        } else {
            if (lst.length === 0) {
                respond(res, 400, "No meme with this memeId found");
            }
            let pict = lst[0];
            commentSchema.create(comm, _ => {
                commentSchema.find({text: comment, creator: user}, (err, lst) => {
                    if (err) {
                        dbConnectionFailureHandler(res, err)
                    } else {
                        if (lst.length === 0) {
                            respond(res, 400, "No comment with this user and string found");
                        } else {
                            let toPush = lst[0]
                            pict.comments.push(toPush);
                            pict.save();
                            user.lastComments.push(toPush);
                            user.save();
                            respond(res, 200, "Meme comment add succeeded");
                        }
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
    let removeVotes = req.body.remove;
    let comment = req.body.comment;
    userSchema.find({currentToken: userToken}, (err, lst) => {
        if (err) {
            dbConnectionFailureHandler(res, err)
        } else {
            if (lst.length === 0) {
                respond(res, 400, "No user with this token found");
            }
            let user = lst[0];
            if (removeVotes !== undefined) {
                handleRemoveVotes(memeId, user, res);
            } else if (upVote !== undefined) {
                handleUp(memeId, user, res);
            } else if (downVote !== undefined) {
                handleDown(memeId, user, res);
            } else if (comment !== undefined) {
                handleComment(comment, memeId, user, res);
            } else {
                respond(res, 200, "Nothing done");
            }
        }
    });
});

router.get("/", (req, res) => {
    const sortBy = req.query.sortBy;
    const filterBy = req.query.filterBy;
    const start = parseInt(req.query.start);
    const end = parseInt(req.query.end);
    const status = parseInt(req.query.status);

    // Do not allow lookup of other users' drafts
    if (isNaN(status) || ![0, 1, 2].includes(status)) {
        respond(res, 400, "Provide a the numbers 0, 1 or 2 for the status")
    } else if (status === 1) {
        userSchema.findOne({currentToken: req.query.token}).exec(
            (err, user) => {
                if (err) {
                    dbConnectionFailureHandler(res, err);
                } else if (!user) {
                    // should never occur as login is checked by eternal route
                    respond(res, 400, "Could not find user with the current token");
                } else if (user.username !== filterBy) {
                    respond(res, 400, "You may only lookup your own drafts")
                } else {
                    performRetrieval();
                }
            }
        );
    } else {
        performRetrieval();
    }

    function performRetrieval() {
        memeSchema
            .find({status: status}) // published only
            .populate('texts')
            // do not populate whole creator as this would leak private data
            .populate('creator', 'username')
            .populate('upVoters', 'username')
            .populate('downVoters', 'username')
            .populate({
                path: 'comments',
                populate: [{path: 'dateOfCreation'}, {path: 'text'}, {path: 'creator', select: 'username'}]
            })
            .exec((err, items) => {
                if (err) {
                    respond(res, 500, 'No images found', err);
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
                    if (!isNaN(start) && !isNaN(end)) {
                        items = items.slice(start, end);
                        getOrRenderMemes(
                            items.map(meme => meme.memeId),
                            renderingArray => {
                                const dataMetadataCombinations = [];
                                for (let i = 0; i < items.length; i++) {
                                    dataMetadataCombinations.push({
                                        dataUrl: renderingArray[i],
                                        metadata: parseMetadata(items[i])
                                    })
                                }
                                respondSilently(res, 200, dataMetadataCombinations)
                            },
                            err => dbConnectionFailureHandler(res, err))
                    } else {
                        respond(res, 400, "You have to give a number as start and a number as end," +
                            " which part of the items you want");
                    }
                }
            });
    }
})

module.exports = router;