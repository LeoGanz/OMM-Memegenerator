const express = require('express');
const router = express.Router();
const memeSchema = require("../models/memeSchema");
const userSchema = require("../models/userSchema");
const {processSingleMemeCreation} = require("../memeUploadHandler");
const {dbConnectionFailureHandler, cleanMeme, respondSilently, respond} = require("../utils");

// Retrieve raw data for single meme (intended for templates)
router.get('/', (req, res) => {
    memeSchema
        .findOne({memeId: req.query.memeId})
        .populate('texts')
        // do not populate all fields of users as this would leak private data
        .populate('creator', 'username')
        .populate('upVoters', 'username')
        .populate('downVoters', 'username')
        .populate({
            path: 'comments',
            populate: [{path: 'dateOfCreation'}, {path: 'text'}, {path: 'creator', select: 'username'}]
        })
        .exec((err, meme) => {
            if (err) {
                dbConnectionFailureHandler(res, err)
            } else {
                if (!meme) {
                    respond(res, 400, "No template with this memeId found");
                } else if (meme.status !== 0) {
                    respond(res, 400, "The requested meme is not a template (status 0)");
                } else {
                    respondSilently(res, 200, cleanMeme(meme));

                }
            }
        });
});

// upload single meme as a user, optionally using a template
router.post('/', (req, res) => {
    userSchema
        .findOne({currentToken: req.query.token})
        .exec((err, creator) => {
            if (err) {
                dbConnectionFailureHandler(res, err)
            } else {
                if (!creator) {
                    respond(res, 400, "No user with this token found");
                } else {
                    const memeIdTemplate = req.body.memeId;
                    if (memeIdTemplate) {
                        memeSchema
                            .findOne({memeId: memeIdTemplate, status: 0})
                            .exec((err, template) => {
                                if (err) {
                                    dbConnectionFailureHandler(res, err)
                                } else {
                                    if (!template) {
                                        respond(res, 400, "There is no template with this memeId. " +
                                            "Providing a template is optional.")
                                    } else {
                                        processSingleMemeCreation(req.body, creator, res, template)
                                    }
                                }
                            });
                    } else {
                        processSingleMemeCreation(req.body, creator, res)
                    }
                }
            }
        });
});

module.exports = router;