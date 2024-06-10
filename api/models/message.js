const mongoose=require("mongoose")

const chatSchema=new mongoose.Schema({
    senderID:{
        type:String,
        required:true
    },

    receiverID:{
        type:String,
        required:true
    },

    message:{
        type:String,
        required:true
    },

    timeStamp:{
        type:Date,
        default:Date.now
    }
})

const Chat=mongoose.model("Chat",chatSchema)
module.exports=Chat