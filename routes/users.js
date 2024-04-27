const express=require('express')
const router=express.Router()
const userHandler=require('../handlers/users')

router.get("/",(req,res)=>{
    res.send("User is Live !")
})

router.get("/items",userHandler.GetAvailableItems)

router.post("/purchase-items",userHandler.PurchaseItems)

router.get('/purchase-history',userHandler.PurchaseHistory)

module.exports=router