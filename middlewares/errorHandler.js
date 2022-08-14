import { ErrorResponse } from "../utils/errorResponse.js";

export const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message
  // Mongoose bad ObjectId
  if(err.name === "CastError"){
    const message = `Resource with the id of ${err.value} Not found`;
    error = new ErrorResponse(404,message);
  }
  // Duplicate Value Entered 
  if(err.code == 11000){
    const message = `Duplicate value has been entered in ${
      Object.keys(err.keyPattern)
    }`;
    error = new ErrorResponse(400, message);
  }
 // Mongoose Validation Error   
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors).map(error => error.message)
    error = new ErrorResponse(400, message);
  } 
  res.status(error.code || 500).json({
    success: false,
    error: error.message || "Server Error",

  });
};
