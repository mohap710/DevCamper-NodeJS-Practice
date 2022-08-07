import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Add a name"],
    trim: true,
  },
  email: {
    type: String,
    required: [true,"Please add an email."],
    unique:true,
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please enter a valid Email",
    ],
  },
  password:{
    type:String,
    required:[true,"Please enter a password"],
    minLength:[6,"Password can not be less than 6 characters"],
    select:false
  },
  role:{
    type:String,
    enum:["user","publisher"],
    default:"user"
  },
  resetPasswordToken:String,
  resetPasswordExpire:Date,
  createdAt:{
    type:Date,
    default:Date.now
  }
});

// Hash Password using bcrypt
UserSchema.pre("save", async function(next){
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
})

// Sign JWT
UserSchema.methods.signJWT = function(){
  return jwt.sign({id:this._id},process.env.JWT_SECRET,{
    expiresIn:process.env.JWT_EXPIRE
  })
}

// Check if entered password matches the hashed Password
UserSchema.methods.comparePassword = async function(enteredPassword){
  return await bcrypt.compare(enteredPassword,this.password);
}

export default mongoose.model("User", UserSchema);