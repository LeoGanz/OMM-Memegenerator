const express = require('express');
const mongoose = require("mongoose");
const router = express.Router();
const mongoDB = 'mongodb://localhost:27017/images';
const imgSchema = require("../models/imageSchema");
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
    mongoose.connect(mongoDB).then(() => {
        mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));
        console.log('db connection initiated');
        imgSchema.find({}, (err, items) => {
            if (err) {
                console.log(err);
                res.status(500).send('Image not findable' + err);
            }
            else {
                res.render('imagesPage', { items: items });
            }
        });
    });
})

router.post('/', upload.single('image'), (req, res, next) => {
    const img = {
        name: req.body.name,
        desc: req.body.desc,
        img: {
            data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
            contentType: 'image/png'
        }
    };
    imgSchema.create(img, (err, item) => {
        if (err) {
            console.log(err);
        }
        else {
            item.save();
            res.redirect('/');
        }
    });
});

module.exports = router;