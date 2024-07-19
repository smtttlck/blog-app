import { Handler } from "express";
import User from "../models/userModel";
import Blog from "../models/blogModel";
import { IBlog } from "../types/models/blogTypes";
import fs from "fs";
import { IUser } from "../types/models/userTypes";

// @desc Get blog
// @route GET /api/blog/:id
// @access private
export const getBlog: Handler = async (req, res) => {
    const blog: IBlog | null = await Blog.findById(req.params.id); // get one
    res.status(200).json(blog);
}

// @desc Create new blog
// @route POST /api/blog/
// @access private
export const createBlog: Handler = async (req, res) => {
    const { authorId, title, text }: IBlog = req.body;
    if(!authorId || !title || !text) { // check fields
        res.status(400);
        throw new Error("All fields are mandatory");
    }
    const user: IUser | null = await User.findById(authorId);
    if(!user) { // check user
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
    if(!blog) { // check id
        res.status(400);
        throw new Error("Blog not found");
    }
    if(req.body.authorId) {
        const user: IUser | null = await User.findById(req.body.authorId);
        if(!user) { // check user
            res.status(400);
            throw new Error("Author not found");
        }
    }
    if(req.file) { // is there a new file?
        if(blog.picture_path != "") // is there a old file?
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
    if(!blog) { // check id
        res.status(400);
        throw new Error("Blog not found");
    }
    if(blog.picture_path !== "")
        fs.unlinkSync(blog.picture_path as string);
    await blog.deleteOne(); // delete
    res.status(200).json(blog);
}