const mongoose = require("mongoose")

const reviewsOfUserSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: "userInfo",
    required: true,
    // unique:true
  },
  reviews: [
    {
      text: { type: String, required: true },
      rating: { type: Number, min: 0, max: 10, default: 5 },
    },
  ],
})

const reviewsOfMediaSchema = new mongoose.Schema({
  mediaId: {
    type: String,
    required: true,
  },
  mediaType: {
    type: String,
    required: true,
  },
  content: [reviewsOfUserSchema],
})

const userInfoSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
)

// reviewsOfMediaSchema.index({mediaId:1,mediaType:1});

const userInfoModel = mongoose.model("userInfo", userInfoSchema)
const reviewsOfMediaModel = mongoose.model(
  "reviewsOfMedia",
  reviewsOfMediaSchema
)

module.exports = { userInfoModel, reviewsOfMediaModel }
