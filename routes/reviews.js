import express from "express";
import { getReviews, getReview, addReview,updateReview,deleteReview } from "../controllers/reviews.js";

import Review from "../models/Review.js";
// Middlewares
import { advancedQuery } from "../middlewares/advancedQuery.js";
import { protect, authorize } from "../middlewares/auth.js";

const router = express.Router({ mergeParams: true });
router.route("/")
  .get(
    advancedQuery(Review, [
        {
            path: "bootcamp",
            select: "name description",
        },
        {
            path:"user",
            select:"name"
        }
    ]),
    getReviews
  )
  .post(protect, authorize("user","admin"), addReview);

router
  .route("/:id")
  .get(getReview)
  .put(protect, authorize("user", "admin"), updateReview)
  .delete(protect, authorize("user", "admin"),deleteReview);

export default router;
