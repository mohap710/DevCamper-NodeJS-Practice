import express from 'express'
import {
    getCourses,
    getSingleCourse,
    createNewCourse,
    deleteCourse,
    updateCourse
}
    from '../controllers/courses.js'

// Advanced query Middleware
import Course from '../models/Course.js';
import { advancedQuery } from '../middlewares/advancedQuery.js';

const router = express.Router({ mergeParams:true })

router
  .route("/")
  .get(
    advancedQuery(Course,
    {
      path: "bootcamp",
      select: "name description",
    }),
    getCourses
  )
  .post(createNewCourse);

router
  .route("/:id")
  .get(getSingleCourse)
  .put(updateCourse)
  .delete(deleteCourse);  



export default router

