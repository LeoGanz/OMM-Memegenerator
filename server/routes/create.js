const express = require('express');
const router = express.Router();
const pictureSchema = require("../models/pictureSchema");
const userSchema = require("../models/userSchema");
const textSchema = require("../models/textSchema");
const utils = require("../utils");
const ut = new utils();


router.post('/', (req, res) => {
    let result = "Your created memes you can find under the URLs:\n";
    const metadataTemplate = req.query.metadata;
    pictureSchema.find({metadata: metadataTemplate, status: 0}, (err, lst) => {
        if (err) {
            console.log("503: Connection to db pictures failed");
            res.status(503).send("Connection to db pictures failed");
        } else {
            if (lst.length === 0) {
                console.log("400: There is no template with this metadata");
                res.status(400).send("There is no template with this metadata");
            }
            const texts = req.body.texts;
            for (let meme in texts) {
                if (ut.checkForAppropriateForm(meme)) {
                    const name = meme[0];
                    const desc = meme[1];
                    const lines = meme[2];
                    const xCoordinates = meme[3];
                    const yCoordinates = meme[4];
                    const xSizes = meme[5];
                    const ySizes = meme[6];

                    let newTexts = [];
                    for (let i = 0; i < lines.length; i++) {
                        const text = lines[i];
                        const xCoordinate = xCoordinates[i];
                        const yCoordinate = yCoordinates[i];
                        const xSize = xSizes[i];
                        const ySize = ySizes[i];

                        const textSch = new textSchema({
                            text: text,
                            xCoordinate: xCoordinate,
                            yCoordinate: yCoordinate,
                            xSize: xSize,
                            ySize: ySize
                        });
                        textSchema.create(textSch).then(_ => {
                        }).catch(_ => {
                            console.log("503: Error occurred during initialization of texts");
                            res.status(503).send("Error occurred during initialization of texts");
                        });
                        newTexts.push(textSch);
                    }

                    //TODO Metadata-Creation?
                    let metadata = metadataTemplate + "****"

                    ut.checkForMemeInPictures(pictureSchema, metadata, res);
                    const dateString = ut.giveBackDateString();
                    const status = 2;

                    //TODO consider which user created the meme instead of API
                    userSchema.find({username: "API"}, (err, lst) => {
                        if (err) {
                            console.log("503: Connection to db users failed");
                            res.status(503).send("Connection to db users failed");
                        } else {
                            if (lst.length === 0) {
                                console.log("400: No API user found");
                                res.status(400).send("No API user found");
                            }
                            const userAPI = lst[0];

                            pictureSchema.find({metadata: metadataTemplate}, (err, lst) => {
                                if (err) {
                                    console.log("503: Connection to db pictures failed; error: " + err);
                                    res.status(503).send("Connection to db pictures failed");
                                } else {
                                    if (lst.length === 0) {
                                        console.log("400: This template does not exist");
                                        res.status(400).send("This template does not exist");
                                    }
                                    const template = lst[0].img.base64;

                                    const picture = new pictureSchema({
                                        name: name,
                                        desc: desc,
                                        img: {
                                            base64: template
                                        },
                                        creator: userAPI,
                                        dateOfCreation: dateString,
                                        upVoters: [],
                                        downVoters: [],
                                        comments: [],
                                        metadata: metadata,
                                        status: status, // 0 for a template, 1 for saved but
                                        // not published, 2 for published
                                        format: {
                                            width: 200,
                                            height: 200,
                                            pixels: 200
                                        },
                                        texts: newTexts,
                                    });

                                    pictureSchema.create(picture).then(_ => {
                                        result = result + "localhost:3000/image?metadata=" + metadata + "\n";
                                    });
                                    userAPI.lastEdited.push(picture);
                                }
                            });
                        }
                    });
                } else {
                    console.log("400: You need to give as many coordinates and sizes as texts as" +
                        " parameters 3-7 and two strings for name and description for 1 and 2");
                    res.status(400).send("400: You need to give as many coordinates and sizes as texts as" +
                        " parameters 3-7 and two strings for name and description for 1 and 2");
                }
            }
            console.log("200: Memes successfully created");
            res.status(200).send(result);
        }
    });


});

module.exports = router;