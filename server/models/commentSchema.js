const mongoose = require("mongoose");

const Schema = mongoose.Schema;

/**
 * This schema describes one comment under one meme
 * @type {module:mongoose.Schema<any, Model<any, any, any, any>, any, any>}
 */
const commentSchema = new Schema(
    {
        memeId: String,
        dateOfCreation: String,
        creator: {type: Schema.Types.ObjectId, ref:'user'},
        text: String,
    }
);

module.exports = mongoose.model('comment', commentSchema);