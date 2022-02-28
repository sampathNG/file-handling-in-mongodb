const mongoose = require("mongoose")
const url = "mongodb://localhost/multer"
module.exports = mongoose.connect(url,({useNewUrlParser:true}),err=>{
    console.log("connected to mognodb shell")
})
