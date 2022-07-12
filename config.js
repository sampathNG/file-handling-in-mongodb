require('dotenv').config()
const mongoose = require("mongoose");
module.exports = mongoose.connect(process.env.URL,({useNewUrlParser:true}),err=>{
    console.log("connected to mognodb")
})
