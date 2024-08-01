import { Handler } from "express";
import User from "../models/userModel";
import Blog from "../models/blogModel";
import { IBlog } from "../types/models/blogTypes";
import fs from "fs";
import { IUser } from "../types/models/userTypes";
import Bookmark from "../models/bookmarkModel";
import { IBookmark } from "../types/models/bookmarkTypes";

// @desc Get blogs
// @route GET /api/blog/
// @access private
export const getBlogs: Handler = async (req, res) => {
    const { limit = 6, offset = 0, sort = "_id", sortType = "ASC", authorId, excludeBlogId, userId, onlyBookmarks, name } = req.query;
    let query = {};
    if (authorId)
        query = (excludeBlogId) ? { _id: { $ne: excludeBlogId }, authorId: authorId } : { authorId };
    else if(onlyBookmarks) {
        const bookmarks: IBookmark[] | null = await Bookmark.find({ userId });
        if(bookmarks) {
            const blogIds: IBookmark['blogId'][] = bookmarks.map(bookmark => bookmark.blogId);
            query = { _id: blogIds };
        }
    }
    else if(name)
        query = { title: { $regex: name, $options: 'i' } }
    const blogs: IBlog[] | null = await Blog.find(query) // get multiple with user
        .populate("authorId", "-password")
        .sort({ [sort as string]: (sortType.toString().toUpperCase() === "ASC" ? 1 : -1) })
        .skip(offset as number)
        .limit(parseInt(limit as string));
    for (const blog of blogs) {
        if (blog.picture_path && blog.picture_path !== "") // picture path convert for browser
            blog.picture_path = `http://localhost:${process.env.PORT}/${blog.picture_path.split("public\\")[1].split("\\").join('/')}`;
        if (userId) {      
            const bookmark: IBookmark | null = await Bookmark.findOne({ userId, blogId: blog._id }); // check bookmark for user
            blog.isBookmarked = (bookmark) ? true : false;
        }
    };
    res.status(200).json(blogs);
}

// @desc Get a blog
// @route GET /api/blog/:id
// @access private
export const getBlog: Handler = async (req, res) => {
    const blog: IBlog | null = await Blog.findById(req.params.id).populate("authorId", "-password"); // get one with user
    if (blog?.picture_path && blog.picture_path !== "") // picture path convert for browser
        blog.picture_path = `http://localhost:${process.env.PORT}/${blog.picture_path.split("public\\")[1].split("\\").join('/')}`;
    res.status(200).json(blog);
}

// @desc Create new blog
// @route POST /api/blog/
// @access private
export const createBlog: Handler = async (req, res) => {
    const { authorId, title, text }: IBlog = req.body;
    if (!authorId || !title || !text) { // check fields
        res.status(400);
        throw new Error("All fields are mandatory");
    }
    const user: IUser | null = await User.findById(authorId);
    if (!user) { // check user
        res.status(400);
        throw new Error("Author not found");
    }
    const picture_path: IBlog['picture_path'] = (req.file) ? (req.file.path) : ""; // for image file
    const blog: IBlog | null = await Blog.create({ // create
        authorId,
        title,
        text,
        picture_path
    });
    res.status(201).json(blog);
}

// @desc Update blog
// @route PUT /api/blog/:id
// @access private
export const updateBlog: Handler = async (req, res) => {
    const blog: IBlog | null = await Blog.findById(req.params.id); // get one
    if (!blog) { // check id
        res.status(400);
        throw new Error("Blog not found");
    }
    if (req.body.authorId) {
        const user: IUser | null = await User.findById(req.body.authorId);
        if (!user) { // check user
            res.status(400);
            throw new Error("Author not found");
        }
    }
    if (req.file) { // is there a new file?
        if (blog.picture_path != "") // is there a old file?
            fs.unlinkSync(blog.picture_path as string);
        req.body.picture_path = req.file.path;
    }
    const updatedBlog: IBlog | null = await Blog.findByIdAndUpdate( // update
        req.params.id,
        req.body,
        { new: true }
    );
    res.status(200).json(updatedBlog);
}

// @desc Delete blog
// @route DELETE /api/blog/:id
// @access private
export const deleteBlog: Handler = async (req, res) => {
    const blog: IBlog | null = await Blog.findById(req.params.id); // get one
    if (!blog) { // check id
        res.status(400);
        throw new Error("Blog not found");
    }
    if (blog.picture_path !== "") // delete picture
        fs.unlinkSync(blog.picture_path as string);
    const bookmarks: IBookmark[] | null = await Bookmark.find({ blogId: blog._id });
    if(bookmarks.length > 0) // delete bookmarks
        await Bookmark.deleteMany({ blogId: blog._id });
    await blog.deleteOne(); // delete
    res.status(200).json(blog);
}

// @desc Get blog count for user
// @route GET /api/blog/count/:id
// @access private
export const getBlogCount: Handler = async (req, res) => {
    const count: number = (await Blog.find({ authorId: req.params.id })).length; // get count
    res.status(200).json(count);
}