const mongoose = require("mongoose");
const pictureSchema = require("./pictureSchema");
const commentSchema = require("./commentSchema");

const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: String,
    fullName: String,
    password: String,
    currentToken: String,
    email: String,
    //accounts: ...
    dateOfCreation: String,
    lastEdited: [pictureSchema],
    lastComments: [commentSchema],
});

module.exports.default = mongoose.model("user", userSchema);
module.exports = userSchema;