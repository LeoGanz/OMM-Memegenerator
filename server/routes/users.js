let express = require('express');
let router = express.Router();
const userSchema = require("../models/userSchema");
const utils = require("../utils");
const ut = new utils();

/* GET users in DB. */
router.get('/', function (req, res) {
    userSchema.find({}, (err, lst) => {
        if (err) {
            ut.respond(res, 500, "Some problem with the database occurred", err);
        } else {
            ut.respond(res, 200, lst);
        }
    });
});

module.exports = router;
