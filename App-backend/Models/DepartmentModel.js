const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const departmentSchema=new Schema({
    department:{
        type:String,
        required:true
    }
})

const dept=mongoose.model("Department",departmentSchema);

module.exports = dept;