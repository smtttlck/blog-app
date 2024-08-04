import express, { Router } from "express";
import asyncHandler from "express-async-handler";
import validateTokenHandler from "../middlewares/validateTokenHandler";
import { createFollow, deleteFollow, getFollowers, getFollowings } from "../controllers/followController";

const router: Router = express.Router();

router.use(asyncHandler(validateTokenHandler)); // token validation

// private endpoints
router.route('/')
    .post(asyncHandler(createFollow))
    .delete(asyncHandler(deleteFollow));
router.route('/follower/:userId')
    .get(asyncHandler(getFollowers));
router.route('/following/:userId')
    .get(asyncHandler(getFollowings));

module.exports = router;