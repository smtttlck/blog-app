import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import IBlog, { IComment } from "../types/BlogTypes";
import * as blogService from "../services/blogService";
import * as commentService from "../services/commentService";
import { getUserIdFromToken } from "../utils/helperFuncs";

interface IUseBlogPageParams {
    token: string;
    userId: string;
}

const useBlogPage = ({ token, userId }: IUseBlogPageParams) => {
    const resolvedUserId = userId || getUserIdFromToken(token);

    const { id } = useParams<string>(); // get the blog ID from the URL parameters

    // state variables for the blog, comments, and other blogs by the same author
    const [blog, setBlog] = useState<IBlog | null>(null);
    const [otherBlogs, setOtherBlogs] = useState<IBlog[] | null>(null);
    const [comments, setComments] = useState<IComment[] | null>(null);
    const [newComment, setNewComment] = useState<boolean>(false);

    useEffect(() => {

        if (!id) { // if no ID is provided, do not attempt to fetch data
            return;
        }

        let isMounted = true;

        // fetch the blog data by ID, and if the blog has an author, fetch other blogs by the same author
        blogService.getBlogById(token, id)
            .then(async (data) => {
                if (!isMounted) {
                    return;
                }

                setBlog(data);

                if (data.authorId && typeof data.authorId !== "string") {
                    const otherBlogsData = await blogService.getBlogsWithExclude(token, data.authorId._id, id, "latest", resolvedUserId, 3);

                    if (isMounted) {
                        setOtherBlogs(otherBlogsData.filter((otherBlog) => otherBlog._id !== id));
                    }
                } else if (isMounted) {
                    setOtherBlogs([]);
                }

                window.scrollTo(0, 0);
                document.title = data.title;
            });

        return () => {
            isMounted = false;
        };
    }, [id, resolvedUserId, token]);

    // fetch comments for the blog when the blog ID, newComment state, or token changes
    useEffect(() => {
        if (!id) {
            return;
        }

        let isMounted = true;

        commentService.getComments(id, token)
            .then((data: IComment[]) => {
                if (isMounted) {
                    setComments(data);
                }
            });

        return () => {
            isMounted = false;
        };
    }, [id, newComment, token]);

    // compute the target URL for other blogs by the same author, based on the blog's author ID
    const otherBlogsTargetUrl = useMemo(() => {
        if (!blog || typeof blog.authorId === "string") {
            return "";
        }

        return `/user/${blog.authorId._id}`;
    }, [blog]);

    return {
        blog,
        comments,
        newComment,
        otherBlogs,
        otherBlogsTargetUrl,
        setNewComment,
    };
};

export default useBlogPage;