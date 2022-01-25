const express = require('express');
const router = express.Router();
const pictureSchema = require("../models/pictureSchema");
const userSchema = require("../models/userSchema");
const {processSingleMemeCreation} = require("../memeCreator");
const utils = require("../utils");
const ut = new utils();

router.get('/', (req, res) => {
    pictureSchema.find({}, (err, lst) => {
        if (err) {
            ut.respond(res, 503, "Connection to db failed");
        } else {
            if (lst.length === 0) {
                ut.respond(res, 400, "No picture with this metadata found");
            } else {
                let templates = lst.filter((pict) => {
                    return pict.status === 0;
                });
                let wanted = lst.filter((pict) => {
                    return pict.metadata = req.query.metadata;
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