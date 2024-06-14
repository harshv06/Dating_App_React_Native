const express = require("express")
const bodyParser=require("body-parser")
const mongoose=require("mongoose")
const crypto=require("crypto")
const nodemailer=require("nodemailer")
const path=require('path')
const fs=require('fs')
require('dotenv').config()

const app=express()
const port=3000
const cors=require("cors")
app.use(cors())
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())
const jwt= require("jsonwebtoken")
const router=require("./Routes")
app.use(router)

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

mongoose.connect("mongodb+srv://surveyshigh:surveysHigh@cluster0.hidbbic.mongodb.net/").then(()=>{
    console.log("Connected to Mongo")
}).catch((error)=>{
    console.log("Falied to connect Mongo ",error)
})

app.listen(port,()=>{
    console.log("Server Running")
})