import * as api from "../api/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { configureStore } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";
import userReducer, { autoLoginThunk, loginThunk, logoutThunk, signupThunk } from "../redux/features/user";

// Mock the API functions
jest.mock("../api/api");
jest.mock("@react-native-async-storage/async-storage");
jest.mock("jwt-decode");

describe("User Slice", () => {

    const createTestStorage = () => { // Create a mock storage for testing
        return configureStore({
            reducer: {
                user: userReducer // Mock user reducer
            },
        });
    };

    type AppStore = ReturnType<typeof createTestStorage>; // Define type for the store

    let store: AppStore; // Declare store variable
    const mockToken = "mock-jwt-token"; // Mock JWT token
    const mockUser = { id: "user1", username: "testuser" }; // Mock user data

    beforeEach(() => {
        jest.clearAllMocks(); // Clear mocks before each test
        store = createTestStorage(); // Create an isolated store for each test
    });

    test("should handle login successfully", async () => {

        (api.login as jest.Mock).mockResolvedValue({ token: mockToken }); // Mock API login response
        (jwtDecode as jest.Mock).mockReturnValue({ user: mockUser }); // Mock JWT decode response

        await store.dispatch(loginThunk({ username: "testuser", password: "password", rememberMe: false })); // Dispatch login thunk

        const state = store.getState().user; // Get user state

        expect(state.token).toBe(mockToken); // Assert token is set
        expect(state.user).toEqual(mockUser); // Assert user data is set
        expect(state.loading).toBe(false); // Assert loading is false
        expect(state.error).toBe(null); // Assert error is null
    });

    test("should handle login failure", async () => {

        const mockError = "Invalid credentials"; // Mock error message

        (api.login as jest.Mock).mockRejectedValue({ response: { data: { message: mockError } } }); // Mock API login failure

        await store.dispatch(loginThunk({ username: "testuser", password: "wrongpassword", rememberMe: false })); // Dispatch login thunk with wrong credentials

        const state = store.getState().user;

        expect(state.token).toBe(null); // Assert token is null
        expect(state.user).toBe(null); // Assert user is null
        expect(state.loading).toBe(false); // Assert loading is false
        expect(state.error).toBe(mockError); // Assert error message is set
        expect(AsyncStorage.setItem).not.toHaveBeenCalled(); // Assert token is not stored in AsyncStorage
    });

    test("should store token in AsyncStorage when rememberMe is true", async () => {

        (api.login as jest.Mock).mockResolvedValue({ token: mockToken }); // Mock API login response
        (jwtDecode as jest.Mock).mockReturnValue({ user: mockUser }); // Mock JWT decode response

        await store.dispatch(loginThunk({ username: "testuser", password: "password", rememberMe: true })); // Dispatch login thunk with rememberMe true

        expect(AsyncStorage.setItem).toHaveBeenCalledWith("userToken", mockToken); // Assert token is stored in AsyncStorage
    });

    test("autoLoginThunk should retrieve token from AsyncStorage and decode it", async () => {

        (AsyncStorage.getItem as jest.Mock).mockResolvedValue(mockToken); // Mock AsyncStorage getItem to return mock token
        (jwtDecode as jest.Mock).mockReturnValue({ user: mockUser }); // Mock JWT decode response

        const result = await store.dispatch(autoLoginThunk()).unwrap(); // Dispatch autoLogin thunk

        expect(AsyncStorage.getItem).toHaveBeenCalledWith("userToken"); // Assert AsyncStorage getItem is called with correct key
        expect(jwtDecode).toHaveBeenCalledWith(mockToken); // Assert JWT decode is called with the token
        expect(result).toEqual({ token: mockToken, user: mockUser }); // Assert result contains token and user data
    });

    test("autoLoginThunk should handle case when no token is found", async () => {

        (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null); // Mock AsyncStorage getItem to return null

        const result = await store.dispatch(autoLoginThunk()).unwrap().catch((err) => err); // Dispatch autoLogin thunk and catch error

        expect(AsyncStorage.getItem).toHaveBeenCalledWith("userToken"); // Assert AsyncStorage getItem is called with correct key
        expect(result).toBe("No token found"); // Assert error message is returned when no token is found
    });

    test("logout should clear token from state and AsyncStorage", async () => {

        (api.login as jest.Mock).mockResolvedValue({ token: mockToken }); // Mock API login response
        (jwtDecode as jest.Mock).mockReturnValue({ user: mockUser }); // Mock JWT decode response

        await store.dispatch(loginThunk({ username: "testuser", password: "password", rememberMe: true })); // Dispatch login thunk with rememberMe true
        await store.dispatch(logoutThunk()); // Dispatch logout thunk

        const state = store.getState().user;

        expect(state.token).toBe(null); // Assert token is cleared from state
        expect(state.user).toEqual(mockUser); // Current reducer keeps user data on logout
        expect(AsyncStorage.removeItem).toHaveBeenCalledWith("userToken"); // Assert token is removed from AsyncStorage
    });

    test("signupThunk should call register API and then login", async () => {

        const mockRegisterResponse = { message: "User registered successfully" };

        (api.register as jest.Mock).mockResolvedValue(mockRegisterResponse); // Mock API register response
        (api.login as jest.Mock).mockResolvedValue({ token: mockToken }); // Mock API login response
        (jwtDecode as jest.Mock).mockReturnValue({ user: mockUser }); // Mock JWT decode response

        const result = await store.dispatch(signupThunk({ username: "newuser", email: "newuser@example.com", password: "password" })).unwrap(); // Dispatch signup thunk

        expect(api.register).toHaveBeenCalledWith({ username: "newuser", email: "newuser@example.com", password: "password" }); // Assert register API is called
        expect(api.login).toHaveBeenCalledWith({ username: "newuser", password: "password" }); // Assert login API is called after registration
        expect(result).toEqual({ token: mockToken, user: mockUser }); // Assert result contains token and user data
        expect(AsyncStorage.setItem).toHaveBeenCalledWith("userToken", mockToken); // Assert token is stored in AsyncStorage
    });
});
