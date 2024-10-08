import { FiPlusCircle as Plus } from "react-icons/fi";
import { Field, Formik, Form as FormikForm } from "formik";
import IBlog from "../types/BlogTypes";
import { useState } from "react";
import * as api from "../api/Api";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

interface ICreateBlogProps {
    authorId: string;
    token: string;
}

const CreateBlog: React.FC<ICreateBlogProps> = ({ authorId, token }) => {
    
    const user = useSelector((state: any) => state.user);

    const navigate = useNavigate();

    const [image, setImage] = useState<File | null>(null);

    type createBlogType = Omit<IBlog, "_id" | "createdAt" | "updatedAt" | "picture_path"> & { image?: File | null };

    const blogValues: createBlogType = {
        authorId: authorId,
        title: '',
        text: '',
        image: null
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, setFieldValue: (field: string, value: any) => void) => {
        const file = e.target.files?.[0];
        if (file) {
                setImage(file);
                setFieldValue('image', file);
        }
    };

    return (
        <div className="create-blog py-5">
            <Formik
                initialValues={blogValues}
                onSubmit={async (values: createBlogType) => {
                    try {
                        api.fetchData("postBlog", token, values, null)
                        .then(() => {
                            api.fetchData("getBlog/", user.token, null, `?authorId=${user.id}&sort=createdAt&sortType=DESC&limit=1`)
                            .then((data) => navigate(`/blog/${data[0]._id}`))
                        });                        
                    } catch (err) {
                        console.log(err);
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
                                onChange={(e) => handleFileChange(e, setFieldValue)}
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