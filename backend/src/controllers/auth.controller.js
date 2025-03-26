import User from "../models/user.models.js";
import jwt from "jsonwebtoken";
import {errorHandler} from "../utils/error.js";
import {validate} from "deep-email-validator";

const generateToken = (userId)=>{
    return jwt.sign({userId}, process.env.JWT_SECRET, {expiresIn: "1d"})
}

export const registerUser = async (req, res, next) => {
    try {
        const{username, email, password} = req.body;
        if(!username || !email || !password){
          return  res.status(400).json({message: "All fields are required!"});
        }
        if(password.length < 6){
           return res.status(400).json({message: "Password must be at least 6 characters!"})
        }
        if(username.length < 3){
           return res.status(400).json({message: "Username must be at least 3 characters!"})
        }
        // Checking the existing user with email and username
        const existingEmail=  await User.findOne({email});
        if(existingEmail){
           return res.status(400).json({message: "Email already exists"})
        }
        const validateResults = await validate(email)
        // verifying if the email is valid or not
        if(!validateResults.valid){
            return res.status(400).json({
                error: "Error",
                message: "Email is not valid. Please try again",
                reason: validateResults.reason
            })
        }
        
        const existingUsername=  await User.findOne({username})
        if(existingUsername){
           return res.status(400).json({message: "Username already exists"})
        }
        const profileImage = `https://api.dicebear.com/9.x/avataaars/svg?seed=${username}`
        const user = new User({
            username,
            email,
            password,
            profileImage: profileImage
        })
        await user.save();
        const token = generateToken(user._id)
        res.status(201).json({
            token,
            user:{
                userId: user._id,
                username: user.username,
                email: user.email,
                profileImage: user.profileImage
            }
        })
    }
    catch (error) {
        console.log('Unable to register user', error)
        return res.status(500).json({message: "Internal Server error!"})
    }
}




export const signInUser = async (req, res) => {}