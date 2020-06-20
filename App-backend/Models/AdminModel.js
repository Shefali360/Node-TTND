const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const adminSchema=new Schema({
    email:{
        type:String,
        lowercase:true,
        required:true,
        unique:true,
        immutable:true
    }
})

const admin=mongoose.model("Admin",adminSchema);


module.exports = admin;