let express = require('express');
let router = express.Router();
const pictureSchema = require("../models/pictureSchema");
const utils = require("../utils");
const ut = new utils();

router.get("/", (req, res) => {
    const metadata = req.query.metadata;
    pictureSchema.find({metadata: metadata}, (err, lst) => {
        if (err) {
            ut.respond(res, 503, "Connection to db failed", err);
        } else {
            if (lst.length === 0) {
                ut.respond(res, 400, "No picture with this metadata found");
            } else {
                const pict = lst[0];
                console.log("Picture found:");
                ut.respond(res, 200, pict);
            }
        }
    });
});

module.exports = router;