import express from "express";
import {
  getUsers,
  getUser,
  createUser,
  deleteUser,
  updateUser,
} from "../controllers/users.js";
import User from "../models/User.js";
// Middlewares
import { advancedQuery } from "../middlewares/advancedQuery.js";
import { protect, authorize } from "../middlewares/auth.js";

const router = express.Router();
router.use(protect);
router.use(authorize("admin"));

router.route("/").get(advancedQuery(User), getUsers).post(createUser);
router.route("/:id").get(getUser).put(updateUser).delete(deleteUser);

export default router;
