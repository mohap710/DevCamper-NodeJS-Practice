import { ErrorResponse } from "../utils/errorResponse.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import Course from "../models/Course.js";
import Bootcamp from "../models/Bootcamp.js";

// @desc      Get all courses
// @route     GET /courses
// @route     GET /bootcamp/:bootcampId/courses
// @access    Public
export const getCourses = asyncHandler(async (request, response, next) => {
  if (request.params.bootcampId) {
    const courses = await Course.find({ bootcamp: request.params.bootcampId })
    return response.status(200).json({
      success:true,
      count: courses.length,
      data:courses
    })
  } else {
    response.status(200).json(response.queryResult);
  }
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
    // Authorize user OwnerShip to Bootcamp
    const ownerId = bootcamp.user.toString();
    if (ownerId !== request.user.id && request.user.role !== "admin") {
      return next(
        new ErrorResponse(
          401,
          "You are not Authorized to Add Courses this Bootcamp."
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
  let course = await Course.findById(request.params.id);
  if (!course) {
    return next(
      new ErrorResponse(
        404,
        `Course with the id of ${request.params.id} Not found`
      )
    );
  }

  // Authorize user OwnerShip to Bootcamp
  const ownerId = course.user.toString();
  if (ownerId !== request.user.id && request.user.role !== "admin") {
    return next(
      new ErrorResponse(401, "You are not Authorized to Update this Course.")
    );
  }
   course = await Course.findByIdAndUpdate(
    request.params.id,
    request.body,
    {
      new: true,
      runValidators: true,
    }
  );
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
  // Authorize user OwnerShip to Bootcamp
  const ownerId = course.user.toString();
  if (ownerId !== request.user.id && request.user.role !== "admin") {
    return next(
      new ErrorResponse(401, "You are not Authorized to Delete this Course.")
    );
  }
  response.status(200).json({
    success: true,
    msg: `deleted course with id of ${request.params.id}`,
  });
});
