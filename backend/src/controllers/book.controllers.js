import Book from "../models/book.models.js"
import { errorHandler } from "../utils/error.js";
import cloudinary from "../lib/cloudinary.js";

 export const createBook = async (req, res, next)=>{
    try {
        const {title, caption, image, rating} = req.body
        if(!title || !caption || !image || !rating){
            return next(errorHandler(400, "All fields are required!"))
        }
        const uploadRes = await cloudinary.uploader.upload(image)
        const imgURl = uploadRes.secure_url
    //   creating new book  
        const newBook = new Book({
            title,
            caption,
            rating,
            image: imgURl,
            user: req.user._id
        })
        await newBook.save()
        res.status(201).json(newBook)
        
    } catch (error) {
        console.log("Error creating book!", error)
        return next(errorHandler(400, error.message))
    }
}

//getting all the books
export const getAllBooks = async (req, res, next)=>{
     try {
         const page = req.query.page || 1;
         const limit = req.query.limit || 5;
         const skip = (page -1 ) * limit;
         const books = await Book.find()
         // get total books present in the database
         const totalBooks = await Book.countDocuments()
         
         res.send({
             books,
             currentPage: page,
             totalBooks,
             totalPages: Math.ceil(totalBooks / limit)
         })
             .sort({createdAt: -1}) // sorting in descending order
             .skip(skip)
             .limit(limit)
             .populate("user", "username profileImage")
            
         
     }catch (error) {
         console.log("Error in getting all the books", error)
         return next(errorHandler(500, "Internal server error"))
     }
}