import express from "express"
import { createBook } from "../controllers/book.controllers.js";
import verifyUser from "../middeware/auth.middleware.js";

const router = express.Router()

router.post("/", verifyUser, createBook)
router.get("/", verifyUser, getAllBooks)





export default router