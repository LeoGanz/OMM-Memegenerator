const express = require('express');
const router = express.Router();
const memeSchema = require("../models/memeSchema");
const userSchema = require("../models/userSchema");
const {processSingleMemeCreation} = require("../memeUploadHandler");
const utils = require("../utils");
const ut = new utils();

router.get('/', (req, res) => {
    memeSchema.find({}, (err, lst) => {
        if (err) {
            ut.respond(res, 503, "Connection to db failed");
        } else {
            if (lst.length === 0) {
                ut.respond(res, 400, "No meme with this memeId found");
            } else {
                let templates = lst.filter((pict) => {
                    return pict.status === 0;
                });
                let wanted = lst.filter((pict) => {
                    return pict.memeId = req.query.memeId;
                });
                let toSend = {
                    wanted: wanted,
                    templates: templates,
                }
                ut.respond(res, 200, toSend);
            }
        }
    });
});

router.post('/', (req, res) => {
    userSchema.find({currentToken: req.query.token}, (err, lst) => {
        if (err) {
            ut.respond(res, 503, "Connection to db failed");
        } else {
            if (lst.length === 0) {
                ut.respond(res, 400, "No user with this token found");
            }
            processSingleMemeCreation(req.body, lst[0], res)
        }
    });
});

module.exports = router;