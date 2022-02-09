const express = require('express');
const router = express.Router();
const memeSchema = require("../models/memeSchema");
const {dbConnectionFailureHandler, respond, respondSilently} = require("../utils");

// Retrieve statistics for single memes that include up and down votes
router.get('/single', (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    let memes = [];
    let upVotes = [];
    let downVotes = [];
    memeSchema.find({status: 2}).populate('upVoters').populate('downVoters').exec((err, lst) => {
        if (err) {
            dbConnectionFailureHandler(res, err)
        } else {
            if (lst.length === 0) {
                respond(res, 500, "No meme found in the database");
            }
            for (let i = 0; i < lst.length; i++) {
                let elem = lst[i];
                memes.push(elem.memeId);
                upVotes.push(elem.upVoters.length);
                downVotes.push(elem.downVoters.length);
            }
            const answer = {memes: memes, upVotes: upVotes, downVotes: downVotes};
            console.log("Single statistics successful:" + "\n" + "memes: " + memes + "\n" + "upVotes: " +
                upVotes + "\n" + "downVotes: " +
                downVotes);
            respondSilently(res, 200, answer);
        }
    });
});

// Retrieve statistics for template usages
router.get('/template', (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    let templates = [];
    let usages = [];
    memeSchema.find({status: 0}, (err, lst) => {
        if (err) {
            dbConnectionFailureHandler(res, err)
        } else {
            if (lst.length === 0) {
                respond(res, 500, "No template found in the database");
            }
            for (let i = 0; i < lst.length; i++) {
                let elem = lst[i];
                templates.push(elem.memeId);
                usages.push(elem.usages);
            }
            const answer = {templates: templates, usages: usages};
            console.log("Template statistics successful:" + "\n" + "templates: " + templates + "\n" + "usages" +
                usages);
            respondSilently(res, 200, answer);
        }
    });
});


module.exports = router;