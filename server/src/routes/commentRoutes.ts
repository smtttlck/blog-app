import express, { Router } from "express";
import asyncHandler from "express-async-handler";
import validateTokenHandler from "../middlewares/validateTokenHandler";
import { createComment, deleteComment, getComments } from "../controllers/commentController";

const router: Router = express.Router();

router.use(asyncHandler(validateTokenHandler)); // token validation

// private endpoints
router.route('/')
    .post(asyncHandler(createComment))
    .delete(asyncHandler(deleteComment));
router.route('/:blogId')
    .get(asyncHandler(getComments));

module.exports = router;