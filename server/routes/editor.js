const express = require('express');
const router = express.Router();
const pictureSchema = require("../models/pictureSchema");
const userSchema = require("../models/userSchema");
const textSchema = require("../models/textSchema");
const utils = require("../utils");
const ut = new utils();

router.get('/', (req, res) => {
    pictureSchema.find({}, (err, lst) => {
        if (err) {
            console.log("503: Connection to db failed");
            ut.sendIfNotAlready(res, 503, "Connection to db failed");
        } else {
            if (lst.length === 0) {
                console.log("400: No picture with this metadata found");
                ut.sendIfNotAlready(res, 400, "No picture with this metadata found");
            } else {
                let templates = lst.filter((pict) => {
                    return pict.status === 0;
                });
                let wanted = lst.filter((pict) => {
                    return pict.metadata = req.query.metadata;
                });
                let toSend = {
                    wanted: wanted,
                    templates: templates,
                }
                ut.sendIfNotAlready(res, 200, toSend);
            }
        }
    });
});

router.post('/', (req, res) => {
    userSchema.find({currentToken: req.query.token}, (err, lst) => {
        if (err) {
            console.log("503: Connection to db failed");
            ut.sendIfNotAlready(res, 503, "Connection to db failed");
        } else {
            if (lst.length === 0) {
                console.log("400: No user with this token found");
                ut.sendIfNotAlready(res, 400, "No user with this token found");
            }
            const createUser = lst[0];
            const texts = req.body.texts ?? [];
            const xCoordinates = req.body.xCoordinates ?? [];
            const yCoordinates = req.body.yCoordinates ?? [];
            const xSizes = req.body.xSizes ?? [];
            const ySizes = req.body.ySizes ?? [];
            let newTexts = [];
            if (texts.length !== xCoordinates.length ||
                texts.length !== yCoordinates.length ||
                texts.length !== xSizes.length ||
                texts.length !== ySizes.length) {
                console.log("400: Please provide lists of equal length " +
                    "for texts, xCoordinates, yCoordinates, xSizes and ySizes");
                ut.sendIfNotAlready(res, 400, "Please provide lists of equal length " +
                    "for texts, xCoordinates, yCoordinates, xSizes and ySizes");
            } else {
                for (let i = 0; i < texts.length; i++) {
                    const text = texts[i];
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
                        ut.sendIfNotAlready(res, 503, "Error occurred during initialization of" +
                            " texts");
                    });
                    newTexts.push(textSch);
                }


                // const uploads_dir = path.join(preDir + '/uploads/' + req.file.fileName);
                const dateString = ut.giveBackDateString();
                const status = req.body.status;

                let name = req.body.name;
                let desc = req.body.desc;


                const picture = new pictureSchema({
                    name: name,
                    desc: desc,
                    img: {
                        base64: req.body.image
                    },
                    creator: createUser,
                    dateOfCreation: dateString,
                    upVoters: [],
                    downVoters: [],
                    comments: [],
                    // metadata will be added afterwards
                    status: status, // 0 for a template, 1 for saved but
                    // not published, 2 for published
                    format: {
                        width: parseFloat(req.body.width),
                        height: parseFloat(req.body.height),
                        pixels: parseFloat(req.body.pixels)
                    },
                    texts: newTexts,
                    usage: 0,
                });

                picture.metadata = ut.calcMetadataForMeme(picture)
                ut.canNewMemeBeStoredInDb(pictureSchema, picture.metadata, () => {
                    console.log("503: Connection to db failed");
                    ut.sendIfNotAlready(res, 503, "Connection to db failed");
                }, () => {
                    console.log("400: This meme does already exist");
                    ut.sendIfNotAlready(res, 400, "This meme does already exist");
                }, () => {
                    pictureSchema.create(picture).then(_ => {
                        console.log("img saved, status: " + String(status));
                        if (status === 2) {
                            ut.addOneUsage(pictureSchema, req.body.image, res, () => {
                                res.redirect('/images');
                            });
                        } else {
                            console.log("200: Saving complete");
                            ut.sendIfNotAlready(res, 200, "Saving complete");
                        }
                    });
                    createUser.lastEdited.push(picture);
                });

            }
        }
    });
});

module.exports = router;