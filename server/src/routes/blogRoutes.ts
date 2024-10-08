import express, { Router } from "express";
import asyncHandler from "express-async-handler";
import { createMulter } from "../middlewares/multerConfig";
import validateTokenHandler from "../middlewares/validateTokenHandler";
import { createBlog, deleteBlog, getBlog, getBlogCount, getBlogs, updateBlog } from "../controllers/blogController";

const router: Router = express.Router();

const upload = createMulter("blogImg"); // multer for image file

// public endpoints
router.route('/')
    .post(upload.single('image'), asyncHandler(createBlog));

router.use(asyncHandler(validateTokenHandler)); // token validation

// private endpoints
router.route('/')
    .get(asyncHandler(getBlogs));
router.route('/:id')
    .get(asyncHandler(getBlog))
    .put(upload.single('image'), asyncHandler(updateBlog))
    .delete(asyncHandler(deleteBlog));
router.route('/count/:id')
    .get(asyncHandler(getBlogCount));

module.exports = router;