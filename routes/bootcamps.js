import express from 'express'
import {
    getBootcamps,
    getSingleBootcamps,
    createNewBootcamps,
    deleteBootcamps,
    updateBootcamps
}
    from '../controllers/bootcamps.js'

const router = express.Router()

router.route('/')
    .get(getBootcamps)
    .post(createNewBootcamps)

router.route('/:id')
    .get(getSingleBootcamps)
    .put(updateBootcamps)
    .delete(deleteBootcamps)  



export default router

