import mongoose from "mongoose";
import UserSchema from "./userSchema";
import CommentSchema from "./commentSchema";

const Schema = mongoose.Schema;

const PictureSchema = new Schema(
    {
        name: String,
        desc: String,
        img:{
            data: Buffer,
            contentType: String,
        },
        creator: UserSchema,
        dateOfCreation: String,
        upVoters: [UserSchema],
        downVoters: [UserSchema],
        comments: [CommentSchema],
        metadata: String,
        format: {width: Number, height: Number, pixels: Number},
    }
);

export default mongoose.model('picture', PictureSchema);