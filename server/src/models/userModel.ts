import mongoose from "mongoose";
import { IUser } from "../types/models/userTypes";

const userSchema: mongoose.Schema = new mongoose.Schema({ // user model
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    picture_path: {
        type: String
    }
});

export default mongoose.model<IUser>('User', userSchema);