import { ErrorResponse } from "../utils/errorResponse.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import Bootcamp from "../models/Bootcamp.js";
import Review from "../models/Review.js";

// @desc      Get all reviews
// @route     get /reviews
// @route     get /bootcamps/:id/reviews
// @access    Public
export const getReviews = asyncHandler(async (request, response, next) => {
  if (request.params.bootcampId) {
    const reviews = await Review.find({ bootcamp: request.params.bootcampId }).populate({
        path:"user",
        select:"name"
    });
    return response.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } else {
    response.status(200).json(response.queryResult);
  }
});

// @desc      Get single reviews
// @route     get /reviews/:id
// @access    Public
export const getReview = asyncHandler(async (request, response, next) => {
    const review = await Review.findById(request.params.id).populate({
        path:"bootcamp",
        select:"name description"
    });
    if(!review){
        return next(
            new ErrorResponse(404,`Review with the id : ${request.params.id} Not Found`)
        )
    }
    return response.status(200).json({
      success: true,
      data: review,
    });

});

// @desc      Add a review
// @route     POST /bootcamps/:bootcampId/reviews
// @access    Private
export const addReview = asyncHandler(async (request, response, next) => {
  // set the bootcamp for the Review from Params
  request.body.bootcamp = request.params.bootcampId;
  request.body.user = request.user.id;

  const bootcamp = await Bootcamp.findById(request.params.bootcampId);

  if (!bootcamp) {
    return next(
      new ErrorResponse(
        404,
        `Bootcamp with the id of ${request.params.bootcampId} Not found`
      )
    );
  }
  
  const review = await Review.create(request.body);
  response.status(201).json({success: true,review});
});

// @desc      Update a review
// @route     PUT /reviews/:id
// @access    Private
export const updateReview = asyncHandler(async (request, response, next) => {

  let review = await Review.findById(request.params.id);

  if (!review) {
    return next(
      new ErrorResponse(
        404,
        `Review with the id of ${request.params.id} Not found`
      )
    );
  }
  // Check if the user is the review writer
  if(review.user.toString() !== request.user.id && request.user.role !== "admin"){
    return next(
      new ErrorResponse(401,"You Can not edit this review")
    )
  }
  
  review = await Review.findByIdAndUpdate(request.params.id,request.body,{
    new:true,
    runValidators:true
  })
  response.status(201).json({success: true,review});
});

// @desc      Delete a review
// @route     DELETE /reviews/:id
// @access    Private
export const deleteReview = asyncHandler(async (request, response, next) => {

  const review = await Review.findById(request.params.id);

  if (!review) {
    return next(
      new ErrorResponse(
        404,
        `Review with the id of ${request.params.id} Not found`
      )
    );
  }
  // Check if the user is the review writer
  if(review.user.toString() !== request.user.id && request.user.role !== "admin"){
    return next(
      new ErrorResponse(401,"You Can not Delete this review")
    )
  }
  
  await review.remove()
  response.status(201).json({success: true,msg:"Review deleted successfuly"});
});
