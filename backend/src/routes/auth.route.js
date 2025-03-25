import express from "express";
import {registerUser, signInUser} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", signInUser)

export default router;