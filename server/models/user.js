import mongoose from "mongoose";
import Picture from "./picture";
import Comment from "./comment";

const Schema = mongoose.Schema;

const User = new Schema(
    {
        username: String,
        fullName: String,
        password: String,
        email: String,
        //accounts: ...
        dateOfCreation: String,
        lastEdited: [Picture],
        lastComments: [Comment],
    }
);

export default mongoose.model('user', User);