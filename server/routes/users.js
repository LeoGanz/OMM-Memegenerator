let express = require('express');
let router = express.Router();
const userSchema = require("../models/userSchema");

/* GET users in DB. */
router.get('/', function (req, res) {
    userSchema.find({}, (err, lst) => {
        if (err) {
            res.status(500).send("Some problem with the database");
        } else {
            res.send(lst);
        }
    });
});

module.exports = router;
