import { Document } from "mongoose";

export interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    picture_path?: string;
}

export interface IUserForUpdatePassword {
    currentPassword: string;
    newPassword: string;
}