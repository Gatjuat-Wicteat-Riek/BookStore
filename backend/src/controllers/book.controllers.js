import Book from "../models/book.models.js"
import { errorHandler } from "../utils/error.js";
import cloudinary from "../lib/cloudinary.js";

 // creating books
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
             .populate("user", "username profileImage") // Displays the owner of the book posted
            
     }catch (error) {
         console.log("Error in getting all the books", error)
         return next(errorHandler(500, "Internal server error"))
     }
}
// Get the recommended book
export const getUserBooks = async (req, res, next)=>{
     try {
         const books = await Book.find({user: req.user._id}).sort({createdAt: -1})
         res.send(books)
     }catch (error) {
         console.log("Error in getting users' book", error.message)
         return next(errorHandler(500, "Internal server error"))
     }
}

//deleting books
export const deleteBook = async (req, res, next)=>{
     try {
         const book = await Book.findById(req.params.id)
         if(!book){
             return next(errorHandler(404, "Book not found"))
         }
     //     check if user is the creator
         if(book.user.toString() !== req.user._id.toString()){
             return next(errorHandler(401, "Not authorised!"))
         }
         // deleting the image from the cloudinary
         if(book.image && book.image.includes("cloudinary")){
             try {
                 const publicId = book.image.split("/").pop().split(".")[0]
                 await cloudinary.uploader.destroy(publicId) // this will delete the image in the cloudinary
             } catch (deleteError) {
                 console.log("Error in deleting the image from the cloudinary", deleteError)
                 
             }
         }
         await Book.deleteOne()
         res.json({message: "Book deleted successfully"})
     } catch (error) {
         console.log("Error, cannot delete a book", error)
         return next(errorHandler(500, "Internal server error"))
     }
}