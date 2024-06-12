const app = require("express");
const crypto = require("crypto");
const User = require("./models/user");
const bcrypt = require('bcrypt');
const nodemailer = require("nodemailer");
require("dotenv").config();
const jwt=require("jsonwebtoken")

const router = app.Router();

const sendVerificationEmail = async (email, token) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: false,
    auth: {
      user: process.env.USER,
      pass: process.env.PASS,
    },
  });

  const mailOption = {
    from: "matchmake.com",
    to: email,
    subject: "Email Verification",
    text: `Please click on the following link to verify your email: http://192.168.0.105:3000/verify/${token}`,
  };

  try {
    console.log(process.env.USER);
    await transporter.sendMail(mailOption);
  } catch (error) {
    console.log("Error while sending email", error);
  }
};

router.post("/register", async (req, res) => {
  const { name, email, password, verified } = req.body;
  console.log(name,email,password,verified)
  const hashedPass=await bcrypt.hash(password,10)
  const user = new User({
    name,
    email,
    password:hashedPass,
    verified,
  });


  try {
    await user.save();
    console.log("Registrartion Done")
    return res.status(200).send({ message: "Registered" });
  } catch (err) {
    console.log("Error:",err)
    return res.send(err);
  }
});

router.post("/verify", async (req, res) => {
  const { name, email, password } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ email: email });
  if (existingUser) {
    console.log("User Already Exists");
    return res.status(500).send({ error: "User Already Exists" });
  }

  try {
    console.log("Generating verification code");
    let verificationCode = Math.floor(100000 + Math.random() * 900000);
    let user = [name, email, password, verificationCode];
    await sendVerificationEmail(email, verificationCode);
    console.log(user);
    return res.status(200).send({ message: "Mail Sent To User", data: user });
  } catch (err) {
    console.log("Failed to send mail:", err);
    return res.status(500).send({ error: "Failed to send mail" });
  }
});

const generateSecretKey=()=>{
  const secretKey=crypto.randomBytes(32).toString("hex")
  return secretKey
}

const secretKey=generateSecretKey()

router.post("/login",async(req,res)=>{
  const {email,password}=req.body
  try{
    const user=await User.findOne({email:email})
    if(!user){
      return res.status(400).send({error:"Invalid email or password"})
    }

    const isPasswordValid=await bcrypt.compare(password,user.password)

    if(!isPasswordValid){
      return res.status(400).send({error:"Invalid Password"})
    }
    const token=jwt.sign({userId:user._id},secretKey)
    // console.log("here",token)
    return res.status(200).json({token})
  }catch(err){
    console.log("Error while logging: ",err)
    return res.status(500).send({error:"Failed to login please try again later"})
  }
})

router.put("/users/:userID/gender",async(req,res)=>{
  const {gender}=req.body
  const {userID}=req.params

  try{
    const user=await User.findByIdAndUpdate(userID,{gender:gender},{new:true})
    if(!user){
      return res.status(500).send({error:"User not found by id"})
    }
    return res.status(200).send({message:"Gender updated"})
  }catch(err){
    return res.status(500).send({error:"Something went wrong"})
  }
})

module.exports = router;
