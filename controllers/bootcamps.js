import path from "path";
import { ErrorResponse } from "../utils/errorResponse.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { geocoder } from "../utils/geocoder.js";
import Bootcamp from "../models/Bootcamp.js";
import { existsSync,mkdirSync } from "fs";

// @desc      Get all bootcamps
// @route     GET /bootcamps
// @access    Public
export const getBootcamps = asyncHandler(async (request, response, next) => {
  try {
    response.status(200).json(response.queryResult);
    
  } catch (error) {
    next(
      new ErrorResponse(500,error)
    )
  }
});

// @desc      Get all bootcamps with A given Radius
// @route     GET /bootcamps/radius/:zipcode/:distance
// @access    Public
export const getBootcampsWithinRadius = asyncHandler(
  async (request, response, next) => {
    const { zipcode, distance } = request.params;

    // get lng & lat from geocoder
    const loc = await geocoder.geocode(zipcode);
    const lat = loc[0].latitude;
    const lng = loc[0].longitude;

    // calculate Radius using Radian
    // EarthRadius = 3963 Miles / 6378 km
    const earthRadius = 3963;
    const radius = distance / earthRadius;

    const bootcamps = await Bootcamp.find({
      location: {
        $geoWithin: {
          $centerSphere: [[lng, lat], radius],
        },
      },
    });

    response.status(200).json({
      success: true,
      count: bootcamps.length,
      data: bootcamps,
    });
  }
);

// @desc      Get Single bootcamps
// @route     GET /bootcamps/:id
// @access    Public
export const getSingleBootcamps = asyncHandler(
  async (request, response, next) => {
    const bootcamp = await Bootcamp.findById(request.params.id).populate("courses");
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
export const createNewBootcamps = asyncHandler(
  async (request, response, next) => {
    const bootcamp = await Bootcamp.create(request.body);
    response.status(201).json({ success: true, data: bootcamp });
  }
);

// @desc      Update A bootcamp
// @route     PUT /bootcamps
// @access    Private
export const updateBootcamps = asyncHandler(async (request, response, next) => {
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
});

// @desc      DELETE A bootcamp
// @route     DELETE /bootcamps
// @access    Private
export const uploadBootcampPhoto = asyncHandler(async (request, response, next) => {
  const bootcamp = await Bootcamp.findById(request.params.id);
  if (!bootcamp) {
    return next(
      new ErrorResponse(
        404,
        `Bootcamp with the id of ${request.params.id} Not found`
      )
    );
  }

  if(!request.files){
    return next(
      new ErrorResponse(400,"Please Upload a file")
    )
  }
  // check if it's a valid image
  const file = request.files.file
  if(!file.mimetype.startsWith("image")){
    return next(
      new ErrorResponse(400,"Please Upload a photo")
    )
  }
  // check the size
  if(file.size > process.env.MAX_FILE_SIZE){
    return next(
      new ErrorResponse(
        400,
        `file must be less than ${process.env.MAX_FILE_SIZE} Byte`
      )
    );
  }

  // create a custom filename
  file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;
  
  const uploadFolder = `${process.env.FILE_UPLOAD_PATH}/bootcamps`
  // if folder doesn't exists then create it

  if(!existsSync(uploadFolder)){
    mkdirSync(uploadFolder)
  }
  file.mv(`${uploadFolder}/${file.name}`,async err => {
    if(err){
      console.error(err);
      return (
        next(
          new ErrorResponse(500,"We Could not upload your file")
        )
      )
    }

    await Bootcamp.findByIdAndUpdate(request.params.id,{photo:file.name})

    response.status(200).json({
      success:true,
      msg:"file Uploaded Successfully"
    })
  });
});


// @desc      DELETE A bootcamp
// @route     DELETE /bootcamps
// @access    Private
export const deleteBootcamps = asyncHandler(async (request, response, next) => {
  const bootcamp = await Bootcamp.findById(request.params.id);
  if (!bootcamp) {
    return next(
      new ErrorResponse(
        404,
        `Bootcamp with the id of ${request.params.id} Not found`
      )
    );
  }
  bootcamp.remove();
  response.status(200).json({
    success: true,
    msg: `deleted bootcamp with id of ${request.params.id}`,
  });
});
