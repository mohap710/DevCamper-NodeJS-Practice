import Bootcamp from "../models/Bootcamps.js";
import { ErrorResponse } from "../utils/errorResponse.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";
// @desc      Get all bootcamps
// @route     GET /bootcamps
// @access    Public
export const getBootcamps = asyncHandler( async (_request, response, next) => {
  const bootcamps = await Bootcamp.find();
  response
    .status(200)
    .json({ success: true, count: bootcamps.length, data: bootcamps });
});

// @desc      Get Single bootcamps
// @route     GET /bootcamps/:id
// @access    Public
export const getSingleBootcamps = asyncHandler(
  async (request, response, next) => {
    const bootcamp = await Bootcamp.findById(request.params.id);
    if (!bootcamp) {
      return next(
        new ErrorResponse(
          404,
          `Bootcamp with the id of ${request.params.id} Not found`
        )
      );
    }
    response.status(200).json({ success: true, data: bootcamp });
  }
);

// @desc      Create A new bootcamp
// @route     POST /bootcamps
// @access    Private
export const createNewBootcamps = asyncHandler(async (request, response, next) => {
    const bootcamp = await Bootcamp.create(request.body);
    response.status(201).json({ success: true, data: bootcamp });
});

// @desc      Update A bootcamp
// @route     PUT /bootcamps
// @access    Private
export const updateBootcamps =  asyncHandler(async (request, response, next) => {
    const bootcamp = await Bootcamp.findByIdAndUpdate(
      request.params.id,
      request.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!bootcamp) {
      return next(
        new ErrorResponse(
          404,
          `Bootcamp with the id of ${request.params.id} Not found`
        )
      );
    }
    response.status(200).json({ success: true, data: bootcamp });
})

// @desc      DELETE A bootcamp
// @route     DELETE /bootcamps
// @access    Private
export const deleteBootcamps =  asyncHandler(async (request, response, next) => {
    const bootcamp = await Bootcamp.findByIdAndDelete(request.params.id);
    if (!bootcamp) {
      return next(
        new ErrorResponse(
          404,
          `Bootcamp with the id of ${request.params.id} Not found`
        )
      );
    }
    response.status(200).json({
      success: true,
      msg: `deleted bootcamp with id of ${request.params.id}`,
    });
})
