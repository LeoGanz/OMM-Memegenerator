const mongoose = require("mongoose");

const Schema = mongoose.Schema;

/**
 * This schema describes one text on a meme
 * @type {module:mongoose.Schema<any, Model<any, any, any, any>, any, any>}
 */

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