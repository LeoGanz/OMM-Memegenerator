const express = require('express');
const router = express.Router();
const pictureSchema = require("../models/pictureSchema");
const utils = require("../utils");
const ut = new utils();

router.get('/single', (req, res) => {
    let pictures = [];
    let upVotes = [];
    let downVotes = [];
    pictureSchema.find({status: 2}, (err, lst) => {
        if (err) {
            console.log("503: Connection to db pictures failed");
            ut.sendIfNotAlready(res, 503, "Connection to db pictures failed");
        } else {
            if (lst.length === 0) {
                console.log("500: No meme found in the database");
                ut.sendIfNotAlready(res, 500, "No meme found in the database");
            }
            for (let elem in lst) {
                pictures.push(elem.metadata);
                upVotes.push(elem.upVoters.length);
                downVotes.push(elem.downVoters.length);
            }
            const answer = {pictures: pictures, upVotes: upVotes, downVotes: downVotes};
            console.log("Single statistics successful");
            ut.sendIfNotAlready(res, 200, answer);
        }
    });
});

router.get('/template', (req, res) => {
    let templates = [];
    let usages = [];
    pictureSchema.find({status: 0}, (err, lst) => {
        if (err) {
            console.log("503: Connection to db pictures failed");
            ut.sendIfNotAlready(res, 503, "Connection to db pictures failed");
        } else {
            if (lst.length === 0) {
                console.log("500: No template found in the database");
                ut.sendIfNotAlready(res, 500, "No template found in the database");
            }
            for (let elem in lst) {
                templates.push(elem.metadata);
                usages.push(elem.usage);
            }
            const answer = {templates: templates, usages: usages};
            console.log("Template statistics successful");
            ut.sendIfNotAlready(res, 200, answer);
        }
    });
});


module.exports = router;