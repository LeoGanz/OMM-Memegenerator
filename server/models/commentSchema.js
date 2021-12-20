const mongoose = require("mongoose");
const userSchema = require("./userSchema");

const Schema = mongoose.Schema;

const commentSchema = new Schema(
    {
        dateOfCreation: String,
        creator: userSchema,
        text: String,
    }
);

module.exports = commentSchema;
module.exports = mongoose.model('comment', commentSchema);