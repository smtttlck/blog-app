import * as api from "../api/Api";
import IUser from "../types/UserTypes";

// user service functions for fetching user data by ID
export const getUserById = async (token: string, userId: string): Promise<IUser> => {
    return api.fetchData(`getUser/${userId}`, token, null, null);
}

// user service functions for updating user data
export const updateUser = async (token: string, userId: string, data: Partial<IUser> & { image?: File | null }): Promise<void> => {
    return api.fetchData(`putUser/${userId}`, token, data, null);
}