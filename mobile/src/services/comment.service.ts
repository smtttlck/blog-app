import * as api from '../api/api';
import { IComment } from '../types/BlogTypes';

// service function to fetch comments for a specific blog by its ID
export const getCommentsByBlogId = async (token: string, blogId: string): Promise<IComment[]> => {
    return api.fetchData(`getComment/${blogId}`, token, null);
};

// service function to add a new comment to a blog
export const addComment = async (
    token: string,
    userId: string,
    blogId: string,
    text: string,
) => {
    return api.fetchData('postComment', token, null, {
        userId,
        blogId,
        text,
    });
};

// service function to delete a comment from a blog
export const deleteComment = async (
    token: string,
    userId: string,
    blogId: string,
    commentId: string,
) => {
    return api.fetchData('deleteComment', token, null, {
        _id: commentId,
        userId,
        blogId,
    });
};
