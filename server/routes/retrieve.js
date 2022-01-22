const express = require('express');
const router = express.Router();
const pictureSchema = require("../models/pictureSchema");
const userSchema = require("../models/userSchema");
const textSchema = require("../models/textSchema");

router.get('/', (req, res) => {
    let result = "List of URLs leading to a by you specified meme: \n"
    const {numberOfMemes} = req.query;
    const text = req.query.text;
    const {creatorName} = req.query;
    let {creationDate} = req.query;

    textSchema.find({}, (err, lst) => {
        if (err) {
            console.log("503: Connection to db texts failed");
            res.status(503).send("Connection to db texts failed");
        } else {
            let possibleTexts = [];
            if (lst.length === 0 && text !== undefined) {
                console.log("200: No meme-texts found");
                res.status(200).send("No meme-texts found");
            } else {
                if (lst.length !== 0) {
                    possibleTexts = lst.filter((elem) => {
                        return elem.text.contains(text);
                    });
                } else {
                    possibleTexts = "";
                }
            }
            userSchema.find({}, (err, lst) => {
                if (err) {
                    console.log("503: Connection to db users failed");
                    res.status(503).send("Connection to db users failed");
                } else {
                    if (lst.length === 0) {
                        console.log("200: No users found");
                        res.status(200).send("No users found");
                    } else {
                        let possibleUsers = lst.filter((elem) => {
                            return elem.username === creatorName;
                        });
                        if (possibleUsers.length === 0 && creatorName !== undefined) {
                            console.log("400: No user with this name found");
                            res.status(400).send("No user with this name found");
                        }
                        let creator = "";
                        if (possibleUsers.length !== 0) {
                            creator = possibleUsers[0];
                        }
                        pictureSchema.find({}, (err, lst) => {
                            if (err) {
                                console.log("503: Connection to db pictures failed");
                                res.status(503).send("Connection to db pictures failed");
                            } else {
                                if (lst.length === 0) {
                                    console.log("200: No pictures in the db");
                                    res.status(200).send("No pictures in the db");
                                } else {
                                    let possiblePictures = lst.filter((elem) => {
                                        if (creationDate === undefined) {
                                            creationDate = elem.dateOfCreation;
                                        }
                                        if (creator === "") {
                                            creator = elem.creator;
                                        }
                                        if (possibleTexts === ""){
                                            possibleTexts = elem.texts;
                                        }
                                        return (elem.dateOfCreation.contains(creationDate)
                                            && elem.creator === creator
                                            && [...new Set([...possibleTexts, ...elem.texts])] === possibleTexts);
                                    });
                                    if (possiblePictures.length === 0) {
                                        console.log("200: No memes with these parameters found");
                                        res.status(200).send("No memes with these parameters found");
                                    } else {
                                        let slicedList;
                                        if (numberOfMemes !== undefined) {
                                            slicedList = possiblePictures.slice(0, numberOfMemes);
                                        } else {
                                            slicedList = possiblePictures;
                                        }
                                        for (let meme in slicedList) {
                                            result = result + "localhost:3000/image?metadata=" + meme.metadata + "\n";
                                        }
                                        console.log("200: Certain memes for retrieval found");
                                        res.status(200).send(result);
                                    }
                                }
                            }
                        });
                    }
                }
            });
        }
    });
});

module.exports = router;