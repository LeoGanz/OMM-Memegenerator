var express = require('express');
var router = express.Router();
const mongoose = require("mongoose");
const mongoDB = 'mongodb://localhost:27017';
let utils = require("../utils");
let ut = new utils();

/* GET users in DB. */
router.get('/', function (req, res, next) {
    mongoose.connect(mongoDB).then(() => {
        const db = mongoose.connection;
        db.on('error', console.error.bind(console, 'MongoDB connection error:'));
        console.log('db connection initiated');
        let ls = ut.checkInDB(db, "users", {});
        res.send(ls);
    }).catch(() => {
        console.log("503: Connection to db failed");
        res.status(503).send("Connection to db failed");
        return;
    });
});

module.exports = router;
