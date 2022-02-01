const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const textSchema = new Schema({
    text: String,
    xCoordinate: Number,
    yCoordinate: Number,
    // distorted text possible with xSize and ySize
    // xSize: Number,
    // ySize: Number,
    fontSize: Number, // in px
    color: String // CSS color string
    //things addable here
});

module.exports = mongoose.model('text', textSchema);