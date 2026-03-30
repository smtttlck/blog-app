import { Field, Formik, Form as FormikForm } from "formik";
import React from "react";
import { PiPencilLineBold as Logo } from "react-icons/pi";
import useAuthForm from "../hooks/useAuthForm";

const Form: React.FC = () => {
    const {
        clearErrors,
        errors,
        form,
        handleSubmit,
        loginInitialValues,
        registerInitialValues,
        setForm,
    } = useAuthForm();

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
                    onSubmit={handleSubmit}
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
                            onClick={clearErrors}
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