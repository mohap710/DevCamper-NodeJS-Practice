import mongoose from 'mongoose'

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
        formattedAdress:String,
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
    averageRating:{
        type: Number,
        min : [1,'Rating must be at least 1'],
        max : [10,'Rating must be at most 10']
    },
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
})

export default mongoose.model("Bootcamp",BootcampSchema)