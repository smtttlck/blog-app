import { useCallback, useEffect, useState } from "react";
import * as blogService from "../services/blog.service";
import IBlog from "../types/BlogTypes";

export const useBlogs = (token: string, userId: string, sort: "latest" | "mostBookmarked") => {

    const [blogs, setBlogs] = useState<IBlog[]>([]); // state to hold the fetched blogs

    const refetch = useCallback(async () => {
        if (!token || !userId) return; // if token or userId is not available, do not fetch blogs
        try {
            const newBlogs = await blogService.getBlogs(token, userId, sort); // fetch blogs using the blog service
            setBlogs(newBlogs); // update the state with the fetched blogs
        } catch (error) {
            console.error("Error fetching blogs:", error); // log any errors that occur during fetching
        }
    }, [token, userId, sort]);

    useEffect(() => {
        refetch();
    }, [refetch]); // re-run the effect when token, userId, or sort changes

    return { blogs, refetch }; // return blogs and manual refetch function
};