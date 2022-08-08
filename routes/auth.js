import express from "express";
import { register,login,getMe } from "../controllers/auth.js";

// Middlewares
import { protect } from "../middlewares/auth.js";
const router = express.Router()

router.post("/register",register)
router.post("/login",login)
router.get("/me",protect,getMe)

export default router;