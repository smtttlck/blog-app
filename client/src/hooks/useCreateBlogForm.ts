import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CreateBlogValues } from "../types/BlogTypes";
import * as blogService from "../services/blogService";
import { getUserIdFromToken } from "../utils/helperFuncs";

interface IUseCreateBlogFormParams {
    authorId: string;
    token: string;
}

// custom hook to manage the state and logic for creating a new blog post
const useCreateBlogForm = ({ authorId, token }: IUseCreateBlogFormParams) => {
    const navigate = useNavigate();
    const [image, setImage] = useState<File | null>(null);

    const blogValues: CreateBlogValues = {
        authorId,
        title: "",
        text: "",
        image: null,
    };

    const handleFileChange = (
        event: React.ChangeEvent<HTMLInputElement>,
        setFieldValue: (field: string, value: File | null) => void,
    ) => { // handle file input changes and update the state with the selected image file
        const selectedFile = event.target.files?.[0];

        if (selectedFile) {
            setImage(selectedFile);
            setFieldValue("image", selectedFile);
        }
    };

    // handle form submission by sending the blog data to the server and navigating to the newly created blog post
    const handleSubmit = async (values: CreateBlogValues) => {
        const decodedAuthorId = getUserIdFromToken(token);
        const formAuthorId = typeof values.authorId === "string" ? values.authorId : "";
        const normalizedAuthorId = (authorId || formAuthorId || decodedAuthorId || "").trim();
        const normalizedTitle = (values.title || "").trim();
        const normalizedText = (values.text || "").trim();

        if (!normalizedAuthorId || !normalizedTitle || !normalizedText) {
            throw new Error("Publish failed: authorId, title ve text zorunlu");
        }

        const payload: CreateBlogValues = {
            authorId: normalizedAuthorId,
            title: normalizedTitle,
            text: normalizedText,
            image: values.image,
        };

        await blogService.createBlog(token, payload);
        const blogId = await blogService.getLastBlogIdByAuthor(token, normalizedAuthorId);
        navigate(`/blog/${blogId}`);
    };

    return {
        blogValues,
        handleFileChange,
        handleSubmit,
        image,
    };
};

export default useCreateBlogForm;