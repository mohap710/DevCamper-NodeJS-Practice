import express from 'express'
import {
    getBootcamps,
    getSingleBootcamps,
    getBootcampsWithinRadius,
    createNewBootcamps,
    deleteBootcamps,
    updateBootcamps,
    uploadBootcampPhoto
}
    from '../controllers/bootcamps.js';
// Advanced Query Middleware
import Bootcamp from '../models/Bootcamp.js';
import { advancedQuery } from '../middlewares/advancedQuery.js';

// Include other resources Routers
import coursesRouter from "./courses.js";
    
const router = express.Router()

// Re-route to other resources
router.use("/:bootcampId/courses", coursesRouter);

// Bootcamps Routes
router.route('/')
    .get(advancedQuery(Bootcamp,"courses"),getBootcamps)
    .post(createNewBootcamps)

router.route("/radius/:zipcode/:distance").get(getBootcampsWithinRadius)

router.route("/:id/photo").put(uploadBootcampPhoto)

router.route('/:id')
    .get(getSingleBootcamps)
    .put(updateBootcamps)
    .delete(deleteBootcamps)  



export default router

