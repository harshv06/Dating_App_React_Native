const app = require("express");
const crypto = require("crypto");
const User = require("./models/user");
const nodemailer = require("nodemailer");
require("dotenv").config();

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
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("User already exists");
      return res.status(400).json({ message: "User already exist" });
    }

    const user = new User({
      name,
      email,
      password,
    });

    user.verificationToken = crypto.randomBytes(20).toString("hex");
    await user.save();

    sendVerificationEmail(user.email, user.verificationToken);
  } catch (error) {
    console.log("Error while registering");
    res.status(500).json({ message: "Registration Failed" });
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
    console.log(user)
    return res.status(200).send({ message: "Mail Sent To User", data: user });
  } catch (err) {
    console.log("Failed to send mail:", err);
    return res.status(500).send({ error: "Failed to send mail" });
  }
});

module.exports = router;
