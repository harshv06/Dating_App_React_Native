const app = require("express");
const crypto = require("crypto");
const User = require("./models/user");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const path = require("path");
const multer = require("multer");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const { default: mongoose } = require("mongoose");

const router = app.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

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
  console.log(name, email, password, verified);
  const hashedPass = await bcrypt.hash(password, 10);
  const user = new User({
    name,
    email,
    password: hashedPass,
    verified,
  });

  try {
    await user.save();
    console.log("Registrartion Done");
    return res.status(200).send({ message: "Registered" });
  } catch (err) {
    console.log("Error:", err);
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

const generateSecretKey = () => {
  const secretKey = crypto.randomBytes(32).toString("hex");
  return secretKey;
};

const secretKey = generateSecretKey();

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).send({ error: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).send({ error: "Invalid Password" });
    }

    const profile = user.profileGenerated;
    const token = jwt.sign({ userId: user._id }, secretKey);
    return res.status(200).json({ token: token, profileGenerated: profile });
  } catch (err) {
    console.log("Error while logging: ", err);
    return res
      .status(500)
      .send({ error: "Failed to login please try again later" });
  }
});

router.put("/users/gender", async (req, res) => {
  const { gender, email } = req.body;

  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      res.status(500).json({ error: "Something went wrong" });
    }

    user.gender = gender;
    await user.save();
    res.status(200).json({ message: "Success" });
  } catch (err) {
    return res.status(500).send({ error: "Something went wrong" });
  }
});

router.post(
  "/users/profileData",
  upload.single("profilePic"),
  async (req, res) => {
    try {
      const { name, date, number, address, email, age } = req.body;
      const profilePic = req.file ? req.file.path : null;
      const existUser = await User.findOne({ email: email });
      // console.log(existUser)
      if (!existUser) {
        console.log("Something went wrong");
        res.status(500).send({ error: "Something went wrong" });
      }

      existUser.name = name;
      existUser.mobileNumber = number;
      existUser.address = address;
      existUser.dob = date;
      existUser.profileImages = profilePic;
      existUser.age = age;

      await existUser.save();
      console.log("Done");
      return res
        .status(200)
        .json({ message: "Profile uploaded successfully!" });
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: "Error uploading profile" });
    }
  }
);

router.post("/uploadInterests", async (req, res) => {
  const userinterests = req.body;
  const email = req.query.email;

  try {
    const updatedUser = await User.findOneAndUpdate(
      { email: email },
      { $set: { interests: userinterests, profileGenerated: true } },
      { new: true, upsert: true }
    );

    if (!updatedUser) {
      res.status(500).json({ error: "User not found" });
    } else {
      res.status(200).json({ message: "success" });
    }
  } catch (err) {
    console.log("Error: ", err);
  }
});

router.post("/fetchProfiles", async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email: email });
  if (!user) {
    res.status(500).json({ error: "No user found" });
  }
  const userinterests = user.interests;
  const likedProfiles = user.Likes;
  const dislikedProfiles = user.Dislikes;
  const pendingLikes = user.pendingLikes;

  const matchingUser = await User.find({
    email: { $ne: email },
    interests: { $in: userinterests },
    // _id:{$nin:[...likedProfiles,...dislikedProfiles,...pendingLikes]}
  });

  const profiles = matchingUser.map(
    ({ name, profileImages, interests, _id, age }) => ({
      name,
      profileImages,
      interests,
      _id,
      age,
    })
  );
  console.log(profiles);
  res.status(200).json({ message: "done", profile: profiles });
});

router.post("/saveFcmToken", async (req, res) => {
  const { email, fcmToken } = req.body;

  try {
    await User.updateOne({ email }, { fcmToken });
    res.status(200).json({ message: "FCM token saved successfully" });
  } catch (error) {
    console.error("Error saving FCM token:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

router.post("/handleLike", async (req, res) => {
  const { id, email } = req.body;
  const user = await User.findOne({ email: email });
  const user2 = await User.findById({ _id: id });
  if (!user && !user2) {
    res.status(500).json({ error: "Something went wrong" });
  } else {
    try {
      if (!user.Likes.includes(id) && !user2.pendingLikes.includes(user._id)) {
        // user.Likes.push(id);
        user2.pendingLikes.push(user._id);
        console.log(user2);
        await user.save();
        await user2.save();
        res.status(200).json({ message: "Done" });
      }
    } catch (err) {
      console.log("Error:", err);
    }
  }
});

router.post("/handledislike", async (req, res) => {
  const { id, email } = req.body;
  const user = await User.findOne({ email: email });
  if (!user) {
    res.status(500).json({ error: "Something went wrong" });
  } else {
    try {
      if (!user.Likes.includes(id)) {
        user.Dislikes.push(id);
        console.log(user);
        await user.save();
        res.status(200).json({ message: "Done" });
      }
    } catch (err) {
      console.log("Error:", err);
    }
  }
});

router.post("/fetchLikes", async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email: email });
  // const pendingLikes=user.pendingLikes.map((id)=>id.toString())
  const pendingLikes = user.pendingLikes;
  console.log(pendingLikes);
  res.status(200).send({ pendingLikes });
});

router.post("/fetchLikedProfilesInfo", async (req, res) => {
  const { id } = req.body;
  console.log(id);
  try {
    const objectId = id.map((item) => new mongoose.Types.ObjectId(item));
    const profiles = await User.find({ _id: { $in: objectId } });
    res.status(200).json({ profile: profiles, message: "Ok" });
  } catch (error) {
    console.log("error: ", error);
    res.status(500).send("Error fetching profiles");
  }
});

router.post("/createMatch", async (req, res) => {
  const { id } = req.body;
//   const objID = id.map((item) => new mongoose.Types.ObjectId(item));
const objID=new mongoose.Types.ObjectId(id[0]);
  console.log(objID);
  try {
    const user= await User.findOneAndUpdate({pendingLikes:objID},{$pull:{pendingLikes:objID},$addToSet:{matches:objID}},{new:true})
    console.log(user)
    if (!user) {
        console.log("user not found")
        return res.status(404).json({ message: "User not found or no pending likes" });
    }
    await user.save();
    res.status(200).json({ message: "Matched" });
  } catch (err) {
    console.log("Error:", err);
  }
});
module.exports = router;
