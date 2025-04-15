import jwt from 'jsonwebtoken';
import User from "../models/user.models.js"
import { errorHandler } from "../utils/error.js";

// const response = await  fetch("http://localhost:7000/api/books", {
//     method: "POST",
//     body: JSON.stringify({
//         title,
//         caption
//     }),
//     headers:{Authorization: `Bearer ${token}`},
// });

//Verify the user to protect the route 
const verifyUser = async (req, res, next) => {
    // const token = req.cookies.access_token
  try {
        // get the token
        const token = req.header("Authorization").replace("Bearer ", "")
        if(!token) return next(errorHandler(401, "No Authorisation token, access denied\""))
  //     verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
  //     find the user
      const user = await User.findById(decoded.userId).select("-password")
      if(!user){
          return next(errorHandler(401, "Invalid Token"))
      }
  //     if everything went well
      req.user = user
      next()
  } catch (error) {
      console.log("Error", error)
      return next(errorHandler(400, "Token not valid"));
  }
}

export default  verifyUser