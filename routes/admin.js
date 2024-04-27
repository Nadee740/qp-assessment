const express=require('express')
const router=express.Router()
const adminHandler=require('../handlers/admin')

router.get("/",(req,res)=>{
    res.send("Admin is Live !")
})


router.post("/create-grocery",adminHandler.CreateGrocery)

router.get("/grocery/:id",adminHandler.GetGroceryById)

router.get("/groceries",adminHandler.GetAllGroceries)

router.patch("/grocery/:id",adminHandler.UpdateGrocery)

router.delete("/grocery/:id",adminHandler.DeleteGrocery)

module.exports=router