import express from 'express'
import {
    getCourses,
    getSingleCourse,
    createNewCourse,
    deleteCourse,
    updateCourse
}
    from '../controllers/courses.js'

import Course from '../models/Course.js';
// Middlewares
import { advancedQuery } from '../middlewares/advancedQuery.js';
import { protect,authorize } from "../middlewares/auth.js"

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
  .post(protect, authorize("publisher","admin"), createNewCourse);

router
  .route("/:id")
  .get(getSingleCourse)
  .put(protect, authorize("publisher","admin"), updateCourse)
  .delete(protect, authorize("publisher","admin"), deleteCourse);  



export default router

