const express = require('express');
const router = express.Router();
const memeSchema = require("../models/memeSchema");
const utils = require("../utils");
const ut = new utils();

router.get('/single', (req, res) => {
    let memes = [];
    let upVotes = [];
    let downVotes = [];
    memeSchema.find({status: 2}, (err, lst) => {
        if (err) {
            ut.respond(res, 503, "Connection to db memes failed", err);
        } else {
            if (lst.length === 0) {
                ut.respond(res, 500, "No meme found in the database");
            }
            for (let elem in lst) {
                memes.push(elem.memeId);
                upVotes.push(elem.upVoters.length);
                downVotes.push(elem.downVoters.length);
            }
            const answer = {memes: memes, upVotes: upVotes, downVotes: downVotes};
            console.log("Single statistics successful");
            ut.respondSilently(res, 200, answer);
        }
    });
});

router.get('/template', (req, res) => {
    let templates = [];
    let usages = [];
    memeSchema.find({status: 0}, (err, lst) => {
        if (err) {
            ut.respond(res, 503, "Connection to db memes failed");
        } else {
            if (lst.length === 0) {
                ut.respond(res, 500, "No template found in the database");
            }
            for (let elem in lst) {
                templates.push(elem.memeId);
                usages.push(elem.usages);
            }
            const answer = {templates: templates, usages: usages};
            console.log("Template statistics successful");
            ut.respondSilently(res, 200, answer);
        }
    });
});


module.exports = router;