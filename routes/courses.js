import express from 'express'
import {
    getCourses,
    getSingleCourse,
    createNewCourse,
    deleteCourse,
    updateCourse
}
    from '../controllers/courses.js'

const router = express.Router({ mergeParams:true })

router.route("/").get(getCourses).post(createNewCourse);

router
  .route("/:id")
  .get(getSingleCourse)
  .put(updateCourse)
  .delete(deleteCourse);  



export default router

