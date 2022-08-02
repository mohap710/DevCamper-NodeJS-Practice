import { ErrorResponse } from "../utils/errorResponse.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import Course from "../models/Course.js";
import Bootcamp from "../models/Bootcamp.js";

// @desc      Get all courses
// @route     GET /courses
// @route     GET /bootcamp/:bootcampId/courses
// @access    Public
export const getCourses = asyncHandler(async (request, response, next) => {
  let query;
  
  // make copy of request.query
  const reqQuery = { ...request.query }
  // Params to exclude
  const excludeParams = ["select","sort","limit","page"]
  excludeParams.forEach(param => delete reqQuery[param])
  
  // create Mongoose Operators ( $gt|$gte|$lt|$lte|$in )
  let queryStr = JSON.stringify(reqQuery);
  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );

  // Find Resources
  if (request.params.bootcampId) {
    query = Course.find({ bootcamp: request.params.bootcampId })
  } else {
    query = Course.find().populate({
      path: "bootcamp",
      select: "name description",
    });
  }

  // Select Fields
  if(request.query.select){
    // transform Field from comma seprated to space seprated
    // e.g: name,desc,created => name desc created
    let fields = request.query.select.split(",").join(" ")
    query = query.select(fields)
  }

  // Sort By field or Default Sort by createdAt
  if(request.query.sort){
    let sortBy = request.query.sort.split(",").join(" ");
    query = query.sort(sortBy)
  } else{
    query = query.sort("-createdAt");
  }

  // Pagination
  // const page = parseInt(request.query.page, 10) || 1;
  // const limit = parseInt(request.query.limit, 10) || 10;
  // const firstIndex = (page - 1) * limit
  // let lastIndex = page * limit
  // const total = await Course.countDocuments()

  // query = query.skip(firstIndex).limit(limit);
  // const pagination = {}
  // if(lastIndex > total){
  //   lastIndex = total
  // }
  // pagination.perPage = `Showing Data from ${firstIndex+1} to ${lastIndex}`
  // if(firstIndex > 0){
  //   pagination.prevPage = page - 1 
  // }
  // if(lastIndex < total){
  //   pagination.nextPage = page + 1 
  // }


  const courses = await query;
  response
    .status(200)
    .json({ success: true, data: courses });
});



// @desc      Get Single courses
// @route     GET /courses/:id
// @access    Public
export const getSingleCourse = asyncHandler(
  async (request, response, next) => {
    const course = await Course.findById(request.params.id).populate({
      path: "bootcamp",
      select:"name description"
    });
    if (!course) {
      return next(
        new ErrorResponse(
          404,
          `Course with the id of ${request.params.id} Not found`
        )
      );
    }
    response.status(200).json({ success: true, data: course });
  }
);

// @desc      Add A new course
// @route     /bootcamp/:bootcampId/courses
// @access    Private
export const createNewCourse = asyncHandler(
  async (request, response, next) => {
    // set the bootcamp for the course from Params
    request.body.bootcamp = request.params.bootcampId;
    const bootcamp = await Bootcamp.findById(request.params.bootcampId);
    
    if(!bootcamp){
      return next(
        new ErrorResponse(
          404,
          `Bootcamp with the id of ${request.params.bootcampId} Not found`
        )
      );
    }

    const course = await Course.create(request.body);
    response.status(201).json({ success: true, data: course });
  }
);

// @desc      Update A course
// @route     PUT /courses/:id
// @access    Private
export const updateCourse = asyncHandler(async (request, response, next) => {
  const course = await Course.findByIdAndUpdate(
    request.params.id,
    request.body,
    {
      new: true,
      runValidators: true,
    }
  );
  if (!course) {
    return next(
      new ErrorResponse(
        404,
        `Course with the id of ${request.params.id} Not found`
      )
    );
  }
  response.status(200).json({ success: true, data: course });
});

// @desc      DELETE A course
// @route     DELETE /courses
// @access    Private
export const deleteCourse = asyncHandler(async (request, response, next) => {
  const course = await Course.findByIdAndDelete(request.params.id);
  if (!course) {
    return next(
      new ErrorResponse(
        404,
        `Course with the id of ${request.params.id} Not found`
      )
    );
  }
  response.status(200).json({
    success: true,
    msg: `deleted course with id of ${request.params.id}`,
  });
});
