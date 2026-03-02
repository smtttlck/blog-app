import { useEffect, useState } from "react";
import * as blogService from "../services/blog.service";
import IBlog from "../types/BlogTypes";

export const useBlogs = (token: string, userId: string, sort: "latest" | "mostBookmarked") => {

    const [blogs, setBlogs] = useState<IBlog[]>([]); // state to hold the fetched blogs

    useEffect(() => {
        if (!token || !userId) return; // if token or userId is not available, do not fetch blogs
        const fetchBlogs = async () => { // function to fetch blogs based on the provided token, userId, and sort option
            try {
                const newBlogs = await blogService.getBlogs(token, userId, sort); // fetch blogs using the blog service
                setBlogs(newBlogs); // update the state with the fetched blogs
            } catch (error) {
                console.error("Error fetching blogs:", error); // log any errors that occur during fetching
            }
        };
        fetchBlogs();
    }, [token, userId, sort]); // re-run the effect when token, userId, or sort changes

    return blogs; // return the blogs to be used in the component
};