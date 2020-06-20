const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const usersSchema=new Schema({
    email:{
        type:String,
        lowercase:true,
        required:true,
        unique:true,
        immutable:true
    },
    name:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:['SuperAdmin','Admin','User'],
        default:'User'
    },
    picture:{
        type:String,
        data:Buffer
    },
    department:{
        type:String
    },
    dob:{
        type:Date
    },
    phone:{
        type:Number
    }
})

const users=mongoose.model("Users",usersSchema);


module.exports = users;