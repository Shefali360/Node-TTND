const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const complaintSchema=new Schema({
    issueId:{
      type:String,
      required:true,
      immutable:true
    },
    department:{
      type:String,
      enum:['Admin','IT','HR','Infra'],
      default:'Admin',
    },
    issue:{
      type:String,
      enum:['Hardware','Infrastructure','Others'],
      default:'Hardware',
    },
    name:{
      type:String,
      required:true,
      immutable:true
    },
    assignedTo:{
      type:String,
      required:true,
      immutable:true
    },
    lockedBy:{
      type:String,
      required:true,
      immutable:true
    },
    email:{
      type:String,
      lowercase:true,
      required:true,
      immutable:true
    },
    concern:{
      type:String,
      required:true
    },
    files:[{
      type:String,
      data:Buffer
    }],
    status:{
      type:String,
      enum:['Open','In Progress','Closed'],
      default:'Open'
    },
    timestamp:{
      type:Number,
      immutable:true
    },
    estimatedTime:{
      count:{
        type:Number,
        default:0
      },
      timeType:{
        type:String,
        enum:['hours','days','weeks','months'],
        default:'hours'
      }
    }
})

const complaint=mongoose.model("Complaints",complaintSchema);

module.exports = complaint;
