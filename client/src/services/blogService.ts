import * as api from "../api/Api";
import IBlog, { ExploreSortField } from "../types/BlogTypes";

// fetch a single blog by its ID
export const getBlogById = async (token: string, blogId: string): Promise<IBlog> => {
    return api.fetchData(`getBlog/${blogId}`, token, null, null);
}

// fetch blogs by a specific author with pagination
export const getBlogsByAuthor = async (token: string, authorId: string, offset: number, viewerUserId?: string, limit: number = 6): Promise<IBlog[]> => {
    const query = `?authorId=${authorId}&offset=${offset}&limit=${limit}${viewerUserId ? `&userId=${viewerUserId}` : ""}`;
    return api.fetchData("getBlog/", token, null, query);
}

// fetch blogs for the home page with sorting and pagination
export const getBlogs = async (token: string, userId: string, sort: "latest" | "mostBookmarked", limit: number = 6): Promise<IBlog[]> => {
    const query = `?userId=${userId}&sort=${sort === "latest" ? "createdAt" : "bookmarkCounter"}&sortType=DESC&limit=${limit}`;
    const data = await api.fetchData("getBlog/", token, null, query);
    return data;
};

// fetch blogs for the explore page with sorting, searching, and pagination
export const createBlog = async (token: string, values: Pick<IBlog, "authorId" | "title" | "text"> & { image?: File | null }): Promise<void> => {
    return api.fetchData('postBlog', token, values, null);
}

// delete a blog by its ID
export const deleteBlog = async (token: string, blogId: string): Promise<void> => {
    return api.fetchData(`deleteBlog/${blogId}`, token, null, null);
}

// update a blog by its ID with new values
export const updateBlog = async (token: string, blogId: string, values: Pick<IBlog, "title" | "text"> & { image?: File | null }): Promise<void> => {
    return api.fetchData(`putBlog/${blogId}`, token, values, null);
}

// fetch blogs by a specific author while excluding a specific blog, with sorting and pagination
export const getBlogsWithExclude = async (token: string, authorId: string, excludeBlogId: string | null, sort: "latest" | "mostBookmarked", viewerUserId?: string, limit: number = 3): Promise<IBlog[]> => {
    const query = `?authorId=${authorId}&excludeBlogId=${excludeBlogId}&sort=${sort === "latest" ? "createdAt" : "bookmarkCounter"}&sortType=DESC&limit=${limit}${viewerUserId ? `&userId=${viewerUserId}` : ""}`;
    const data = await api.fetchData("getBlog/", token, null, query);
    return data;
}

// fetch blogs based on a search query, sorting, and pagination for the explore page
export const getBlogsByQuery = async (token: string, userId: string, offset: number, sort?: ExploreSortField, searchName?: string): Promise<IBlog[]> => {
    const queryForFetch: string = `?limit=4&offset=${offset}${sort ? `&sort=${sort}&sortType=DESC` : ""}${searchName ? `&name=${searchName}` : ""}&userId=${userId}`;
    const data = await api.fetchData("getBlog/", token, null, queryForFetch);
    return data;
}

// fetch blogs for a user's profile page based on the type of blogs (bookmarked or commented), with pagination
export const getProfileBlogs = async (token: string, userId: string, offset: number, blogType: "bookmarks" | "comments"): Promise<IBlog[]> => {
    const queryForFetch: string = `?limit=6&offset=${offset}&only${blogType.charAt(0).toUpperCase() + blogType.slice(1)}=true&userId=${userId}`;
    const data = await api.fetchData("getBlog/", token, null, queryForFetch);
    return data;
}

// fetch the count of blogs for a specific author, with an option to only count blogs that are not deleted
export const getBlogCountByAuthor = async (token: string, authorId: string): Promise<number> => {
    const query = "?onlyCount=true";
    const count = await api.fetchData(`getBlog/count/${authorId}`, token, null, query);
    return count;
}

// fetch the ID of the most recent blog by a specific author, with sorting and pagination to get only the latest blog
export const getLastBlogIdByAuthor = async (token: string, authorId: string): Promise<string> => {
    const query = `?authorId=${authorId}&limit=1&sort=createdAt&sortType=DESC`;
    const data = await api.fetchData(`getBlog/`, token, null, query);
    return data[0]._id;
}