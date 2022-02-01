const express = require('express');
const router = express.Router();
const pictureSchema = require("../models/pictureSchema");
const userSchema = require("../models/userSchema");
const textSchema = require("../models/textSchema");
const utils = require("../utils");
const ut = new utils();

function respondDepCreator(possiblePictures, creatorName, counter, numberOfMemes, result, res) {
    if (possiblePictures.length !== 0 && numberOfMemes !== undefined && counter < numberOfMemes) {
        const elem = possiblePictures.shift();
        elem.populate('creator', function (err, meme) {
            if (err) {
                ut.respond(res, 500, "creator could not be retrieved", "");
            } else {
                // console.log(meme.creator.username, creatorName);
                if (creatorName === undefined || meme.creator.username === creatorName) {
                    result = result + "localhost:3000/image?metadata=" + meme.metadata + "\n";
                    counter += 1;
                    respondDepCreator(possiblePictures, creatorName, counter, numberOfMemes, result, res);
                } else {
                    respondDepCreator(possiblePictures, creatorName, counter, numberOfMemes, result, res);
                }
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
            ut.respond(res, 503, "Connection to db texts failed", err);
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
                    ut.respond(res, 503, "Connection to db users failed", err);
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
                            pictureSchema.find({}, (err, lst) => {
                                if (err) {
                                    ut.respond(res, 503, "Connection to db pictures failed", err);
                                } else {
                                    if (lst.length === 0) {
                                        ut.respond(res, 200, "No pictures in the db");
                                    } else {
                                        let possiblePictures = lst.filter((elem) => {
                                            let fitting = true;
                                            if (creationDate !== undefined) {
                                                fitting = fitting && elem.dateOfCreation.includes(creationDate);
                                            }
                                            if (possibleTexts !== []) {
                                                const textIntersection = possibleTexts.filter((el) => {
                                                    return el in elem.texts;
                                                })
                                                fitting = fitting && textIntersection.length !== 0;
                                            }
                                            return fitting;
                                        });
                                        // console.log(possibleTexts, creatorName, creationDate);
                                        if (possiblePictures.length === 0) {
                                            ut.respond(res, 200, "No memes with these parameters found");
                                        } else {
                                            respondDepCreator(possiblePictures, creatorName, 0, numberOfMemes, result, res);
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