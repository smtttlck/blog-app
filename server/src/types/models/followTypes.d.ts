import { Document, Types } from "mongoose";

export interface IFollow extends Document {
    followerUserId: Types.ObjectId;
    followingUserId: Types.ObjectId;
    createdAt: Date;
}