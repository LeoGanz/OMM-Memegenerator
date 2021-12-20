let express = require('express');
let router = express.Router();
const mongoose = require("mongoose");
const mongoDB = 'mongodb://localhost:27017';
const userSchema = require("../models/userSchema");
let utils = require("../utils");
let ut = new utils();

/* GET users in DB. */
router.get('/', function (req, res, next) {
    mongoose.connect(mongoDB).then(() => {
        const db = mongoose.connection;
        db.on('error', console.error.bind(console, 'MongoDB connection error:'));
        console.log('db connection initiated');
        userSchema.find({}, (err, lst) => {
            if (err) {
                console.log("not found");
                res.status(500).send("Some problem with the database");
            } else {
                console.log("found");
                res.send(lst);
            }
        });
    }).catch((err) => {
        if (err){
            console.log(err);
        console.log("503: Connection to db failed");
        res.status(503).send("Connection to db failed");
        return;
        }
    });
});

module.exports = router;
