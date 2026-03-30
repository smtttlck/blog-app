import * as api from "../api/Api";

// bookmark service functions for creating bookmarks
export const createBookmark = async (token: string, blogId: string, userId: string): Promise<void> => {
    return api.fetchData("postBookmark", token, { blogId, userId }, null);
}

// bookmark service functions for deleting bookmarks
export const deleteBookmark = async (token: string, blogId: string, userId: string): Promise<void> => {
    return api.fetchData("deleteBookmark", token, { blogId, userId }, null);
}