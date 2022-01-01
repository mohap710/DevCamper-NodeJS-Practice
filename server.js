import express from 'express'
import dotEnv from 'dotenv'
import connectToDB  from './config/db.js'
import bootcampRoutes from './routes/bootcamps.js'
import colors from 'colors'

dotEnv.config({ path: './config/config.env' })
connectToDB();
const app = express()
const port = process.env.PORT || 5000

// Mounting Routes

app.use('/bootcamps',bootcampRoutes)

app.listen(port, () => console.log(`Server running in ${process.env.NODE_ENV} mode and listening on port ${port}!`.bgGreen.black.bold))