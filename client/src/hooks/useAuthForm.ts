import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import * as api from "../api/Api";
import { login } from "../redux/features/user";
import { ILoginValues, IRegisterValues } from "../types/LoginTypes";
import IUser from "../types/UserTypes";

type AuthFormMode = "login" | "register";

interface IToken {
    user: IUser;
    exp: number;
}

type AuthErrors = Record<string, string>;

// helper function to extract error message from API response
const getApiErrorMessage = (error: unknown): string | undefined => {
    return (error as { response?: { data?: { message?: string } } })
        .response?.data?.message;
};

// custom hook to manage authentication form state and logic for both login and registration
const useAuthForm = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [form, setForm] = useState<AuthFormMode>("login");
    const [errors, setErrors] = useState<AuthErrors>({});

    const loginInitialValues: ILoginValues = {
        username: "",
        password: "",
    };

    const registerInitialValues: IRegisterValues = {
        username: "",
        email: "",
        password: "",
    };

    const clearErrors = () => {
        setErrors({});
    };

    // handle form submission for both login and registration, making API calls and handling responses/errors accordingly
    const handleSubmit = async (values: ILoginValues | IRegisterValues) => {
        if (form === "register") {
            try {
                await api.register(values as IRegisterValues);
                localStorage.setItem("newUser", "true");
            } catch (error) {
                const errorMessage = getApiErrorMessage(error);

                if (
                    errorMessage === "This username is already registered"
                    || errorMessage === "This email is already registered"
                ) {
                    const inputName = errorMessage.split(" ")[1];
                    setErrors((prevErrors) => ({ ...prevErrors, [inputName]: errorMessage }));
                }
            }
        }

        try {
            const result = await api.login({
                username: values.username,
                password: values.password,
            } as ILoginValues);

            if (result.token) {
                const token = jwtDecode<IToken>(result.token as string);
                dispatch(login({ user: token.user, token: result.token }));
                navigate("/");
            }
        } catch (error) {
            const errorMessage = getApiErrorMessage(error);

            if (errorMessage === "Username or password not valid") {
                setErrors({
                    username: "Username or password not valid",
                    password: "Username or password not valid",
                });
            }
        }
    };

    return {
        clearErrors,
        errors,
        form,
        handleSubmit,
        loginInitialValues,
        registerInitialValues,
        setForm,
    };
};

export default useAuthForm;