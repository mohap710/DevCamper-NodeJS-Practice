import jwt from "jsonwebtoken";
import { asyncHandler } from "./asyncHandler.js";
import { ErrorResponse } from "../utils/errorResponse.js";
import User from "../models/User.js";

export const protect = asyncHandler(async (req, res, next) => {
  let token;
  const authHeader = req.headers.authorization;
  const cookies = req.cookies

  if (authHeader && authHeader.startsWith("Bearer")) {
    token = authHeader.split(" ")[1];
  }

  // else if(cookies.token){
  //   token = cookies.token
  // }
   if(!token){
    return next(new ErrorResponse(401,"Access Denied"))
   }   

  // Verify Token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = await User.findById(decoded.id)
    next();

  } catch (error) {
    return next(new ErrorResponse(401, "Access Denied"))
  }    
});

export const authorize = (...roles) =>{
  return (req,res,next) => {
    if(!roles.includes(req.user.role)){
      return next(
        new ErrorResponse(403,
          `You are not Authorized to commit this Action`
          )
      )
    }
    next();
  }
}
