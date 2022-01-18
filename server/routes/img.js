const express = require('express');
const router = express.Router();
const pictureSchema = require("../models/pictureSchema");
const commentSchema = require("../models/commentSchema");
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

function handleUp(metadata, user, res) {
    pictureSchema.find({metadata: metadata}, (err, lst) => {
        if (err) {
            console.log("503: Connection to db picture failed");
            res.status(503).send("Connection to db picture failed");
        } else {
            if (lst.length === 0) {
                console.log("400: No picture with this metadata found");
                res.status(400).send("No picture with this metadata found");
            }
            let pict = lst[0];
            let upVoters = pict.upVoters;
            if (user in upVoters) {
                console.log("400: You have already up voted this");
                res.status(400).send("You have already up voted this");
            }
            pict.downVoters = pict.downVoters.filter((elem) => elem !== user);
            pict.upVoters.push(user);

            console.log("200: Picture update succeeded");
            res.status(200).send("Picture update succeeded");
        }
    });
}

function handleDown(metadata, user, res) {
    pictureSchema.find({metadata: metadata}, (err, lst) => {
        if (err) {
            console.log("503: Connection to db picture failed");
            res.status(503).send("Connection to db picture failed");
        } else {
            if (lst.length === 0) {
                console.log("400: No picture with this metadata found");
                res.status(400).send("No picture with this metadata found");
            }
            let pict = lst[0];
            let downVoters = pict.downVoters;
            if (user in downVoters) {
                console.log("400: You have already down voted this");
                res.status(400).send("You have already down voted this");
            }
            pict.upVoters = pict.upVoters.filter((elem) => elem !== user);
            pict.downVoters.push(user);

            console.log("200: Picture downdate succeeded");
            res.status(200).send("Picture downdate succeeded");
        }
    });
}

function handleComment(comment, metadata, user, res) {
    const currentDate = ut.giveBackDateString();
    const comm = {
        dateOfCreation: currentDate,
        creator: user,
        comment: comment
    };
    pictureSchema.find({metadata: metadata}, (err, lst) => {
        if (err) {
            console.log("503: Connection to db picture failed");
            res.status(503).send("Connection to db picture failed");
        } else {
            if (lst.length === 0) {
                console.log("400: No picture with this metadata found");
                res.status(400).send("No picture with this metadata found");
            }
            let pict = lst[0];
            commentSchema.create(comm, err => {
                console.log("503: Connection to db comment failed");
                res.status(503).send("Connection to db comment failed");

                commentSchema.find({comment: comment, creator: user}, (err, lst) => {
                    if(err){
                        console.log("503: Connection to db comment failed");
                        res.status(503).send("Connection to db comment failed");
                    }else{
                        if (lst.length === 0) {
                            console.log("400: No comment with this user and string found");
                            res.status(400).send("No comment with this user and string found");
                        }
                        pict.comments.push(lst[0]);
                        console.log("200: Picture comment add succeeded");
                        res.status(200).send("Picture comment add succeeded");
                    }
                });
            });
        }
    });
}

router.post("/", (req, res) => {
    let metadata = req.body.metadata;
    let userToken = req.body.token;
    let upVote = req.body.up;
    let downVote = req.body.down;
    let comment = req.body.comment;
    userSchema.find({currentToken: userToken}, (err, lst) => {
        if (err) {
            console.log("503: Connection to db user failed");
            res.status(503).send("Connection to db user failed");
        } else {
            if (lst.length === 0) {
                console.log("400: No user with this token found");
                res.status(400).send("No user with this token found");
            }
            let user = lst[0];
            if (upVote !== undefined) {
                handleUp(metadata, user, res);
            }
            if (downVote !== undefined) {
                handleDown(metadata, user, res);
            }
            if (comment !== undefined) {
                handleComment(comment, metadata, user, res);
            }
        }
    });
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