import { useDispatch, useSelector } from "react-redux";
import { loginThunk, signupThunk } from "../redux/features/user";
import { useLoginForm } from "../hooks/useLoginForm";
import { renderHook } from "@testing-library/react-native";
import { act } from "react";


jest.mock("react-redux", () => ({
    useDispatch: jest.fn(),
    useSelector: jest.fn(),
}));

jest.mock("../redux/features/user", () => ({
    loginThunk: jest.fn(),
    signupThunk: jest.fn(),
}));

describe('useLoginForm Hook', () => {

    const mockDispatch = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();

        (loginThunk as unknown as jest.Mock).mockImplementation((payload) => ({
            type: 'loginThunk',
            payload,
        }));

        (signupThunk as unknown as jest.Mock).mockImplementation((payload) => ({
            type: 'signupThunk',
            payload,
        }));

        mockDispatch.mockImplementation((action) => {
            if (action?.type === 'signupThunk') {
                return {
                    unwrap: () => Promise.resolve({}),
                };
            }

            return Promise.resolve({});
        });

        (useDispatch as unknown as jest.Mock).mockReturnValue(mockDispatch);
        (useSelector as unknown as jest.Mock).mockImplementation((selectorFn) =>
            selectorFn({
                user: {
                    loading: false,
                    error: null,
                    token: "mock-token",
                },
            })
        );
    });

    test('initializes with default state values', () => {

        const { result } = renderHook(() => useLoginForm());

        expect(result.current.isLogin).toBe(true); // Check if isLogin is initialized to true
        expect(result.current.username).toBe(''); // Check if username is initialized to an empty string
        expect(result.current.password).toBe(''); // Check if password is initialized to an empty string
        expect(result.current.email).toBe(''); // Check if email is initialized to an empty string
        expect(result.current.showPassword).toBe(false); // Check if showPassword is initialized to false
        expect(result.current.rememberMe).toBe(false); // Check if rememberMe is initialized to false
        expect(result.current.modalVisible).toBe(false); // Check if modalVisible is initialized to false
        expect(result.current.modalMessage).toBe(''); // Check if modalMessage is initialized to an empty string
    });

    test('handleLogin dispatches loginThunk', async () => {

        const { result } = renderHook(() => useLoginForm());

        act(() => {
            result.current.setUsername('testuser');
            result.current.setPassword('testpassword');
        });

        await act(async () => {
            await result.current.handleLogin();
        });

        expect(loginThunk).toHaveBeenCalledWith({
            username: 'testuser',
            password: 'testpassword',
            rememberMe: false,
        }); // Check if loginThunk was dispatched with the correct arguments
    });

    test('shows modal when login fails (no token)', async () => {

        (useSelector as unknown as jest.Mock).mockImplementation((selectorFn) =>
            selectorFn({
                user: {
                    loading: false,
                    error: 'Invalid credentials',
                    token: null,
                },
            })
        );

        const { result } = renderHook(() => useLoginForm());

        act(() => {
            result.current.setUsername('testuser');
            result.current.setPassword('wrongpassword');
        });

        await act(async () => {
            await result.current.handleLogin();
        });

        expect(result.current.modalVisible).toBe(true); // Check if modalVisible is set to true
        expect(result.current.modalMessage).toContain('Login Failed'); // Check if modalMessage contains 'Login Failed'
        expect(result.current.modalMessage).toContain('Invalid credentials'); // Check if modalMessage contains the error message from the state
    });

    test('handleSignUp dispatches signupThunk', async () => {

        const { result } = renderHook(() => useLoginForm());

        act(() => {
            result.current.setIsLogin(false);
            result.current.setUsername('newuser');
            result.current.setPassword('newpassword');
            result.current.setEmail('newuser@example.com');
        });

        await act(async () => {
            await result.current.handleSignUp();
        });

        expect(signupThunk).toHaveBeenCalledWith({
            username: 'newuser',
            password: 'newpassword',
            email: 'newuser@example.com',
        }); // Check if signupThunk was dispatched with the correct arguments
    });

    test('shows modal when sign up fails', async () => {

        mockDispatch.mockImplementation((action) => {
            if (action?.type === 'signupThunk') {
                return {
                    unwrap: () => Promise.reject('Sign up error'),
                };
            }
            return Promise.resolve({});
        });

        const { result } = renderHook(() => useLoginForm());

        act(() => {
            result.current.setIsLogin(false);
            result.current.setUsername('newuser');
            result.current.setPassword('newpassword');
            result.current.setEmail('newuser@example.com');
        });

        await act(async () => {
            await result.current.handleSignUp();
        });

        expect(result.current.modalVisible).toBe(true); // Check if modalVisible is set to true
        expect(result.current.modalMessage).toContain('Sign Up Failed'); // Check if modalMessage contains 'Sign Up Failed'
        expect(result.current.modalMessage).toContain('Sign up error'); // Check if modalMessage contains the error message from the state
    });

    test('does not show modal when login succeeds', async () => {

        const { result } = renderHook(() => useLoginForm());

        await act(async () => {
            await result.current.handleLogin();
        });

        expect(result.current.modalVisible).toBe(false); // Check if modalVisible remains false when login succeeds
    });
});