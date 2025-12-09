import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { login, register } from "../../api/api";
import { AuthState, ILoginValues, IRegisterValues, LoginResponse } from "../../types/LoginTypes";
import AsyncStorage from "@react-native-async-storage/async-storage";

const initialState: AuthState = { // initial authentication state
  token: null,
  loading: false,
  error: null,
};

export const loginThunk = createAsyncThunk<LoginResponse, ILoginValues>( // async thunk for login
    "user/login",
    async (payload, { rejectWithValue }) => {
        try {
            const data = await login(payload); // call login API
            await AsyncStorage.setItem("userToken", data.token); // store token in async storage
            return data; // return login response data
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || "Login failed");
        }
    }
);

export const signupThunk = createAsyncThunk<LoginResponse, IRegisterValues>( // async thunk for signup
    "user/signup",
    async (payload, { rejectWithValue, dispatch }) => {
        try {
            await register(payload); // call signup API
            const data = await dispatch(
                loginThunk({ username: payload.username, password: payload.password } as ILoginValues))
                .unwrap(); // auto login after signup
            await AsyncStorage.setItem("userToken", data.token); // store token in async storage
            return data; // return login response data
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || "Sign up failed");
        }
    }
);

export const autoLoginThunk = createAsyncThunk<LoginResponse>( // async thunk for auto login
    "user/autoLogin",
    async (_, { rejectWithValue }) => {
        try {
            const token = await AsyncStorage.getItem("userToken"); // get token from async storage
            if (token) {
                return { token }; // return token if exists
            } else {
                return rejectWithValue("No token found");
            }
        } catch (err: any) {
            return rejectWithValue("Auto login failed");
        }
    } 
);

export const logoutThunk = createAsyncThunk( // async thunk for logout
    "user/logout",
    async () => {
        await AsyncStorage.removeItem("userToken"); // remove token from async storage
    }
);

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        logout: (state) => { // logout action
            state.token = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // login thunk cases
            .addCase(loginThunk.pending, (state) => { // login pending
                state.loading = true;
                state.error = null;
            })
            .addCase(loginThunk.fulfilled, (state, action) => { // login fulfilled
                state.loading = false;
                state.token = action.payload.token;
            })
            .addCase(loginThunk.rejected, (state, action) => { // login rejected
                state.loading = false;
                state.error = action.payload as string;
            });
            // signup thunk cases
            builder
            .addCase(signupThunk.pending, (state) => { // signup pending
                state.loading = true;
                state.error = null;
            })
            .addCase(signupThunk.fulfilled, (state, action) => { // signup fulfilled
                state.loading = false;
                state.token = action.payload.token;
            })
            .addCase(signupThunk.rejected, (state, action) => { // signup rejected
                state.loading = false;
                state.error = action.payload as string;
            });            
            // auto login thunk cases
            builder
            .addCase(autoLoginThunk.pending, (state) => { // auto login pending
                state.loading = true;
                state.error = null;
            })
            .addCase(autoLoginThunk.fulfilled, (state, action) => { // auto login fulfilled
                state.loading = false;
                state.token = action.payload.token;
            })
            .addCase(autoLoginThunk.rejected, (state, action) => { // auto login rejected
                state.loading = false;
                state.error = action.payload as string;
            });
            // logout thunk cases
            builder
            .addCase(logoutThunk.fulfilled, (state) => { // logout fulfilled
                state.token = null;
            });
    },
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;