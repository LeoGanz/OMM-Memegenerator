const express = require('express');
const router = express.Router();
const pictureSchema = require("../models/pictureSchema");
// const userSchema = require("../models/userSchema");
// const utils = require("../utils");
// const ut = new utils();
// const multer = require('multer');
// const path = require("path");
// const fs = require('fs');

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'uploads');
//     },
//     filename: (req, file, cb) => {
//         cb(null, file.fieldname + '-' + ut.giveBackDateString());
//     }
// });

// const upload = multer({storage: storage});


router.get("/", (req, res) => {

    pictureSchema.find({}, (err, items) => {
        if (err) {
            console.log(err);
            res.status(500).send('Image not findable' + err);
        } else {
            res.render('imagesPage', {items: items});
        }
    });
})

module.exports = router;