import mongoose from "mongoose";
import UserSchema from "./userSchema";

const Schema = mongoose.Schema;

const CommentSchema = new Schema(
    {
        dateOfCreation: String,
        creator: UserSchema,
        text: String,
    }
);

export default mongoose.model('user', CommentSchema);