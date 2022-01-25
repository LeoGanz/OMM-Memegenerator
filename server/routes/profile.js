let express = require('express');
let router = express.Router();
const userSchema = require("../models/userSchema");
const utils = require("../utils");
const ut = new utils();

router.get('/', (req, res) => {
    const token = req.query.token;
    userSchema.find({currentToken: token}, (err, lst) => {
        if (err) {
            console.log("503: Connection to db failed; error: " + err);
            ut.sendIfNotAlready(res, 503, "Connection to db failed");
        } else {
            if (lst.length === 0) {
                console.log("400: Impossible Error: No picture with this metadata found");
                ut.sendIfNotAlready(res, 400, "No picture with this metadata found");
            } else {
                const user = lst[0];
                console.log("200: User found");
                ut.sendIfNotAlready(res, 200, user);
            }
        }
    });
});

module.exports = router;