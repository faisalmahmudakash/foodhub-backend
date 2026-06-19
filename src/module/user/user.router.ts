import express from "express";
import { userController } from "./user.controller";

const router = express.Router();

router.patch("/:userid", userController.updateUser);
router.patch("/:userid/image", userController.updateProfileImage);


export const userRouter = router;
