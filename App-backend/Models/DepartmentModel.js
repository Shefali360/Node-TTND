const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const departmentSchema=new Schema({
    department:{
        type:String,
        required:true,
        unique:true
    }
})

departmentSchema.pre('save', function(next) {
    this.department=this.department.toLowerCase();
    next();
}
  );

const dept=mongoose.model("Department",departmentSchema);

module.exports = dept;