import express, { Router } from "express";
import asyncHandler from "express-async-handler";
import validateTokenHandler from "../middlewares/validateTokenHandler";
import { createBookmark, deleteBookmark } from "../controllers/bookmarkController";

const router: Router = express.Router();

router.use(asyncHandler(validateTokenHandler)); // token validation

// private endpoints
router.route('/')
    .post(asyncHandler(createBookmark))
    .delete(asyncHandler(deleteBookmark));

module.exports = router;