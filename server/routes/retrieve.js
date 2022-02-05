const express = require('express');
const router = express.Router();
const memeSchema = require("../models/memeSchema");
const userSchema = require("../models/userSchema");
const textSchema = require("../models/textSchema");
const {respond, getDomain, dbConnectionFailureHandler} = require("../utils");

function textInText(text, texts) {
    let inside = false;
    if (texts.length === 0) {
        return true;
    }
    for (let i = 0; i < texts.length; i++) {
        const elem = texts[i];
        if (elem.text.includes(text)) {
            inside = true;
        }
    }
    return inside;
}

router.get('/', (req, res) => {
    let result = "List of URLs leading to a by you specified meme: \n"
    const {numberOfMemes} = req.query ?? 5;
    const text = req.query.text ?? "";
    const {creatorName} = req.query;
    let {creationDate} = req.query;

    memeSchema.find({}).populate("creator", "username").populate("texts"
    ).exec((err, lst) => {
        console.log(lst[0]);
        if (err) {
            dbConnectionFailureHandler(res, err);
        } else {
            console.log(lst[0]);
            const filteredList = lst.filter((elem) => {
                let filter = true;
                filter = filter && textInText(text, elem.texts);
                filter = filter && (elem.username === creatorName || creatorName === undefined);
                filter = filter && (elem.creationDate === creationDate || creationDate === undefined);
                return filter;
            });
            console.log(filteredList);
            const slicedList = filteredList.slice(0, numberOfMemes);
            if (slicedList.length === 0) {
                respond(res, 200, "No memes with these parameters found");
            } else {
                for (let i = 0; i < slicedList.length; i++) {
                    const meme = slicedList[i];
                    result += getDomain() + "image?memeId=" + meme.memeId + "\n";
                }
                respond(res, 200, result);
            }
        }
    });
});

module.exports = router;