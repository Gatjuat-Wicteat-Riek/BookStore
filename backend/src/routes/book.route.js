import express from "express"
import { createBook, getAllBooks, deleteBook, getUserBooks } from "../controllers/book.controllers.js";
import verifyUser from "../middeware/auth.middleware.js";

const router = express.Router()

router.post("/", verifyUser, createBook)
router.get("/", verifyUser, getAllBooks)
router.delete("/:id", verifyUser, deleteBook)
router.get("/user", verifyUser, getUserBooks)





export default router