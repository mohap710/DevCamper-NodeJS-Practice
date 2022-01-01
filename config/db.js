import colors from 'colors'
import mongoose from 'mongoose'
 const connectToDB = async () =>{
     const conn = await mongoose.connect(process.env.MONGO_URI, {
         useNewUrlParser: true,
     })
     console.log(`MonogoDB connected ${conn.connection.host}`.bgGreen.black.bold);
 }
 export default connectToDB;
