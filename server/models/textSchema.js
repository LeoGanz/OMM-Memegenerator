const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const textSchema = new Schema({
    text: String,
    xCoordinate: Number,
    yCoordinate: Number,
    xSize: Number,
    ySize: Number,
    //things addable here
});

module.exports = mongoose.model('text', textSchema);