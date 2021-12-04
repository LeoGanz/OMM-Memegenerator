import mongoose from "mongoose";
import User from "./user";

const Schema = mongoose.Schema;

const Comment = new Schema(
    {
        dateOfCreation: String,
        creator: User,
        text: String,
    }
);

export default mongoose.model('user', Comment);