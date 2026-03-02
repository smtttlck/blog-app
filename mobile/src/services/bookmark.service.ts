import * as api from "../api/api";

// service function to add a bookmark for a blog
export const addBookmark = async (token: string, blogId: string, userId: string): Promise<void> => {
    return api.fetchData(
        "postBookmark",
        token,
        null,
        {
            blogId,
            userId
        }
    );
}

// service function to delete a bookmark for a blog
export const deleteBookmark = async (token: string, blogId: string, userId: string): Promise<void> => {
    return api.fetchData(
        "deleteBookmark",
        token,
        null,
        {
            blogId,
            userId
        }
    );
}