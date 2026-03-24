import * as api from "../api/api";
import { jwtDecode } from "jwt-decode"; import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../redux/features/user";
import { Provider } from "react-redux";
import LoginForm from "../components/LoginForm";
import { fireEvent, render, waitFor } from "@testing-library/react-native";

// mocks
jest.mock("../api/api");
jest.mock("jwt-decode");

describe('LoginForm Integration Test', () => {

    const mockToken = "mock-token";
    const mockUser = { id: "1", username: "testuser" };

    const createTestStore = () => {
        return configureStore({
            reducer: {
                user: userReducer,
            },
        });

    };

    test('successful login flow', async () => {

        (api.login as jest.Mock).mockResolvedValue({ token: mockToken });
        (jwtDecode as jest.Mock).mockReturnValue({ user: mockUser });

        const store = createTestStore();

        const { getByTestId } = render(
            <Provider store={store}>
                <LoginForm />
            </Provider>
        );

        fireEvent.changeText(getByTestId('username-input'), 'testuser'); // Simulate entering username
        fireEvent.changeText(getByTestId('password-input'), 'testpassword'); // Simulate entering password
        fireEvent.press(getByTestId('submit-button')); // Simulate pressing the login button

        await waitFor(() => {
            const state = store.getState();
            expect(state.user.token).toBe(mockToken); // Check if token is stored in the state
            expect(state.user.user).toEqual(mockUser); // Check if user info is stored in the state
        });
    });

    test('failed login shows modal', async () => {

        (api.login as jest.Mock).mockRejectedValue(new Error("Invalid credentials"));

        const store = createTestStore();

        const { getByTestId, getByText } = render(
            <Provider store={store}>
                <LoginForm />
            </Provider>
        );

        fireEvent.changeText(getByTestId('username-input'), 'testuser'); // Simulate entering username
        fireEvent.changeText(getByTestId('password-input'), 'wrongpassword'); // Simulate entering wrong password
        fireEvent.press(getByTestId('submit-button')); // Simulate pressing the login button

        (api.login as jest.Mock).mockRejectedValue({
            response: {
                data: {
                    message: "Invalid credentials",
                },
            },
        });

        await waitFor(async () => {
            const errorText = await getByText(/Login Failed:/); // Check if the modal with the error message is displayed
            expect(errorText).toBeTruthy();
        });
    });
});