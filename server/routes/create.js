const express = require('express');
const router = express.Router();
const pictureSchema = require("../models/pictureSchema");
const textSchema = require("../models/textSchema");
const utils = require("../utils");
const ut = new utils();


router.post('/', (req, res) => {
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
            for (let meme1 in texts) {
                if (ut.checkForEqualLength(meme1)) {
                    const lines = meme1[0];
                    const xCoordinates = meme1[1];
                    const yCoordinates = meme1[2];
                    const xSizes = meme1[3];
                    const ySizes = meme1[4];

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
                    const userAPI = ut.userAPI;


                } else {
                    console.log("400: You need to give as many coordinates and sizes as texts");
                    res.status(400).send("You need to give as many coordinates and sizes as texts");
                }
            }
        }
    });


});

module.exports = router;