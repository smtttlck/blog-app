import mongoose, { Schema } from "mongoose";
import { IFollow } from "../types/models/followTypes";

const followSchema: mongoose.Schema = new mongoose.Schema({ // follow model
    followerUserId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    followingUserId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model<IFollow>('Follow', followSchema);