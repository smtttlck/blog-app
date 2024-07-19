import express, { Router } from "express";
import asyncHandler from "express-async-handler";
import { createMulter } from "../middlewares/multerConfig";
import validateTokenHandler from "../middlewares/validateTokenHandler";
import { createUser, deleteUser, getUser, updateUser, loginUser } from "../controllers/userController";

const router: Router = express.Router();

const upload = createMulter("userImg"); // multer for image file

// public endpoints
router.route('/')
    .post(upload.single('image'), asyncHandler(createUser));
router.route('/login')
    .post(asyncHandler(loginUser));

router.use(asyncHandler(validateTokenHandler)); // token validation

// private endpoints
router.route('/:id')
    .get(asyncHandler(getUser))
    .put(upload.single('image'), asyncHandler(updateUser))
    .delete(asyncHandler(deleteUser));

module.exports = router;