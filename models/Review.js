import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema({
  title: {
    type: String,
    unique: false,
    required: [true, "Title is required"],
    trim: true,
    maxlength: [100, "Title cannot exceed 50 Characters"],
  },
  text: {
    type: String,
    required: [true, "Review is required"],
  },
  rating: {
    type: Number,
    min: [1, "rate has to be at least 1"],
    max: [5, "rate cannot be more than 5"],
    required: [true, "please add a rate between 1 - 5"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  bootcamp: {
    type: mongoose.Schema.ObjectId,
    ref: "Bootcamp",
    required: true,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
});

// A user can add one review per bootcamp
ReviewSchema.index({ bootcamp: 1, user: 1 },{ unique:true });

// Static Method to get course Tuition fees
ReviewSchema.statics.getAverageRating = async function (bootcampID) {
  const obj = await this.aggregate([
    {
      $match: { bootcamp: bootcampID },
    },
    {
      $group: {
        _id: "$bootcamp",
        averageRating: { $avg: "$rating" },
      },
    },
  ]);
  try {
    const bootcamp = await this.model("Bootcamp").findByIdAndUpdate(
      bootcampID,
      {
        averageRating: obj[0].averageRating,
      }
    );
        console.log(bootcamp, obj[0]);

  } catch (error) {
    console.error(error);
  }
}; 

// get Avg Reviews after adding a Review `bootcamp here means bootcamp Id`
ReviewSchema.post("save",function(){
  this.constructor.getAverageRating(this.bootcamp);
})
ReviewSchema.pre("remove",function(){
  this.constructor.getAverageRating(this.bootcamp);
})

export default mongoose.model("Review", ReviewSchema);
