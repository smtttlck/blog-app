import * as api from "../api/api";
import IBlog from "../types/BlogTypes";
import { sortOptionConverter } from "../utils/helpers";
import { UploadImage } from "../types/ImageTypes";

type SortOption = "latest" | "mostBookmarked";
type ProfileBlogType = "blogs" | "bookmarks" | "comments";

// service function to fetch blogs for a user with sorting options
export const getBlogs = async (token: string, userId: string, sort: SortOption): Promise<IBlog[]> => {
    let sortQuery = "";
    if (sort === "latest") {
        sortQuery = "createdAt&sortType=DESC";
    } else if (sort === "mostBookmarked") {
        sortQuery = "bookmarkCounter&sortType=DESC";
    }
    return api.fetchData(
        "getBlog", 
        token, 
        `?sort=${sortQuery}&limit=6&userId=${userId}`
    );
}

interface DiscoverBlogsParams {
    token: string;
    userId: string;
    offset: number;
    searchQuery: string;
    sort?: string;
    onlyBookmarks?: boolean;
}

export const getDiscoverBlogs = async ({ // service function to fetch blogs for the Discover screen with pagination, search, and sorting options
    token,
    userId,
    offset,
    searchQuery,
    sort,
    onlyBookmarks,
}: DiscoverBlogsParams): Promise<IBlog[]> => {
    const query = onlyBookmarks
        ? `?limit=4&offset=${offset}&name=${searchQuery}&onlyBookmarks=true&userId=${userId}`
        : `?limit=4&offset=${offset}&name=${searchQuery}${sort ? `&sort=${sortOptionConverter(sort)}&sortType=DESC` : ''}&userId=${userId}`;

    return api.fetchData('getBlog/', token, query);
};

export const getBlogById = async (token: string, blogId: string): Promise<IBlog> => { // service function to fetch a single blog by its ID
    return api.fetchData(`getBlog/${blogId}`, token, null);
};

export const createBlog = async ( // service function to create a new blog
    token: string,
    userId: string,
    title: string,
    text: string,
    image: UploadImage | null,
) => {
    return api.fetchData('postBlog', token, null, {
        title,
        text,
        authorId: userId,
        image,
    });
};

export const updateBlog = async ( // service function to update an existing blog
    token: string,
    blogId: string,
    title: string,
    text: string,
    image: UploadImage | null,
) => {
    return api.fetchData(`putBlog/${blogId}`, token, null, {
        title,
        text,
        image,
    });
};

export const getBlogCountByUser = async (token: string, userId: string): Promise<number> => { // service function to get the blog count for a user
    return api.fetchData(`getBlog/count/${userId}`, token, null);
};

interface ProfileBlogsParams {
    token: string;
    userId: string;
    offset: number;
    limit?: number;
    blogType: ProfileBlogType;
}

// service function to fetch blogs for the profile screen based on the selected blog type (blogs, bookmarks, or comments) with pagination
export const getProfileBlogs = async ({
    token,
    userId,
    offset,
    limit = 6,
    blogType,
}: ProfileBlogsParams): Promise<IBlog[]> => {
    let query = `?limit=${limit}&offset=${offset}`;

    if (blogType === 'bookmarks') {
        query += `&onlyBookmarks=true&userId=${userId}`;
    } else if (blogType === 'blogs') {
        query += `&authorId=${userId}`;
    } else if (blogType === 'comments') {
        query += `&onlyComments=true&userId=${userId}`;
    }

    return api.fetchData('getBlog/', token, query);
};

// service function to fetch other blogs by the same author while excluding the current blog, sorted by bookmark count in descending order, 
// with a limit on the number of blogs returned
export const getOtherBlogsByAuthor = async (
    token: string,
    authorId: string,
    excludeBlogId: string,
    limit: number = 3,
): Promise<IBlog[]> => {
    const query = `?authorId=${authorId}&excludeBlogId=${excludeBlogId}&sort=bookmarkCounter&sortType=DESC&limit=${limit}`;
    return api.fetchData('getBlog', token, query);
};

export const deleteBlog = async (token: string, blogId: string) => {
    return api.fetchData(`deleteBlog/${blogId}`, token, null, null);
};