import { Document, Types } from "mongoose";

export interface IBookmark extends Document {
    userId: Types.ObjectId;
    blogId: Types.ObjectId;
    createdAt: Date;
}