import mongoose, { Schema } from "mongoose";
import { IComment } from "../types/models/blogTypes";

const commentSchema: mongoose.Schema = new mongoose.Schema({ // comment model
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    blogId: {
        type: Schema.Types.ObjectId,
        ref: 'Blog',
        required: true
    },
    text: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model<IComment>('Comment', commentSchema);