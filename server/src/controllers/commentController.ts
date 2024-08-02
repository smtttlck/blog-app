import { Handler } from "express";
import { IUser } from "../types/models/userTypes";
import User from "../models/userModel";
import Blog from "../models/blogModel";
import { IBlog, IComment } from "../types/models/blogTypes";
import Comment from "../models/commentModel";

// @desc Get comments for a blog
// @route GET /api/comment/:blogId
// @access private
export const getComments: Handler = async(req, res) => {
    const blog: IBlog | null = await Blog.findById(req.params.blogId);
    if(!blog) { // check blog
        res.status(400);
        throw new Error("Blog not found");
    }
    const comments: IComment[] | null = await Comment.find({ blogId: req.params.blogId })
        .populate("userId", "-password")
        .sort({ createdAt: "desc" });
    res.status(201).json(comments);
}

// @desc Create comment
// @route POST /api/comment
// @access private
export const createComment: Handler = async(req, res) => {
    const { userId, blogId, text }: IComment = req.body;
    if(!userId || !blogId || !text) { // check fields
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
    const newComment: IComment | null = await Comment.create({ // create
        userId,
        blogId,
        text
    });
    await Blog.findByIdAndUpdate( // comment counter increase
        blogId,
        { $inc: { commentCounter: 1 } },
        { new: true }
    );
    res.status(201).json(newComment);
}

// @desc Delete comment
// @route DELETE /api/comment
// @access private
export const deleteComment: Handler = async(req, res) => {
    const { _id, userId, blogId }: IComment = req.body;
    if(!_id ||!userId || !blogId) { // check fields
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
    const comment: IComment | null = await Comment.findById(_id);    
    if(!comment) { // check comment
        res.status(400);
        throw new Error("Comment not found");
    }
    await comment.deleteOne(); // delete
    await Blog.findByIdAndUpdate( // comment counter decrease
        blogId,
        { $inc: { commentCounter: -1 } },
        { new: true }
    );
    res.status(200).json(comment);
}