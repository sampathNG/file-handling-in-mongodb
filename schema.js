const mongoose = require("mongoose")


const imgSchema = new mongoose.Schema({
    _id:{
        type:Number,
        required:true
    },
    img:{
        data:Buffer,
        contentType:String
    }
})

const model = mongoose.model("images",imgSchema)
module.exports = model