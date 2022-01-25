let express = require('express');
let router = express.Router();
const pictureSchema = require("../models/pictureSchema");
const utils = require("../utils");
const ut = new utils();

router.get("/", (req, res) => {
    const metadata = req.query.metadata;
    pictureSchema.find({metadata: metadata}, (err, lst) => {
        if (err) {
            console.log("503: Connection to db failed; error: " + err);
            ut.sendIfNotAlready(res, 503, "Connection to db failed");
        } else {
            if (lst.length === 0) {
                console.log("400: No picture with this metadata found");
                ut.sendIfNotAlready(res, 400, "No picture with this metadata found");
            } else {
                const pict = lst[0];
                console.log("200: Picture found");
                ut.sendIfNotAlready(res, 200, pict);
            }
        }
    });
});

module.exports = router;