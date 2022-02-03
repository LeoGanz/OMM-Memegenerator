let express = require('express');
let router = express.Router();
const userSchema = require("../models/userSchema");
const {dbConnectionFailureHandler, respond} = require("../utils");

/* GET users in DB. */
router.get('/', function (req, res) {
    userSchema.find({}, (err, lst) => {
        if (err) {
            dbConnectionFailureHandler(res, err)
        } else {
            respond(res, 200, lst);
        }
    });
});

module.exports = router;
