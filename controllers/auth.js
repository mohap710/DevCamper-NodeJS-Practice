import crypto from "crypto";
import { ErrorResponse } from "../utils/errorResponse.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import User from "../models/User.js";
import { sendEmail } from "../utils/sendEmails.js";

// @desc      Register a user
// @route     POST /auth/register
// @access    Public
export const register = asyncHandler(async (request, response, next) => {
  const { name, email, password, role } = request.body;
  const user = await User.create({
    name,
    email,
    password,
    role,
  });

  sendTokenResponse(user, 200, response);
});
// @desc      Log a user In
// @route     POST /auth/login
// @access    Public
export const login = asyncHandler(async (request, response, next) => {
  const { email, password } = request.body;
  // Validate Inputs
  if (!email || !password) {
    return next(new ErrorResponse(400, "Please provide Email and password"));
  }

  const user = await User.findOne({ email }).select("+password");
  // Check if user exists
  if (!user) {
    return next(new ErrorResponse(404, "Invalid Crednitial"));
  }

  // Match passwords
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return next(new ErrorResponse(404, "Invalid Crednitial"));
  }

  sendTokenResponse(user, 200, response);
});

// @desc      Logged in user Profile
// @route     GET /auth/me
// @access    Private
export const getMe = asyncHandler(async (request, response, next) => {
  const user = await User.findById(request.user.id);

  response.status(200).json({
    success: true,
    user,
  });
});

// @desc      Update logged in user details
// @route     PUT /auth/updatedetails
// @access    Private
export const updateDetails = asyncHandler(async (request, response, next) => {
  const fieldsToUpdate = {
    name: request.body.name,
    email: request.body.email,
  };
  const user = await User.findByIdAndUpdate(request.user.id, fieldsToUpdate, {
    new: true,
    runValidators: true,
  });

  response.status(200).json({
    success: true,
    user,
  });
});

// @desc      Update logged in user password
// @route     PUT /auth/updatepassword
// @access    Private
export const updatePassword = asyncHandler(async (request, response, next) => {
  const user = await User.findById(request.user.id).select("+password");
  
  // Check if current password matches the provided password

  const isMatched = await user.comparePassword(request.body.currentPassword);
  if (!isMatched) {
    return next(new ErrorResponse(401, "Incorrect Password"));
  }
  user.password = request.body.newPassword;
  await user.save();

  sendTokenResponse(user, 200, response);
});

// @desc      Forgot Password
// @route     POST /auth/forgotpassword
// @access    Private
export const forgotPassword = asyncHandler(async (request, response, next) => {
  if (!request.body.email) {
    return next(new ErrorResponse(400, "You must enter an E-mail"));
  }

  const user = await User.findOne({ email: request.body.email });
  if (!user) {
    return next(
      new ErrorResponse(404, "The E-mail you entered is not in our record")
    );
  }

  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  // create a reset Url
  const resetUrl = `${request.protocol}://${request.get(
    "host"
  )}/auth/resetpassword/${resetToken}`;
  const message = `You are reciving this email because you (or someone else) requested to reset your password
    please make a request to:\n\n ${resetUrl}`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Reset password token",
      text: message,
    });
    response.status(200).json({
      success: true,
      msg: "email Sent",
    });
  } catch (error) {
    console.error(error);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(
      new ErrorResponse(500, "Could not send E-mail , please try Again.")
    );
  }
});

// @desc      resetPassword
// @route     PUT /auth/forgotpassword/:resettoken
// @access    Private
export const resetPassword = asyncHandler(async (request, response, next) => {
  // hash the token
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(request.params.resettoken)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: {
      $gt: Date.now(),
    },
  });
  if (!user) {
    return next(new ErrorResponse(400, "Invalid Token"));
  }

  // set the new Password
  //   if(!request.body.password){
  //     return next(
  //         new ErrorResponse(400,"You must enter the new password")
  //     )
  //   }
  user.password = request.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  sendTokenResponse(user, 200, response);
});

// "HELPER" Get token from model , create cookie , and send response
const sendTokenResponse = (user, statusCode, response) => {
  const token = user.signJWT();

  const toDays = 24 * 60 * 60 * 1000;
  const options = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * toDays),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production" ? true : false,
  };
  response.status(statusCode).cookie("token", token, options).json({
    success: true,
    token,
  });
};
