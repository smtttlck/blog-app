import * as api from "../api/Api";

// comment service functions for fetching comments of a blog post
export const getComments = async (blogId: string, token: string) => {
    return api.fetchData(`getComment/${blogId}`, token, null, null);
}

// comment service functions for adding a comment to a blog post
export const addComment = async (token: string, userId: string, blogId: string, text: string) => {
    return api.fetchData('postComment', token, {
        userId,
        blogId,
        text
    }, null);
}