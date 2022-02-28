const express = require("express")
const app = express()
app.use(express.json())
app.use(express.urlencoded({extended:true}))
const db = require("./db")
const ru = require("./r")
app.use("/",ru)




app.listen(5000,console.log("running on port 1500"))