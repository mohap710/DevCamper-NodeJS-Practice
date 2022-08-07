import { ErrorResponse } from "../utils/errorResponse.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import User from "../models/User.js";

// @desc      Register a user
// @route     POST /auth/register
// @access    Public
export const register = asyncHandler(async (request, response, next) => {
    const { name,email,password,role} = request.body
    const user = await User.create({
        name,
        email,
        password,
        role
    })

    sendTokenResponse(user, 200, response);

});
// @desc      Log a user In
// @route     POST /auth/login
// @access    Public
export const login = asyncHandler(async (request, response, next) => {
    const { email,password} = request.body
    // Validate Inputs
    if(!email || !password){
        return next(
            new ErrorResponse(400,"Please provide Email and password")
        )
    }

    const user = await User.findOne({email}).select("+password");
    // Check if user exists
    if (!user) {
      return next(
        new ErrorResponse(404, "Invalid Crednitial")
     );
    }

    // Match passwords
    const isMatch = await user.comparePassword(password);
    if(!isMatch){
        return next(new ErrorResponse(404, "Invalid Crednitial"));
    }

    sendTokenResponse(user,200,response);
});

// Get token from model , create cookie , and send response
const sendTokenResponse = (user, statusCode, response)=>{
    const token = user.signJWT();

    const toDays = 24 * 60 * 60 * 1000;
    const options = {
      expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * toDays),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production" ? true : false,
    };
    response
        .status(statusCode)
        .cookie("token",token,options)
        .json({
            success:true,
            token
        })
}
