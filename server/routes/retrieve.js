const express = require('express');
const router = express.Router();
const memeSchema = require("../models/memeSchema");
const userSchema = require("../models/userSchema");
const textSchema = require("../models/textSchema");
const utils = require("../utils");
const ut = new utils();

function respondDepCreator(possibleMemes, creatorName, counter, numberOfMemes, result, res) {
    if (possibleMemes.length !== 0 && numberOfMemes !== undefined && counter < numberOfMemes) {
        const elem = possibleMemes.shift();
        elem.populate('creator', function (err, meme) {
            if (err) {
                ut.respond(res, 500, "creator could not be retrieved", "");
            } else {
                // console.log(meme.creator.username, creatorName);
                if (creatorName === undefined || meme.creator.username === creatorName) {
                    result = result + ut.getDomain() + "/image?memeId=" + meme.memeId + "\n";
                    counter += 1;
                }
                respondDepCreator(possibleMemes, creatorName, counter, numberOfMemes, result, res);
            }
        });
    } else {
        console.log("Certain memes for retrieval found:");
        ut.respond(res, 200, result);
    }
}


router.get('/', (req, res) => {
    let result = "List of URLs leading to a by you specified meme: \n"
    const {numberOfMemes} = req.query;
    const text = req.query.text;
    const {creatorName} = req.query;
    let {creationDate} = req.query;

    textSchema.find({}, (err, lst) => {
        if (err) {
            ut.dbConnectionFailureHandler(res, err)
        } else {
            let possibleTexts = [];
            if (lst.length === 0 && text !== undefined) {
                ut.respond(res, 200, "No meme-texts found");
            } else {
                if (lst.length !== 0) {
                    possibleTexts = lst.filter((elem) => {
                        return elem.text.includes(text);
                    });
                }
            }
            // console.log(possibleTexts);
            userSchema.find({}, (err, lst) => {
                if (err) {
                    ut.dbConnectionFailureHandler(res, err)
                } else {
                    if (lst.length === 0) {
                        ut.respond(res, 200, "No users found");
                    } else {
                        let possibleUsers = lst.filter((elem) => {
                            if (creatorName !== undefined) {
                                return elem.username === creatorName;
                            } else {
                                return true;
                            }
                        });
                        if (possibleUsers.length === 0) {
                            ut.respond(res, 400, "No user with this username exists", "");
                        } else {
                            memeSchema.find({}, (err, lst) => {
                                if (err) {
                                    ut.dbConnectionFailureHandler(res, err)
                                } else {
                                    if (lst.length === 0) {
                                        ut.respond(res, 200, "No memes in the db");
                                    } else {
                                        let possibleMemes = lst.filter((elem) => {
                                            let fitting = true;
                                            if (creationDate !== undefined) {
                                                fitting = fitting && elem.dateOfCreation.includes(creationDate);
                                            }
                                            if (possibleTexts !== []) {
                                                fitting = fitting && [...new Set([...possibleTexts, ...elem.texts])].length !== 0;
                                            }
                                            return fitting;
                                        });
                                        // console.log(possibleTexts, creatorName, creationDate);
                                        if (possibleMemes.length === 0) {
                                            ut.respond(res, 200, "No memes with these parameters found");
                                        } else {
                                            respondDepCreator(possibleMemes, creatorName, 0, numberOfMemes, result, res);
                                        }
                                    }
                                }
                            });
                        }
                    }
                }
            });
        }
    });
});

module.exports = router;