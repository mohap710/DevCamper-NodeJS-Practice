import Bootcamp from '../models/Bootcamps.js';
import { ErrorResponse } from '../utils/errorResponse.js';
// @desc      Get all bootcamps
// @route     GET /bootcamps
// @access    Public
export async function getBootcamps(_request, response, next) {
    try{
        const bootcamps = await Bootcamp.find();
        response
        .status(200)
        .json({ success: true, count:bootcamps.length,data: bootcamps  })
    } catch(error){
        response.status(204).json({ success: false })
    }
}

// @desc      Get all bootcamps
// @route     GET /bootcamps/:id
// @access    Public
export async function getSingleBootcamps(request, response, next) {
    try {
        const bootcamp = await Bootcamp.findById(request.params.id)
        if(!bootcamp){
            return next(
              new ErrorResponse(
                404,
                `Bootcamp with the id of ${request.params.id} Not found`
              )
            );
        }
        response
            .status(200)
            .json({ success: true, data: bootcamp })
    } catch (error) {
        next(
          new ErrorResponse(404,
            `Bootcamp with the id of ${request.params.id} Not found`
          )
        );
    }
    
}

// @desc      Create A new bootcamp
// @route     POST /bootcamps
// @access    Private
export async function createNewBootcamps (request, response, next) {
    try {
        const bootcamp = await Bootcamp.create(request.body)  
        response.status(201).json({ success: true, data: bootcamp })
    } catch (error) {
        response.status(400).json({
            success : false,
            msg: error.message
        })
    }
}

// @desc      Update A bootcamp
// @route     PUT /bootcamps
// @access    Private
export async function updateBootcamps(request, response, next) {
    try {
        const bootcamp = await Bootcamp.findByIdAndUpdate(request.params.id, request.body,{
            new :true,
            runValidators : true
        })
        if(!bootcamp){
            return response
                .status(204)
                .json({ success: false })
        }
        response
            .status(200)
            .json({ success: true, data: bootcamp })
    } catch (error) {
        response
            .status(400)
            .json({ success: false, message: error.message })    
    }
    
}

// @desc      DELETE A bootcamp
// @route     DELETE /bootcamps
// @access    Private
export async function deleteBootcamps(request, response, next) {
    try {
        const bootcamp = await Bootcamp.findByIdAndDelete(request.params.id)
        if(!bootcamp){
            return response
                .status(204)
                .json({ success: false, msg: `No such bootcamp with the id of ${request.params.id}` })  
        }
        response
            .status(200)
            .json({ success: true, msg: `deleted bootcamp with id of ${request.params.id}` })
    } catch (error) {
        response
            .status(400)
            .json({ success: false, msg: error.message })
    }
    
}