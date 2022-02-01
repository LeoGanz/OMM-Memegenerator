const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: String,
    fullName: String,
    password: String,
    currentToken: String,
    email: String,
    //accounts: ...
    dateOfCreation: String,
    lastEdited: [{type: Schema.Types.ObjectId, ref: 'meme'}],
    lastComments: [{type: Schema.Types.ObjectId, ref: 'comment'}],
});

module.exports = mongoose.model("user", userSchema);