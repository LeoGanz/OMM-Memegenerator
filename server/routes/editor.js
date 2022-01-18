const express = require('express');
const router = express.Router();
const pictureSchema = require("../models/pictureSchema");
const userSchema = require("../models/userSchema");
const utils = require("../utils");
const ut = new utils();

router.get('/', (req, res) => {
    pictureSchema.find({metadata: req.query.metadata}, (err, lst) => {
        if (err) {
            console.log("503: Connection to db failed");
            res.status(503).send("Connection to db failed");
        } else {
            if (lst.length === 0) {
                console.log("503: No picture with this metadata found");
                res.status(503).send("No picture with this metadata found");
            }
            const pict = lst[0];
            res.status(200).send(pict.img.base64);
        }
    });
});

router.post('/', (req, res) => {
    userSchema.find({currentToken: req.body.token}, (err, lst) => {
        if (err) {
            console.log("503: Connection to db failed");
            res.status(503).send("Connection to db failed");
        } else {
            if (lst.length === 0) {
                console.log("503: No user with this token found");
                res.status(503).send("No user with this token found");
            }
            const createUser = lst[0];

            // const uploads_dir = path.join(preDir + '/uploads/' + req.file.fileName);
            const dateString = ut.giveBackDateString();
            const img = {
                name: req.body.name,
                desc: req.body.desc,
                img: {
                    // data: fs.readFileSync(uploads_dir),
                    // contentType: 'image/png'
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
                }
            };

            pictureSchema.create(img, (err) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log("img saved");
                    res.redirect('/');
                }
            });
        }
    });
});