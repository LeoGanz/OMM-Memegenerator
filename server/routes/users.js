let express = require('express');
let router = express.Router();
const userSchema = require("../models/userSchema");

/* GET users in DB. */
router.get('/', function (req, res) {
    userSchema.find({}, (err, lst) => {
        if (err) {
            console.log("500: Some problem with the database occurred");
            res.status(500).send("Some problem with the database occurred");
        } else {
            res.send(lst);
        }
    });
});

module.exports = router;
