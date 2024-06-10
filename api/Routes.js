const app=require('express')

const router=app.Router()

router.post("/",(req,res)=>{
    console.log("Done")
    res.send("Ok")
})
module.exports=router