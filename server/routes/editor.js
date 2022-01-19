const express = require('express');
const router = express.Router();
const pictureSchema = require("../models/pictureSchema");
const userSchema = require("../models/userSchema");
const utils = require("../utils");
const ut = new utils();

router.get('/', (req, res) => {
    pictureSchema.find({}, (err, lst) => {
        if (err) {
            console.log("503: Connection to db failed");
            res.status(503).send("Connection to db failed");
        } else {
            if (lst.length === 0) {
                console.log("400: No picture with this metadata found");
                res.status(400).send("No picture with this metadata found");

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
                res.status(200).send(toSend);
            }
        }
    });
});

router.post('/', (req, res) => {
    userSchema.find({currentToken: req.query.token}, (err, lst) => {
        if (err) {
            console.log("503: Connection to db failed");
            res.status(503).send("Connection to db failed");
        } else {
            if (lst.length === 0) {
                console.log("400: No user with this token found");
                res.status(400).send("No user with this token found");
            }
            const createUser = lst[0];

            // const uploads_dir = path.join(preDir + '/uploads/' + req.file.fileName);
            const dateString = ut.giveBackDateString();
            let status = req.body.status;
            const picture = new pictureSchema({
                name: req.body.name,
                desc: req.body.desc,
                img: {
                    base64: req.body.image
                },
                creator: createUser,
                dateOfCreation: dateString,
                upVoters: [],
                downVoters: [],
                comments: [],
                metadata: req.body.metadata,
                format: {
                    width: parseFloat(req.body.width),
                    height: parseFloat(req.body.height),
                    pixels: parseFloat(req.body.pixels)
                },
                status: status // 0 for a template, 1 for saved but not published, 2 for published
            });

            pictureSchema.create(picture).then(_ => {
                console.log("img saved, status: " + String(status));
                if (status === 2) {
                    res.redirect('/');
                } else {
                    console.log("200: Saving complete");
                    res.status(200).send("Saving complete");
                }
            }).catch(() => {
                console.log("503: Connection to db failed");
                res.status(503).send("Connection to db failed");
            });
        }
    });
});

module.exports = router;