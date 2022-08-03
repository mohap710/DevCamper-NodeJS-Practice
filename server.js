import express from "express";
import dotEnv from "dotenv";
import connectToDB  from "./config/db.js";
import fileUpload from "express-fileupload";

// Routes
import bootcampRoutes from "./routes/bootcamps.js";
import courseRoutes from "./routes/courses.js";
// Middlewares
import { errorHandler } from "./middlewares/errorHandler.js";

// dirname in ES Module
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotEnv.config({ path: "./config/config.env" })
connectToDB();
const app = express()

// Middlewares
app
.use(express.json())
.use(fileUpload())
.use(express.static(path.join(__dirname,"/public")))



const port = process.env.PORT || 5000

// Mounting Routes

app.use("/bootcamps", bootcampRoutes).use(errorHandler);
app.use("/courses", courseRoutes).use(errorHandler);

app.listen(port, () => console.log(`Server running in ${process.env.NODE_ENV} mode and listening on port ${port}!`.bgGreen.black.bold))