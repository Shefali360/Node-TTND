const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const role=require('../../Config/Config');
const roleArray=Object.keys(role.roles);

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
        enum:roleArray,
        default:'User'
    },
    picture:{
        type:String,
        data:Buffer
    },
    department:{
        type:mongoose.Types.ObjectId
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