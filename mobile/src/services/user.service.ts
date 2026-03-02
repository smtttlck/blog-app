import * as api from '../api/api';
import IUser from '../types/UserTypes';
import { UploadImage } from '../types/ImageTypes';

// service function to fetch user information by user ID
export const getUserById = async (token: string, userId: string): Promise<IUser> => {
    return api.fetchData(`getUser/${userId}`, token, null);
};

interface UpdateProfilePayload {
    username?: string;
    email?: string;
    image?: UploadImage | null;
}

export const updateUserProfile = async ( // service function to update the user's profile information
    token: string,
    userId: string,
    payload: UpdateProfilePayload,
) => {
    return api.fetchData('putUser', token, `/${userId}`, payload);
};

export const updateUserPassword = async ( // service function to update the user's password
    token: string,
    userId: string,
    currentPassword: string,
    newPassword: string,
) => {
    return api.fetchData('putUser', token, `/${userId}/password`, {
        currentPassword,
        newPassword,
    });
};
