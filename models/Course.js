import mongoose from "mongoose";

const CourseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
    unique: true,
    trim: true,
    maxlength: [50, "Title cannot exceed 50 Characters"],
  },
  description: {
    type: String,
    required: [true, "Description is required"],
    maxlength: [500, "Description cannot exceed 500 Characters"],
  },
  weeks: {
    type: Number,
    required: [true, "please add number of weeks"],
  },
  tuition: {
    type: Number,
    required: [true, "please add tuition fees"],
  },
  minimumSkill: {
    type: String,
    required: [true, "Please add a minimum Skills"],
    enum: ["beginner", "intermediate", "advanced"],
  },
  scholarhipsAvailable: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  bootcamp: {
    type: mongoose.Schema.ObjectId,
    ref:"Bootcamp",
    required: true
  },
});

// Static Method to get course Tuition fees
CourseSchema.statics.getAverageCost = async function(bootcampID){
  const obj = await this.aggregate([
    {
      $match: { bootcamp: bootcampID },
    },
    {
      $group: {
        _id: "$bootcamp",
        averageCost: { $avg: "$tuition" },
      },
    },
  ]);
  try {
    await this.model("Bootcamp").findByIdAndUpdate(bootcampID,
       { averageCost: obj[0].averageCost }
    );
  } catch (error) {
    console.error(error);
  }
} 

// get Avg cost after adding a course `bootcamp here means bootcamp Id`
CourseSchema.post("save",function(){
  this.constructor.getAverageCost(this.bootcamp)
})

// get Avg cost before deleting a course `bootcamp here means bootcamp Id`
CourseSchema.pre("delete", function () {
  this.constructor.getAverageCost(this.bootcamp)
});
export default mongoose.model("Course", CourseSchema);
