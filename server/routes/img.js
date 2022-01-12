const express = require('express');
const mongoose = require("mongoose");
const router = express.Router();
const mongoDBImages = 'mongodb://localhost:27017/images';
const mongoDBUsers = 'mongodb://localhost:27017/users';
const pictureSchema = require("../models/pictureSchema");
const userSchema = require("../models/userSchema");
const utils = require("../utils");
const ut = new utils();
const multer = require('multer');
const path = require("path");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads');
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + ut.giveBackDateString());
    }
});

const upload = multer({storage: storage});


router.get("/", (req, res) => {
    mongoose.connect(mongoDBImages).then(() => {
        mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));
        console.log('db connection initiated');
        pictureSchema.find({}, (err, items) => {
            if (err) {
                console.log(err);
                res.status(500).send('Image not findable' + err);
            } else {
                res.render('imagesPage', {items: items});
            }
        });
    });
})

router.post('/', upload.single('image'), (req, res) => {
    mongoose.connect(mongoDBUsers).then(() => {
        mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));
        console.log('db connection initiated');
        userSchema.find({currentToken: req.query.token}, (err, lst) => {
            if (err) {
                console.log("503: Connection to db failed");
                res.status(503).send("Connection to db failed");
            } else {
                if(lst.length === 0){
                    console.log("503: No user with this token found");
                    res.status(503).send("No user with this token found");
                }
                const createUser = lst[0];
                mongoose.connect(mongoDBImages).then(() => {
                    mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));
                    console.log('db connection initiated');
                    const uploads_dir = path.join(__dirname + '/uploads/' + req.file.filename);
                    console.log(uploads_dir);
                    const dateString = ut.giveBackDateString();
                    const img = {
                        name: req.body.name,
                        desc: req.body.desc,
                        img: {
                            data: fs.readFileSync(uploads_dir),
                            contentType: 'image/png'
                        },
                        creator: {createUser},
                        dateOfCreation: dateString,
                        upVoters: [],
                        downVoters: [],
                        comments: [],
                        metadata: req.body.metadata,
                        format: {
                            width: req.body.width,
                            height: req.body.height,
                            pixels: req.body.pixels
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
                });
            }
        });
    });
});

module.exports = router;