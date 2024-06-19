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
  
  age:{
    type:Number
  },

  occupation:{
    type:String
  },

  bio:{
    type:String
  },

  matches: {
    type:[mongoose.Schema.Types.ObjectId]
  },


  profileImages: [
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
});

const User = mongoose.model("User", userSchema);
module.exports = User;
