import mongoose, { Schema } from "mongoose";
import { IBookmark } from "../types/models/bookmarkTypes";

const bookmarkSchema: mongoose.Schema = new mongoose.Schema({ // bookmark model
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
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model<IBookmark>('Bookmark', bookmarkSchema);