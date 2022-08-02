import { ErrorResponse } from "../utils/errorResponse.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { geocoder } from "../utils/geocoder.js";
import Bootcamp from "../models/Bootcamp.js";

// @desc      Get all bootcamps
// @route     GET /bootcamps
// @access    Public
export const getBootcamps = asyncHandler(async (request, response, next) => {
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
  query = Bootcamp.find(JSON.parse(queryStr)).populate({
    path:"courses",
    select:"title"
  });

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
  const page = parseInt(request.query.page, 10) || 1;
  const limit = parseInt(request.query.limit, 10) || 10;
  const firstIndex = (page - 1) * limit
  let lastIndex = page * limit
  const total = await Bootcamp.countDocuments()

  query = query.skip(firstIndex).limit(limit);
  const pagination = {}
  if(lastIndex > total){
    lastIndex = total
  }
  pagination.perPage = `Showing Data from ${firstIndex+1} to ${lastIndex}`
  if(firstIndex > 0){
    pagination.prevPage = page - 1 
  }
  if(lastIndex < total){
    pagination.nextPage = page + 1 
  }


  const bootcamps = await query;
  response
    .status(200)
    .json({ success: true, count: total, pagination , data: bootcamps });
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
