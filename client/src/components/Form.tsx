import { Field, Formik, Form as FormikForm } from "formik";
import { useState } from "react";
import { PiPencilLineBold as Logo } from "react-icons/pi";
import { ILoginValues, IRegisterValues } from "../types/LoginTypes";
import * as api from "../api/Api";
import { useNavigate } from "react-router-dom";

const Form = () => {

    const navigate = useNavigate();

    const [form, setForm] = useState<"login" | "register">("login");

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
        <div className="form d-flex flex-column justify-content-center align-items-center mt-5 border rounded">
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
                        if(form === "login") {
                            const result: any = await api.login(values as ILoginValues);
                            if(result.token) {
                                localStorage.setItem("authToken", result.token);
                                navigate("/");
                            }
                        }
                        else {
                            const result = await api.register(values as IRegisterValues);
                            console.log("register", result)
                        }
                    }}
                >
                    <FormikForm>
                        {(form === "login") ? (
                            Object.keys(loginInitialValues).map((field: string) => (
                                <div key={`login-${field}`} className="form-input form-floating w-75 my-3 mx-auto">
                                    <Field id={field} className="form-control" name={field} placeholder="" />
                                    <label htmlFor={field}>{field}</label>
                                </div>
                            ))
                        ) : (
                            Object.keys(registerInitialValues).map((field: string) => (
                                <div key={`register-${field}`} className="form-input form-floating w-75 my-3 mx-auto">
                                    <Field id={field} className="form-control" name={field} placeholder="" />
                                    <label htmlFor={field}>{field}</label>
                                </div>
                            ))
                        )
                        }

                        <button className="btn btn-dark mb-3" type="submit">Submit</button>

                    </FormikForm>
                </Formik>
            </div>
        </div>
    )
}

export default Form