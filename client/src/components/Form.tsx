import { Field, Formik, Form as FormikForm } from "formik";
import React, { useState } from "react";
import { PiPencilLineBold as Logo } from "react-icons/pi";
import { ILoginValues, IRegisterValues } from "../types/LoginTypes";
import * as api from "../api/Api";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import IUser from "../types/UserTypes";
import { jwtDecode } from "jwt-decode";
import { login } from "../redux/features/user";

const Form: React.FC = () => {

    const navigate = useNavigate();

    const user = useSelector((state: any) => state.user);
    const dispatch = useDispatch();

    interface IToken {
        user: IUser;
        exp: number;
    }

    const [form, setForm] = useState<"login" | "register">("login");
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const loginInitialValues: ILoginValues = {
        username: '',
        password: ''
    }

    const registerInitialValues: IRegisterValues = {
        username: '',
        email: '',
        password: ''
    }

    return (
        <div className="form d-flex flex-column align-items-center mt-5 border rounded">
            <span className="logo">
                <Logo />
            </span>
            <div className="form-header d-flex">
                <h5
                    className="form-selector"
                    onClick={() => setForm("login")}
                >
                    Sign In
                </h5>
                <h5 className="mx-2">  |  </h5>
                <h5
                    className="form-selector"
                    onClick={() => setForm("register")}
                >
                    Sign Up
                </h5>
            </div>
            <div className="form-inputs w-100">
                <Formik
                    initialValues={(form === "login") ? loginInitialValues : registerInitialValues}
                    onSubmit={async (values: ILoginValues | IRegisterValues) => {
                        if (form === "register") { // register
                            try {
                                await api.register(values as IRegisterValues);
                            } catch (err: any) {
                                const errorMessage: string = err.response?.data?.message;
                                if (errorMessage === "This username is already registered" || errorMessage === "This email is already registered") {
                                    const inputName: string = errorMessage.split(' ')[1];
                                    setErrors({ ...errors, [inputName]: errorMessage });
                                }
                            }
                        }
                        try { // login
                            const result: any = await api.login({ username: values.username, password: values.password } as ILoginValues);
                            if (result.token) {
                                const token: IToken = jwtDecode<IToken>(result.token as string);
                                dispatch(login({ user: token.user, token: result.token }));
                                navigate("/");
                            }
                        } catch (err: any) {
                            const errorMessage: string = err.response?.data?.message;
                            if (errorMessage === "Username or password not valid")
                                setErrors({ ["username"]: "Username or password not valid", ["password"]: "Username or password not valid" });
                        }
                    }}
                >
                    <FormikForm>
                        {(form === "login") ? (
                            Object.keys(loginInitialValues).map((field: string) => (
                                <div key={`login-${field}`} className="form-input form-floating w-75 my-3 mx-auto">
                                    <Field
                                        id={field} className="form-control"
                                        name={field} placeholder=""
                                        type={(field === "password" || field === "email") ? field : "text"}
                                    />
                                    <label htmlFor={field}>{field}</label>
                                    {errors[field] && <div id={`${form}-${field}-help`} className="form-text">{errors[field]}</div>}
                                </div>
                            ))
                        ) : (
                            Object.keys(registerInitialValues).map((field: string) => (
                                <div key={`register-${field}`} className="form-input form-floating w-75 my-3 mx-auto">
                                    <Field
                                        id={field} className="form-control"
                                        name={field} placeholder=""
                                        type={(field === "password" || field === "email") ? field : "text"}
                                    />
                                    <label htmlFor={field}>{field}</label>
                                    {errors[field] && <div id={`${form}-${field}-help`} className="form-text">{errors[field]}</div>}
                                </div>
                            ))
                        )

                        }
                        <button
                            className="btn btn-dark d-block w-50 my-3 mx-auto"
                            type="submit"
                            onClick={() => setErrors({})}
                        >
                            Submit
                        </button>

                    </FormikForm>
                </Formik>
            </div>

        </div>
    )
}

export default Form