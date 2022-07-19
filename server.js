import express from 'express'
import dotEnv from 'dotenv'
import connectToDB  from './config/db.js'
import bootcampRoutes from './routes/bootcamps.js'
import { errorHandler } from './middlewares/errorHandler.js'

dotEnv.config({ path: './config/config.env' })
connectToDB();
const app = express()

// Middlewares
app
.use(express.json())



const port = process.env.PORT || 5000

// Mounting Routes

app.use("/bootcamps", bootcampRoutes).use(errorHandler);

app.listen(port, () => console.log(`Server running in ${process.env.NODE_ENV} mode and listening on port ${port}!`.bgGreen.black.bold))