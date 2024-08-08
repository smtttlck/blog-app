import { Handler } from "express";
import { IUser } from "../types/models/userTypes";
import User from "../models/userModel";
import Follow from "../models/followModel";
import { IFollow } from "../types/models/followTypes";

// @desc Create follow
// @route POST /api/follow
// @access private
export const createFollow: Handler = async(req, res) => {
    const { followerUserId, followingUserId }: IFollow = req.body;
    if(!followerUserId || !followingUserId) { // check fields
        res.status(400);
        throw new Error("All fields are mandatory");
    }
    const followerUser: IUser | null = await User.findById(followerUserId);
    if(!followerUser) { // check follower user
        res.status(400);
        throw new Error("Follower user not found");
    }
    const followingUser: IUser | null = await User.findById(followingUserId);
    if(!followingUser) { // check following user
        res.status(400);
        throw new Error("Following user not found");
    }
    const checkFollow: IFollow | null = await Follow.findOne({ followerUserId, followingUserId });    
    if(checkFollow) { // check follows
        res.status(400);
        throw new Error("This user is already following");
    }
    const newFollow: IFollow | null = await Follow.create({ // create
        followerUserId,
        followingUserId
    });
    res.status(201).json(newFollow);
}

// @desc Delete follow
// @route DELETE /api/follow
// @access private
export const deleteFollow: Handler = async(req, res) => {
    const { followerUserId, followingUserId }: IFollow = req.body;
    if(!followerUserId || !followingUserId) { // check fields
        res.status(400);
        throw new Error("All fields are mandatory");
    }
    const followerUser: IUser | null = await User.findById(followerUserId);
    if(!followerUser) { // check follower user
        res.status(400);
        throw new Error("Follower user not found");
    }
    const followingUser: IUser | null = await User.findById(followingUserId);
    if(!followingUser) { // check following user
        res.status(400);
        throw new Error("Following user not found");
    }
    const follow: IFollow | null = await Follow.findOne({ followerUserId, followingUserId });    
    if(!follow) { // check follows
        res.status(400);
        throw new Error("This user does not follow");
    }
    await follow.deleteOne(); // delete
    res.status(200).json(follow);
}

// @desc Get follow
// @route GET /api/follow/
// @access private
export const getFollow: Handler = async(req, res) => {
    const { followerUserId, followingUserId } = req.query;
    if(!followerUserId || !followingUserId) { // check fields
        res.status(400);
        throw new Error("All fields are mandatory");
    }
    const followerUser: IUser | null = await User.findById(followerUserId);
    if(!followerUser) { // check follower user
        res.status(400);
        throw new Error("Follower user not found");
    }
    const followingUser: IUser | null = await User.findById(followingUserId);
    if(!followingUser) { // check following user
        res.status(400);
        throw new Error("Following user not found");
    }
    const follow: IFollow | null = await Follow.findOne({ followerUserId, followingUserId });
    res.status(200).json(follow);
}

// @desc Get followers
// @route GET /api/follow/follower/:userId
// @access private
export const getFollowers: Handler = async(req, res) => {
    const { onlyCount } = req.query;
    const user: IUser | null = await User.findById(req.params.userId);
    if(!user) { // check user
        res.status(400);
        throw new Error("User not found");
    }
    
    const follows: IFollow[] | number | null = (onlyCount) ? 
        (await Follow.find({ followerUserId: req.params.userId })).length : 
        (await Follow.find({ followerUserId: req.params.userId }));
    res.status(200).json(follows);
}

// @desc Get followings
// @route GET /api/follow/following/:userId
// @access private
export const getFollowings: Handler = async(req, res) => {
    const { onlyCount } = req.query;
    const user: IUser | null = await User.findById(req.params.userId);
    if(!user) { // check user
        res.status(400);
        throw new Error("User not found");
    }
    const follows: IFollow[] | number | null = (onlyCount) ? 
        (await Follow.find({ followingUserId: req.params.userId })).length : 
        (await Follow.find({ followingUserId: req.params.userId }));
    res.status(200).json(follows);
}