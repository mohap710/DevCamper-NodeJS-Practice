import express from "express";
import {
  getBootcamps,
  getSingleBootcamps,
  getBootcampsWithinRadius,
  createNewBootcamps,
  deleteBootcamps,
  updateBootcamps,
  uploadBootcampPhoto,
} from "../controllers/bootcamps.js";
import Bootcamp from "../models/Bootcamp.js";
// Middlewares
import { advancedQuery } from "../middlewares/advancedQuery.js";
import { protect,authorize } from "../middlewares/auth.js"

// Include other resources Routers
import coursesRouter from "./courses.js";
import reviewsRouter from "./reviews.js";

const router = express.Router();

// Re-route to other resources
router.use("/:bootcampId/courses", coursesRouter);
router.use("/:bootcampId/reviews", reviewsRouter);

// Bootcamps Routes
router
  .route("/")
  .get(advancedQuery(Bootcamp, "courses"), getBootcamps)
  .post(protect, authorize("publisher", "admin"), createNewBootcamps);

router.route("/radius/:zipcode/:distance").get(getBootcampsWithinRadius);

router.route("/:id/photo").put(protect, authorize("publisher","admin"), uploadBootcampPhoto);

router
  .route("/:id")
  .get(getSingleBootcamps)
  .put(protect, authorize("publisher","admin"), updateBootcamps)
  .delete(protect, authorize("publisher","admin"), deleteBootcamps);

export default router;
