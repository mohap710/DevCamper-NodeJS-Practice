import express from 'express'
import {
    getBootcamps,
    getSingleBootcamps,
    getBootcampsWithinRadius,
    createNewBootcamps,
    deleteBootcamps,
    updateBootcamps
}
    from '../controllers/bootcamps.js';

// Include other resources Routers
import coursesRouter from "./courses.js";
    
const router = express.Router()

// Re-route to other resources
router.use("/:bootcampId/courses", coursesRouter);

// Bootcamps Routes
router.route('/')
    .get(getBootcamps)
    .post(createNewBootcamps)

router.route("/radius/:zipcode/:distance").get(getBootcampsWithinRadius)

router.route('/:id')
    .get(getSingleBootcamps)
    .put(updateBootcamps)
    .delete(deleteBootcamps)  



export default router

