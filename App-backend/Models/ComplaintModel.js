const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const validator=require('../../Utils/Utils');

const complaintSchema=new Schema({
    issueId:{
      type:String,
      required:true,
      immutable:true
    },
    department:{
      type:mongoose.Types.ObjectId,
        validate:{
            validator: validator.validatorFunc
        },
        message:'Invalid department value.'
    },
    issue:{
      type:String,
      enum:['Hardware','Infrastructure','Others'],
      default:'Hardware',
    },
    assignedTo:{
      type:String,
      required:true,
      validate:{
        validator: validator.validateAdmin
    },
    message:'Invalid assignedTo value.'
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
