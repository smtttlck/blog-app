import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import IUser from "../../types/UserTypes";

interface IUserForRedux extends Omit<IUser, "_id"> {
    id: string;
    token: string;
}

const initialState: IUserForRedux = {
    id: '',
    username: '',
    email: '',
    password: '',
    picture_path: '',
    token: ''
}

export const userSlice = createSlice({ // user slice
    name: "user",
    initialState: initialState,
    reducers: { // functions for user
        login: (state, action: PayloadAction<{ user: IUser, token: string}>) => {
            state.id = action.payload.user.id;
            state.username = action.payload.user.username;
            state.email = action.payload.user.email;
            state.password = action.payload.user.password;
            state.picture_path = action.payload.user.picture_path;
            state.token = action.payload.token;
        },
        logout: () => {
            return initialState;
        },
        updatePicturePath: (state, action: PayloadAction<string>) => {
            state.picture_path = action.payload;
        }
    }
});

export const { login, logout, updatePicturePath } = userSlice.actions;

export default userSlice.reducer;