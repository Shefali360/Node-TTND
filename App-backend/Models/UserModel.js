const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const role=require('../../Config/Config');
const roleArray=Object.keys(role.roles);
const departmentService=require('../Services/DepartmentServices');

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
        default:roleArray[0]
    },
    picture:{
        type:String,
        data:Buffer
    },
    department:{
        type:mongoose.Types.ObjectId,
        validate:{
            validator: async(id)=>{
                try{
                    const response=await departmentService.findDept({_id:id});
                    if(response){
                        return true;
                    }else{
                        return false;
                    }
            }
            catch(err){
            throw err;
            }
    }
        },
        message:'Invalid department value.'
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