import express from "express";
import dotEnv from "dotenv";
import connectToDB  from "./config/db.js";
import fileUpload from "express-fileupload";
import cookieParser from "cookie-parser";

// Routes
import bootcampRoutes from "./routes/bootcamps.js";
import courseRoutes from "./routes/courses.js";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js"
import reviewRoutes from "./routes/reviews.js"

// Middlewares
import { errorHandler } from "./middlewares/errorHandler.js";


// 1.Sanitize data for preventing NoSQL Injection
import mongoSanitize from "express-mongo-sanitize";

// 2. prevent XSS
import xssClean from "xss-clean";

// 3. Set Security Headers
import helmet from "helmet";

// 4. limit Rate of requests (100 request per 10min)
import { rateLimit } from "express-rate-limit";
const requestLimit = rateLimit({
    windowMs: 10 * 60 * 1000,
    max : 100
})

// 5. Prevent Params Pollution (HPP)
import hpp from "hpp";

// 6. Enable CORS ( Public APIs )
import cors from "cors";

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
  .use(mongoSanitize())
  .use(xssClean())
  .use(helmet())
  .use(requestLimit)
  .use(hpp())
  .use(cors())
  .use(fileUpload())
  .use(cookieParser())
  .use(express.static(path.join(__dirname, "/public")));

// Mounting Routes

app.use("/bootcamps", bootcampRoutes).use(errorHandler);
app.use("/courses", courseRoutes).use(errorHandler);
app.use("/auth", authRoutes).use(errorHandler);
app.use("/users", userRoutes).use(errorHandler);
app.use("/reviews", reviewRoutes).use(errorHandler);

const port = process.env.PORT || 7001;
app.listen(port, () => console.log(`Server running in ${process.env.NODE_ENV} mode and listening on port ${port}!`.bgGreen.black.bold))