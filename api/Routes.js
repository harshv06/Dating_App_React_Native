const app=require('express')
const crypto=require("crypto")
const User=require("./models/user")
const nodemailer=require('nodemailer')
require("dotenv").config()

const router=app.Router()

const sendVerificationEmail=async(email,token)=>{
    const transporter=nodemailer.createTransport({
        service:'gmail',
        auth:{
            user:process.env.USER,
            pass:process.env.PASS
        }
    })

    const mailOption={
        from:'matchmake.com',
        to:email,
        subject:"Email Verification",
        text:`Please click on the following link to verify your email: http://localhost:3000/verify/${token}`
    }

    try{
        await transporter.sendMail(mailOption)

    }catch(error){
        console.log("Error while sending email")
    }
}

router.post("/register",async(req,res)=>{
    try{
        const {name,email,password}=req.body
        const existingUser=await User.findOne({email})
        if(existingUser){
            res.status(400).json({message:"User already exist"})
        }

        const user=new User({
            name,
            email,
            password
        })

        user.verificationToken=crypto.randomBytes(20).toString("hex")
        await user.save()

        sendVerificationEmail(user.email,user.verificationToken)
    }catch(error){
        console.log("Error while registering")
        res.status(500).json({message:"Registration Failed"})
    }
})
module.exports=router