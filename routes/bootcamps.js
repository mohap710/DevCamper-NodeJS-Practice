import express from 'express'
import {
    getBootcamps,
    getSingleBootcamps,
    getBootcampsWithinRadius,
    createNewBootcamps,
    deleteBootcamps,
    updateBootcamps
}
    from '../controllers/bootcamps.js'

const router = express.Router()

router.route('/')
    .get(getBootcamps)
    .post(createNewBootcamps)

router.route("/radius/:zipcode/:distance").get(getBootcampsWithinRadius)

router.route('/:id')
    .get(getSingleBootcamps)
    .put(updateBootcamps)
    .delete(deleteBootcamps)  



export default router

