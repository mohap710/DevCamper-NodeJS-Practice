import mongoose from 'mongoose';
import slugify from "slugify";
import colors from "colors";
import { geocoder } from "../utils/geocoder.js"

const BootcampSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        unique: true,
        trim: true,
        maxlength: [50, 'Name cannot exceed 50 Characters']
    },
    slug: String,
    description: {
        type: String,
        required: [true, 'Description is required'],
        maxlength: [500, 'Description cannot exceed 500 Characters']
    },
    website: {
        type: String,
        required: true,
        match: [
            /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
            'Please enter a valid url'
        ]
    },
    email: {
        type: String,
        required: true,
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please enter a valid Email'
        ]
    },
    phone: {
        type: String,
            required: true,
                maxlength: [15, 'Phone number cannot exceed 15 Characters']
    },
    address:{
        type: String,
        required: [true,'Please enter an Address']
    },
    location: {
        type: {
            type: String, 
            enum: ['Point'],
            required: false
        },
        coordinates: {
            type: [Number],
            required: false,
            index : '2dsphere'
        },
        formattedAddress:String,
        street:String,
        city:String,
        state:String,
        zipcode:String,
        country:String,
    },
    careers:{
        type:[String],
        required:true,
        enum:[
            "Web Development",
            "Mobile Development",
            "UI/UX",
            "Business",
            "Data Science",
            "Others"
        ]
    },
    averageRating:Number,
    averageCost: Number,
    photo: {
        type: String,
        default: 'no-image.jpg'
    },
    housing: {
        type: Boolean,
        default: false
    },
    jobAssistance: {
        type: Boolean,
        default: false
    },
    jobGuarantee: {
        type: Boolean,
        default: false
    },
    acceptGi: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    user: {
    type: mongoose.Schema.ObjectId,
    ref:"User",
    required: true
  },
},{
    toJSON: { virtuals:true },
    toObject: { virtuals:true }
})

// Mongoose Middlewares ( Hooks )
// 1. Create a Slug
BootcampSchema.pre("save",function(next){
    this.slug = slugify(this.name,{ lower:true })
    next()
})

// 2. extract geo-location from string address

// BootcampSchema.pre("save",async function(next){
//     const loc = await geocoder.geocode(this.address)
//     this.location = {
//       type: {
//         type: "Point",
//       },
//       coordinates: [loc[0].longitude, loc[0].latitude],
//       formattedAddress: loc[0].formattedAddress,
//       street: loc[0].streetName,
//       city: loc[0].city,
//       state: loc[0].stateCode,
//       zipcode: loc[0].zipcode,
//       country: loc[0].countryCode,
//     };
//     this.address = undefined
//     next()
// })

// 3. Cascade Course after removing a bootcamp

BootcampSchema.pre("remove", async function(next){
    console.log(`Courses are being removed from ${this.name}`.red.bold);
    await this.model("Course").deleteMany({
        bootcamp:this._id
    })
    next();
})

// Reverse Populate with virtuals

BootcampSchema.virtual("courses", {
  ref: "Course",
  localField: "_id",
  foreignField: "bootcamp",
  justOne: false,
});
export default mongoose.model("Bootcamp",BootcampSchema)