import mongoose from "mongoose";
import PictureSchema from "./pictureSchema";
import CommentSchema from "./commentSchema";

const Schema = mongoose.Schema;

const UserSchema = new Schema(
    {
        username: String,
        fullName: String,
        password: String,
        email: String,
        //accounts: ...
        dateOfCreation: String,
        lastEdited: [PictureSchema],
        lastComments: [CommentSchema],
    }
);

export default mongoose.model('user', UserSchema);