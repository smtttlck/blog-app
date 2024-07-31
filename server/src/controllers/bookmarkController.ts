import { Handler } from "express";
import { IUser } from "../types/models/userTypes";
import User from "../models/userModel";
import Blog from "../models/blogModel";
import { IBlog } from "../types/models/blogTypes";
import Bookmark from "../models/bookmarkModel";
import { IBookmark } from "../types/models/bookmarkTypes";

// @desc Create bookmark
// @route POST /api/bookmark
// @access private
export const createBookmark: Handler = async(req, res) => {
    const { userId, blogId }: IBookmark = req.body;
    if(!userId || !blogId) { // check fields
        res.status(400);
        throw new Error("All fields are mandatory");
    }
    const user: IUser | null = await User.findById(userId);
    if(!user) { // check user
        res.status(400);
        throw new Error("User not found");
    }
    const blog: IBlog | null = await Blog.findById(blogId);
    if(!blog) { // check blog
        res.status(400);
        throw new Error("Blog not found");
    }
    const checkBookmark: IBookmark | null = await Bookmark.findOne({ userId, blogId });    
    if(checkBookmark) { // check bookmarks
        res.status(400);
        throw new Error("This blog has already been bookmarked");
    }
    const newBookmark: IBookmark | null = await Bookmark.create({ // create
        userId,
        blogId
    });
    res.status(201).json(newBookmark);
}

// @desc Delete bookmark
// @route DELETE /api/bookmark
// @access private
export const deleteBookmark: Handler = async(req, res) => {
    const { userId, blogId }: IBookmark = req.body;
    if(!userId || !blogId) { // check fields
        res.status(400);
        throw new Error("All fields are mandatory");
    }
    const user: IUser | null = await User.findById(userId);
    if(!user) { // check user
        res.status(400);
        throw new Error("User not found");
    }
    const blog: IBlog | null = await Blog.findById(blogId);
    if(!blog) { // check blog
        res.status(400);
        throw new Error("Blog not found");
    }
    const bookmark: IBookmark | null = await Bookmark.findOne({ userId, blogId });    
    if(!bookmark) { // check bookmark
        res.status(400);
        throw new Error("Bookmark not found");
    }
    await bookmark.deleteOne(); // delete
    res.status(200).json(bookmark);
}