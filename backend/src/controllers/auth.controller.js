import User from "../models/user.models.js";

export const registerUser = async (req, res) => {
    try {
        const{username, email, password} = req.body;
        if(!username || !email || !password){
           res.status(400).json({message: "All fields are required!"});
        }
        if(password.length < 6){
            res.status(400).json({message: "Password must be at least 6 characters!"})
        }
        if(username.length < 3){
            res.status(400).json({message: "Username must be at least 3 characters!"})
        }
        // Checking the existing user with email and username
        const existingEmail=  await User.findOne({email});
        if(existingEmail){
            res.status(400).json({message: "Email already exists"})
        }
        
        const existingUsername=  await User.findOne({username})
        if(existingUsername){
            res.status(400).json({message: "Username already exists"})
        }
        
    }
    catch (error) {
        
    }
    
}



export const signInUser = async (req, res) => {}