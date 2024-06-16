const { types } = require("@babel/core");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    enum: ["male", "female", "other"],
  },
  verified: {
    type: Boolean,
    default: false,
  },
  dob: {
    type: String,
  },
  address: {
    type: String,
  },
  mobileNumber: {
    type: String,
    unique: true,
  },
  crushes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],

  receivedLike: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],

  matches: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],

  profileImages: [
    {
      type: String,
    },
  ],

  description: {
    type: String,
  },

  turnOns: [
    {
      type: String,
    },
  ],

  lookingFor: [
    {
      type: String,
    },
  ],

  profileGenerated:{
    type:Boolean,
    default:false
  },

  interests:{
    type:[String]
  },

  Likes:{
    type:[mongoose.Schema.Types.ObjectId]
  },

  Dislikes:{
    type:[mongoose.Schema.Types.ObjectId]
  },

  pendingLikes:{
    type:[mongoose.Schema.Types.ObjectId]
  },

  fcmToken: String, // Add this field to store FCM token

  age:{
    type:Number
  }
});

const User = mongoose.model("User", userSchema);
module.exports = User;
