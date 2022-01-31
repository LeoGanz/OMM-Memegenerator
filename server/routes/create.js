const express = require('express');
const router = express.Router();
const pictureSchema = require("../models/pictureSchema");
const userSchema = require("../models/userSchema");
const {processMultipleMemeCreations} = require("../memeUploadHandler");
const utils = require("../utils");
const ut = new utils();

router.post('/', (req, res) => {
    const metadataTemplate = req.body.metadata;
    pictureSchema.find({metadata: metadataTemplate, status: 0}, (err, lst) => {
        if (err) {
            ut.respond(res, 503, "Connection to db pictures failed", err);
        } else {
            if (lst.length === 0) {
                ut.respond(res, 400, "There is no template with this metadata")
            }
            const template = lst[0];
            const {memes} = req.body;
            //TODO consider which user created the meme instead of API
            userSchema.find({username: "API"}, (err, lst) => {
                if (err) {
                    ut.respond(res, 503, "Connection to db users failed", err);
                } else {
                    if (lst.length === 0) {
                        ut.respond(res, 400, "No API user found");
                    }
                    const userApi = lst[0];
                    processMultipleMemeCreations(memes, userApi, res, template)
                }
            });
        }
    });
});

module.exports = router;