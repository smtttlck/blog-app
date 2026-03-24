import { fireEvent, render, waitFor } from "@testing-library/react-native";
import LoginForm from "../components/LoginForm";
import { colors } from "../constants/color";

// mock hooks
let mockIsLogin = true;
const mockSetIsLogin = jest.fn();
const mockSetUsername = jest.fn();
const mockSetPassword = jest.fn();
const mockSetEmail = jest.fn();
const mockSetShowPassword = jest.fn();
const mockSetRememberMe = jest.fn();
const mockHandleLogin = jest.fn();
const mockHandleSignUp = jest.fn();
const mockSetModalVisible = jest.fn();

jest.mock('../hooks/useLoginForm', () => ({
    useLoginForm: () => ({
        loading: false,
        isLogin: mockIsLogin,
        setIsLogin: (value: boolean) => {
            mockSetIsLogin(value);
            mockIsLogin = value;
        },
        username: '',
        setUsername: mockSetUsername,
        password: '',
        setPassword: mockSetPassword,
        email: '',
        setEmail: mockSetEmail,
        showPassword: false,
        setShowPassword: mockSetShowPassword,
        rememberMe: false,
        setRememberMe: mockSetRememberMe,
        modalVisible: false,
        setModalVisible: mockSetModalVisible,
        modalMessage: '',
        handleLogin: mockHandleLogin,
        handleSignUp: mockHandleSignUp,
    }),
}));

describe('LoginForm Component', () => {

    beforeEach(() => {
        mockIsLogin = true;
        jest.clearAllMocks();
    });

    test('renders login form correctly for login', () => {

        const { getByText, getByTestId, getAllByText } = render(<LoginForm />);

        expect(getAllByText('Login').length).toBeGreaterThan(0); // Check if Login option is rendered
        expect(getAllByText('Login')[0]).toHaveStyle({ backgroundColor: colors.black, color: colors.white }); // Check if Login option is active
        expect(getByText('Sign Up')).toBeTruthy(); // Check if Sign Up option is rendered
        expect(getByText('Sign Up')).toHaveStyle({ backgroundColor: colors.white }); // Check if Sign Up option is inactive
        expect(getByText('Username')).toBeTruthy(); // Check if Username input is rendered
        expect(getByText('Password')).toBeTruthy(); // Check if Password input is rendered
        expect(() => getByText('Email')).toThrow(); // Check if Email input is not rendered
        expect(getByText('Remember Me')).toBeTruthy(); // Check if Remember Me option is rendered
        expect(getByTestId('submit-button')).toHaveTextContent('Login'); // Check if submit button has correct text for login
    });

    test('renders login form correctly for sign up', () => {

        const { getByText, getByTestId, getAllByText, rerender } = render(<LoginForm />);

        const signUpOption = getByText('Sign Up');
        fireEvent.press(signUpOption); // Simulate pressing the Sign Up option

        expect(mockSetIsLogin).toHaveBeenCalledWith(false); // Check if setIsLogin was called with false to switch to Sign Up mode

        rerender(<LoginForm />);

        expect(getByText('Login')).toBeTruthy(); // Check if Login option is rendered
        expect(getByText('Login')).toHaveStyle({ backgroundColor: colors.white }); // Check if Login option is inactive
        expect(getAllByText('Sign Up').length).toBeGreaterThan(0); // Check if Sign Up option is rendered
        expect(getAllByText('Sign Up')[0]).toHaveStyle({ backgroundColor: colors.black, color: colors.white }); // Check if Sign Up option is active
        expect(getByText('Username')).toBeTruthy(); // Check if Username input is rendered
        expect(getByText('Email')).toBeTruthy(); // Check if Email input is rendered
        expect(getByText('Password')).toBeTruthy(); // Check if Password input is rendered
        expect(() => getByText('Remember Me')).toThrow(); // Check if Remember Me option is not rendered
        expect(getByTestId('submit-button')).toHaveTextContent('Sign Up'); // Check if submit button has correct text for sign up
    });

    test('calls setUsername, setPassword and setEmail on input change', () => {

        const { getByText, getByTestId, rerender } = render(<LoginForm />);

        const signUpOption = getByText('Sign Up');
        fireEvent.press(signUpOption); // Simulate pressing the Sign Up option

        expect(mockSetIsLogin).toHaveBeenCalledWith(false);

        rerender(<LoginForm />);


        const usernameInput = getByTestId('username-input');
        const passwordInput = getByTestId('password-input');
        const emailInput = getByTestId('email-input');

        fireEvent.changeText(usernameInput, 'testuser'); // Simulate changing username input
        fireEvent.changeText(passwordInput, 'password123'); // Simulate changing password input
        fireEvent.changeText(emailInput, 'test@example.com'); // Simulate changing email input

        expect(mockSetUsername).toHaveBeenCalledWith('testuser'); // Check if setUsername was called with the new username
        expect(mockSetPassword).toHaveBeenCalledWith('password123'); // Check if setPassword was called with the new password
        expect(mockSetEmail).toHaveBeenCalledWith('test@example.com'); // Check if setEmail was called with the new email
    });

    test('toggles password visibility when eye icon is pressed', () => {

        const { getByTestId } = render(<LoginForm />);

        const togglePasswordButton = getByTestId('toggle-password-visibility');
        fireEvent.press(togglePasswordButton); // Simulate pressing the eye icon

        expect(mockSetShowPassword).toHaveBeenCalledWith(true); // Check if setShowPassword was called with true to show the password
    });

    test('calls handleLogin when submit button is pressed in login mode', () => {

        const { getByTestId } = render(<LoginForm />);

        const submitButton = getByTestId('submit-button');
        fireEvent.press(submitButton); // Simulate pressing the submit button

        expect(mockHandleLogin).toHaveBeenCalled(); // Check if handleLogin was called
    });

    test('calls handleSignUp when submit button is pressed in sign up mode', () => {

        const { getByText, getByTestId, rerender } = render(<LoginForm />);

        const signUpOption = getByText('Sign Up');
        fireEvent.press(signUpOption); // Simulate pressing the Sign Up option

        expect(mockSetIsLogin).toHaveBeenCalledWith(false);

        rerender(<LoginForm />);

        const submitButton = getByTestId('submit-button');
        fireEvent.press(submitButton); // Simulate pressing the submit button
        expect(mockHandleSignUp).toHaveBeenCalled(); // Check if handleSignUp was called
    });
});