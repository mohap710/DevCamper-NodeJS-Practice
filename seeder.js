import fs from "fs";
import mongoose from "mongoose";
import colors from "colors";
import dotenv from "dotenv";

// dirname in ES Module
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// Load env variables
dotenv.config({ path: "./config/config.env" });

// Load MongoDB models
import Bootcamp from "./models/Bootcamp.js";
import Course from "./models/Course.js";
import User from "./models/User.js";
import Review from "./models/Review.js";

// Connect to DB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
});

// Read Json files
const bootcamps = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/bootcamps.json`)
);
const courses = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/courses.json`)
);
const users = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/users.json`)
);
const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/reviews.json`)
);

// Import Data 
const importData = async() => {
    try {
        await Bootcamp.create(bootcamps)
        await Course.create(courses)
        await User.create(users)
        await Review.create(reviews)
        console.log("data Imported Successfully ...".bgGreen);
        process.exit()
    } catch (error) {
        console.error(error)
    }
}

// Destroy Data 
const destroyData = async() => {
    try {
        await Bootcamp.deleteMany()
        await Course.deleteMany()
        await User.deleteMany()
        await Review.deleteMany()
        console.log("data Destroyed Successfully ...".bgRed);
        process.exit()
    } catch (error) {
        console.error(error)
    }
}

if(process.argv[2] == "-i"){
    importData()
} else if(process.argv[2] == "-d"){
    destroyData()
} else{
    console.log(`
    Invalid option ${process.argv[2]} 
        Available Options:
        -i : Import Data,
        -d : Destroy Data
    `.red);
    process.exit()
}
