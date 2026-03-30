import { FiPlusCircle as Plus } from "react-icons/fi";
import { Field, Formik, Form as FormikForm } from "formik";
import { CreateBlogValues } from "../types/BlogTypes";
import useCreateBlogForm from "../hooks/useCreateBlogForm";

interface ICreateBlogProps {
    authorId: string;
    token: string;
}

const CreateBlog: React.FC<ICreateBlogProps> = ({ authorId, token }) => {
    const { blogValues, handleFileChange, handleSubmit, image } = useCreateBlogForm({
        authorId,
        token,
    });

    return (
        <div className="create-blog py-5">
            <Formik
                initialValues={blogValues}
                enableReinitialize
                onSubmit={async (values: CreateBlogValues) => {
                    try {
                        await handleSubmit(values);
                    } catch (err: unknown) {
                        const errorMessage = (err as { response?: { data?: { message?: string } } })
                            .response?.data?.message;
                        console.error("Publish failed:", errorMessage || err);
                    }
                }}
            >
                {({ setFieldValue, values }) => (
                    <FormikForm>
                        <div className="form-image">
                            {image && <img className="img-fluids object-fit-scale" src={URL.createObjectURL(image)} />}
                        </div>
                        <div className="form-header d-flex">
                            <div className="img-button my-auto">
                                <label htmlFor="image-upload">
                                    <Plus />
                                </label>
                                <input
                                    id="image-upload"
                                    className="d-none"
                                    name="image"
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleFileChange(e, (field, value) => {
                                        setFieldValue(field, value);
                                    })}
                                />
                            </div>
                            <div className="title-input w-75 mx-3">
                                <Field
                                    id="title" className="form-control border-0"
                                    name="title" placeholder="Title"
                                    type="text"
                                />
                            </div>
                            <button
                                type="submit"
                                className="btn btn-primary px-4 h-25 my-auto ms-auto"
                                disabled={values.title === "" || values.text === ""}
                            >
                                Publish
                            </button>
                        </div>
                        <div className="text-input my-2">
                            <Field
                                id="text" className="form-control border-0"
                                name="text" placeholder="Tell your story..."
                                as={"textarea"} rows={13}
                            />
                        </div>

                    </FormikForm>)}
            </Formik>
        </div>
    )
}

export default CreateBlog