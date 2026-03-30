import { useRef, useState } from "react";
import * as blogService from "../services/blogService";

interface IUseShowBlogParams {
    token: string;
    blogId: string;
    defaultTitle: string;
    defaultText: string;
}

type ShowOperation = "edit" | "show";

const useShowBlog = ({ blogId, defaultText, defaultTitle, token }: IUseShowBlogParams) => {

    // state variable to keep track of whether the blog is in "show" mode or "edit" mode, and refs for the title and text input fields
    const [operation, setOperation] = useState<ShowOperation>("show");
    const titleRef = useRef<HTMLInputElement>(null);
    const textRef = useRef<HTMLTextAreaElement>(null);

    // function to toggle between "show" and "edit" modes
    const toggleOperation = () => {
        setOperation((prevOperation) => (prevOperation === "show" ? "edit" : "show"));
    };

    // function to handle updating the blog post, which sends the updated title and text to the server and reloads the page on success
    const updateHandler = () => {
        const values = {
            title: titleRef.current?.value || defaultTitle,
            text: textRef.current?.value || defaultText,
        };

        blogService.updateBlog(token, blogId, values)
            .then(() => window.location.reload());
    };

    return {
        operation,
        textRef,
        titleRef,
        toggleOperation,
        updateHandler,
    };
};

export default useShowBlog;