const express = require('express');
const router = express.Router();
const pictureSchema = require("../models/pictureSchema");
const userSchema = require("../models/userSchema");
const textSchema = require("../models/textSchema");
const utils = require("../utils");
const ut = new utils();
let result = "Your created memes you can find under the URLs:\n";

// When creating a meme from a template the background image and its format will be taken from the template.
// All texts have to be provided by the user of this api.
// (Texts in the template will only be a guide for the user but not be brought directly to the new meme)
router.post('/', (req, res) => {
    const metadataTemplate = req.body.metadata;
    pictureSchema.find({metadata: metadataTemplate, status: 0}, (err, lst) => {
        if (err) {
            console.log("503: Connection to db pictures failed");
            res.status(503).send("Connection to db pictures failed");
        } else {
            if (lst.length === 0) {
                console.log("400: There is no template with this metadata");
                res.status(400).send("There is no template with this metadata");
            }
            const template = lst[0];

            const {memes} = req.body;
            let error = false;

            for (let i = 0; i < memes.length; i++) {
                const meme = memes[i];
                if (ut.checkForAppropriateForm(meme)) {
                    const name = meme.name;
                    const desc = meme.desc;
                    const lines = meme.texts;
                    const {xCoordinates} = meme;
                    const {yCoordinates} = meme;
                    const {xSizes} = meme;
                    const {ySizes} = meme;

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
                            error = true;
                        });
                        newTexts.push(textSch);
                    }

                    const dateString = ut.giveBackDateString();
                    const status = 2; //TODO why not let the user decide if 1 or 2?

                    //TODO consider which user created the meme instead of API
                    userSchema.find({username: "API"}, (err, lst) => {
                        if (err) {
                            console.log("503: Connection to db users failed");
                            error = true;
                        } else {
                            if (lst.length === 0) {
                                console.log("400: No API user found");
                                error = true;
                            }
                            const userAPI = lst[0];

                            const usage = template.usage;
                            pictureSchema.findOneAndUpdate({metadata: metadataTemplate}, {usage: usage + 1});
                            const backgroundImg = template.img.base64;

                            const picture = new pictureSchema({
                                name: name,
                                desc: desc,
                                img: {
                                    base64: backgroundImg
                                },
                                creator: userAPI,
                                dateOfCreation: dateString,
                                upVoters: [],
                                downVoters: [],
                                comments: [],
                                // metadata will be added afterwards
                                status: status, // 0 for a template, 1 for saved but
                                // not published, 2 for published
                                format: template.format,
                                texts: newTexts,
                                usage: 0,
                            });
                            picture.metadata = ut.calcMetadataForMeme(picture)


                            // It is possible that the template has been used before and
                            // the same modifications were made.
                            // If that is the case nothing new will be stored.
                            ut.canNewMemeBeStoredInDb(pictureSchema, picture.metadata, () => {
                                    error = true;
                                    console.log("503: Connection to db pictures failed");
                                }, () => {
                                    error = true;
                                    console.log("400: Meme does already exist");
                                }
                                , () => {
                                    pictureSchema.create(picture).catch(err => {
                                        console.log("503: Image creation went wrong: " + err);
                                        error = true;
                                    });
                                    result = result + "localhost:3000/image?metadata=" + picture.metadata + "\n";
                                    console.log("added result" + result);
                                    //TODO: Add one usage to template
                                    userAPI.lastEdited.push(picture);
                                });
                        }
                    });
                } else {
                    console.log("400: You need to give as many coordinates and sizes as texts as" +
                        " parameters 3-7 and two strings for name and description for 1 and 2");
                    error = true;
                }
            }
            if (!error) {
                console.log("200: Memes successfully created; result: " + result);
                res.status(200).send(result);
            } else {
                res.status(500).send("Something during creation went wrong");
            }
        }
    });


});

module.exports = router;