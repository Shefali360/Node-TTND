const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const buzzSchema = new Schema({
  description: {
    type:String,
    required: true,
  },
  category: {
    type:String,
    enum:['Activity buzz','Lost and Found buzz'],
    default:'Activity buzz',
  },
  images:[{
    type:String,
    data:Buffer
  }],
  likes: {
    type: Number,
    default:0
  },
  dislikes:{
      type:Number,
      default:0
  },
  likedBy:{
      type:[String],
      default:[]
  },
  dislikedBy:{
    type:[String],
    default:[]
  },
  userId:{
      type:String,
      required:true,
      lowercase:true,
      immutable:true
  },
  createdOn:{
    type:Number,
    required:true
  }
});

const buzz= mongoose.model("Buzz", buzzSchema);

module.exports = buzz;
