const express = require('express');
const router = express.Router();
const pictureSchema = require("../models/pictureSchema");
// const userSchema = require("../models/userSchema");
const utils = require("../utils");
const userSchema = require("../models/userSchema");
const ut = new utils();
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

function handleUp(metadata, userToken, res) {
    userSchema.find({currentToken: userToken}, (err, lst) => {
        if (err) {
            console.log("503: Connection to db failed");
            res.status(503).send("Connection to db failed");
        } else {
            if (lst.length === 0) {
                console.log("503: No user with this token found");
                res.status(503).send("No user with this token found");
            }
            const createUser = lst[0];

        }
    });
}

function handleDown(metadata, userToken, res) {
    userSchema.find({currentToken: userToken}, (err, lst) => {
        if (err) {
            console.log("503: Connection to db user failed");
            res.status(503).send("Connection to db user failed");
        } else {
            if (lst.length === 0) {
                console.log("400: No user with this token found");
                res.status(400).send("No user with this token found");
            }
            const createUser = lst[0];
            pictureSchema.find({metadata:metadata},(err, lst) =>{
                if (err) {
                    console.log("503: Connection to db picture failed");
                    res.status(503).send("Connection to db picture failed");
                } else {
                    if (lst.length === 0) {
                        console.log("400: No picture with this metadata found");
                        res.status(400).send("No picture with this metadata found");
                    }
                    let pict = lst[0];
                    let upvoters = pict.upVoters;
                    if (createUser in upvoters){
                        console.log()
                    }
                }
            });
        }
    });
}

function handleComment(comment, metadata, userToken, re) {

}

router.post("/", (req, res) => {
    let metadata = req.body.metadata;
    let userToken = req.body.token;
    let upVote = req.body.up;
    let downVote = req.body.down;
    let comment = req.body.comment;
    if (upVote !== undefined) {
        handleUp(metadata, userToken, res);
    }
    if (downVote !== undefined) {
        handleDown(metadata, userToken, res);
    }
    if (comment !== undefined) {
        handleComment(comment, metadata, userToken, res);
    }
});

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