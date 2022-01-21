let express = require('express');
let router = express.Router();
const pictureSchema = require("../models/pictureSchema");

router.get("/", (req, res) => {
    const metadata = req.query.metadata;
    pictureSchema.find({metadata: metadata}, (err, lst) => {
        if (err) {
            console.log("503: Connection to db failed; error: " + err);
            res.status(503).send("Connection to db failed");
        } else {
            if (lst.length === 0) {
                console.log("400: No picture with this metadata found");
                res.status(400).send("No picture with this metadata found");
            } else {
                const pict = lst[0];
                console.log("200: Picture found");
                res.status(200).send(pict);
            }
        }
    });
});

module.exports = router;