import colors from 'colors'
import mongoose from 'mongoose'
import dotEnv from "dotenv";
dotEnv.config({ path: "./config/config.env" });

const mongoUri =
  process.env.NODE_ENV == "development"
    ? process.env.MONGO_URI
    : process.env.PROD_MONGO_URI

 const connectToDB = async () =>{
     const conn = await mongoose.connect(mongoUri, {
       useNewUrlParser: true,
     });
     console.log(`MonogoDB connected ${conn.connection.host}`.cyan.bold);
 }
 export default connectToDB;
