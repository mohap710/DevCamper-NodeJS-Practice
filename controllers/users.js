import { ErrorResponse } from "../utils/errorResponse.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import User from "../models/User.js";

// @desc      Get all users
// @route     get /auth/users
// @access    Private/admin
export const getUsers = asyncHandler(async (request, response, next) => {
    try {
        
        response.status(200).json(response.queryResult);
    } catch (error) {
        console.error(error);
    }
});

// @desc      Get single user
// @route     get /auth/users/:id
// @access    Private/admin
export const getUser = asyncHandler(async (request, response, next) => {
  const user = await User.findById(request.params.id)
  if(!user){
    return next(
      new ErrorResponse(
        404,
        `Could not find user with the Id: ${request.params.id}`
      )
    );
  }
  response.status(200).json({
    success :true,
    user
  })
});

// @desc      Create new User
// @route     POST /auth/users
// @access    Private/admin
export const createUser = asyncHandler(async (request, response, next) => {
  const user = await User.create(request.body)
  response.status(201).json({
    success:true,
    user
  })
});

// @desc      Update User
// @route     PUT /auth/users/:id
// @access    Private/admin
export const updateUser = asyncHandler(async (request, response, next) => {
  const user = await User.findByIdAndUpdate(request.params.id,request.body,{
    new:true,
    runValidators:true
  })
  response.status(200).json({
    success:true,
    user
  })
});

// @desc      Delete User
// @route     DELETE /auth/users/:id
// @access    Private/admin
export const deleteUser = asyncHandler(async (request, response, next) => {
  await User.findByIdAndDelete(request.params.id)
  response.status(200).json({
    success:true,
    msg:"User deleted Successfuly"
  })
});

