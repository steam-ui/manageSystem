const express = require("express")
const app = express()
const manage = require("./manage")
app.use("./index",manage)
    // (req,res)=>{res.get(manage)}

module.exports = app