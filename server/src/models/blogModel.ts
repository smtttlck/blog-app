import mongoose from "mongoose";
import { IBlog } from "../types/models/blogTypes";

const blogSchema: mongoose.Schema = new mongoose.Schema({
    authorId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    bookmarkCounter: {
        type: Number,
        default: 0,
        required: true
    },
    commentCounter: {
        type: Number,
        default: 0,
        required: true
    },
    picture_path: {
        type: String
    },
    isBookmarked: {
        type: Boolean
    }
    }, {
    timestamps: true
});

export default mongoose.model<IBlog>('Blog', blogSchema);