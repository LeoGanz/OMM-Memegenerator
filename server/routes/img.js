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
    parseMetadata,
    noMemeFoundHandler
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

// Social interactions with a meme
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

            // Only one of the possible social actions can take effect within one request.
            // Priorities are: remove > upvote > downvote > comment
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

/**
 * Retrieve, filter and sort memes from the database. If accessing drafts, the user has to filter by his/her own name.
 * @param status 0 for templates, 1 for drafts, 2 for published memes
 * @param filterBy a username
 * @param sortBy sort by up or down votes, either ascending or descending -> "up asc", "up desc", "down asc" or "down desc"
 * @param userToken token of the current user
 * @param onSuccess callback for retrieved, filtered and sorted memes
 * @param onError callback for errors
 * @param onNothingFound callback for when no memes match
 * @param onNameMismatch callback if drafts are accessed but the username in filterBy mismatches
 */
function getMatchingItems(status, filterBy, sortBy, userToken, onSuccess, onError, onNothingFound, onNameMismatch) {
    if (status === 1) {
        userSchema.findOne({currentToken: userToken}).exec(
            (err, user) => {
                if (err) {
                    onError(err);
                } else if (!user) {
                    // should never occur as login is checked by eternal route
                    onError("Could not find user with the current token");
                } else {
                    filterBy = user.username;
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
            // do not populate all fields of users as this would leak private data
            .populate('creator', 'username')
            .populate('upVoters', 'username')
            .populate('downVoters', 'username')
            .populate({
                path: 'comments',
                populate: [{path: 'dateOfCreation'}, {path: 'text'}, {path: 'creator', select: 'username'}]
            })
            .exec((err, items) => {
                if (err) {
                    onError(err);
                } else if (!items) {
                    onNothingFound();
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
                    } else if (sortBy === "up asc") {
                        items = items.sort((a, b) => {
                            if (a.upVoters.length > b.upVoters.length) {
                                return 1;
                            }
                            if (a.upVoters.length < b.upVoters.length) {
                                return -1;
                            }
                            return 0;
                        });
                    } else if (sortBy === "down desc") {
                        items = items.sort((a, b) => {
                            if (a.downVoters.length > b.downVoters.length) {
                                return -1;
                            }
                            if (a.downVoters.length < b.downVoters.length) {
                                return 1;
                            }
                            return 0;
                        });
                    } else if (sortBy === "down asc") {
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
                    onSuccess(items);
                }
            });
    }
}

// Retrieving multiple memes / drafts or templates. Includes renderings and metadata.
router.get("/", (req, res) => {
    const sortBy = req.query.sortBy;
    const filterBy = req.query.filterBy; // filter by username
    const start = parseInt(req.query.start);
    const end = parseInt(req.query.end);
    const status = parseInt(req.query.status);
    const userToken = req.query.token;

    // Do not allow lookup of other users' drafts
    if (isNaN(status) || ![0, 1, 2].includes(status)) {
        respond(res, 400, "Provide a the numbers 0, 1 or 2 for the status")
    } else {
        getMatchingItems(status, filterBy, sortBy, userToken,
            items => {
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
            },
            err => dbConnectionFailureHandler(res, err),
            () => noMemeFoundHandler(res),
            msg => respond(res, 400, msg));
    }
})

module.exports = {
    imgRouter: router, getMatchingItems
};