const mongoose = require("mongoose");
const Picture = require("./picture");
const Comment = require("./comment");

const Schema = mongoose.Schema;

const UserSchema = new Schema(
    {
        username: String,
        fullName: String,
        password: String,
        currentToken: String,
        email: String,
        //accounts: ...
        dateOfCreation: String,
        lastEdited: [Picture],
        lastComments: [Comment],

    }
);

module.exports.default = mongoose.model('user', UserSchema);
module.exporst = UserSchema;