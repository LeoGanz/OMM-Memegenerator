const express = require('express');
const router = express.Router();
const memeSchema = require("../models/memeSchema");
const userSchema = require("../models/userSchema");
const {processMultipleMemeCreations} = require("../memeUploadHandler");
const {dbConnectionFailureHandler, respond} = require("../utils");

// Allows creation of memes. API accessible without frontend
router.post('/', (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    const memeIdTemplate = req.body.memeId;
    memeSchema
        .findOne({memeId: memeIdTemplate, status: 0})
        .exec((err, template) => {
            if (err) {
                dbConnectionFailureHandler(res, err)
            } else {
                if (!template) {
                    respond(res, 400, "There is no template with this memeId")
                } else {
                    const {memes} = req.body;

                    userSchema.findOne({username: "API"}, (err, apiUser) => {
                        if (err) {
                            dbConnectionFailureHandler(res, err)
                        } else {
                            if (!apiUser) {
                                respond(res, 400, "No API user found");
                            }
                            processMultipleMemeCreations(memes, apiUser, res, template)
                        }
                    });
                }
            }
        });
});

module.exports = router;