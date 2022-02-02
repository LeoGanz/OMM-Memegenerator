const mongoose = require("mongoose");

const Schema = mongoose.Schema;

/**
 * This schema describes how the use is defined
 * @type {module:mongoose.Schema<any, Model<any, any, any, any>, any, any>}
 */

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