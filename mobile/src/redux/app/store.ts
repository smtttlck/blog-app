import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../features/user";

export const store = configureStore({ // configure redux store
    reducer: {
        user: userReducer, // user authentication slice
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;