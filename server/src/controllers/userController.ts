import { Handler } from "express";
import User from "../models/userModel";
import { IUser } from "../types/models/userTypes";
import fs from "fs";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// @desc Get user
// @route GET /api/user/:id
// @access private
export const getUser: Handler = async (req, res) => {
    const user: IUser | null = await User.findById(req.params.id); // get one
    res.status(200).json(user);
}

// @desc Create new user
// @route POST /api/user/
// @access private
export const createUser: Handler = async (req, res) => {
    const { username, email, password }: IUser = req.body;
    if (!username || !email || !password) { // check fields
        res.status(400);
        throw new Error("All fields are mandatory");
    }
    const picture_path: IUser['picture_path'] = (req.file) ? (req.file.path) : ""; // for image file
    const hashedPassword: string = await bcrypt.hash(password, 10); // generate hash password
    const user: IUser | null = await User.create({ // create
        username,
        email,
        password: hashedPassword,
        picture_path
    });
    res.status(201).json(user);
}

// @desc Update user
// @route PUT /api/user/:id
// @access private
export const updateUser: Handler = async (req, res) => {
    const user: IUser | null = await User.findById(req.params.id); // get one
    if (!user) { // check id
        res.status(400);
        throw new Error("User not found");
    }
    if (req.file) { // is there a new file?
        if (user.picture_path != "") // is there a old file?
            fs.unlinkSync(user.picture_path as string);
        req.body.picture_path = req.file.path;
    }
    const updatedUser: IUser | null = await User.findByIdAndUpdate( // update
        req.params.id,
        req.body,
        { new: true }
    );
    res.status(200).json(updatedUser);
}

// @desc Delete user
// @route DELETE /api/user/:id
// @access private
export const deleteUser: Handler = async (req, res) => {
    const user: IUser | null = await User.findById(req.params.id); // get one
    if (!user) { // check id
        res.status(400);
        throw new Error("User not found");
    }
    if (user.picture_path !== "")
        fs.unlinkSync(user.picture_path as string);
    await user.deleteOne(); // delete
    res.status(200).json(user);
}

// @desc Login user
// @route POST /api/user/login
// @access public
export const loginUser: Handler = async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) { // check fields
        res.status(400);
        throw new Error("All fields are mandatory");
    }
    const user: IUser | null = await User.findOne({ username }); // get one
    if (user && await bcrypt.compare(password, user.password)) {
        const token = jwt.sign({ // create token
            user: {
                id: user._id,
                username: user.username,
                picture_path: user.picture_path
            }
        },
            process.env.USER_TOKEN_SECRET as string,
            { expiresIn: "1d" }
        );
        res.status(200).json({ token });
    }
    else {
        res.status(401);
        throw new Error("Username or password not valid");
    }

    res.status(200).json(user);
}