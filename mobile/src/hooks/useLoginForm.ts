import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../redux/app/store';
import { loginThunk, signupThunk } from '../redux/features/user';

// custom hook to manage the state and logic for the login/signup form, including form fields, loading state, error handling, and modal visibility/message
export const useLoginForm = () => {

    const dispatch = useDispatch<AppDispatch>();
    const { loading, error, token } = useSelector((state: RootState) => state.user);

    // state variables for managing the form fields, form type (login or signup), password visibility, remember me option, and modal visibility/message
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState('');

    // function to handle the login action by dispatching the login thunk and showing a modal with an error message if login fails
    const handleLogin = () => {
        dispatch(loginThunk({ username, password, rememberMe }))
            .then(() => {
                if (!token) {
                    setModalVisible(true);
                    setModalMessage(`Login Failed: \n ${error}`);
                }
            });
    };

    // function to handle the signup action by dispatching the signup thunk and showing a modal with an error message if signup fails
    const handleSignUp = () => {
        dispatch(signupThunk({ username, password, email }))
            .unwrap()
            .catch((err) => {
                setModalVisible(true);
                setModalMessage(`Sign Up Failed: \n ${err}`);
            });
    };

    return {
        loading,
        isLogin,
        setIsLogin,
        username,
        setUsername,
        password,
        setPassword,
        email,
        setEmail,
        showPassword,
        setShowPassword,
        rememberMe,
        setRememberMe,
        modalVisible,
        setModalVisible,
        modalMessage,
        handleLogin,
        handleSignUp,
    };
};
