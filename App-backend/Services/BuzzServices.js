const buzz  = require("../Models/BuzzModel");
const { ServerError} = require("../../ErrorHandler/Generic/GenericExceptions");
const {DataValidationFailed}=require('../../ErrorHandler/Buzz/BuzzExceptions');

module.exports.createBuzz=async(data)=>{
  const buzzFeed=new buzz(data);
 try{
  await buzzFeed.save();
  return buzzFeed;
 } 
 catch(err){
    if (err.name === 'ValidationError')
            {throw new DataValidationFailed(err.message, 500);}
    else
            {throw new ServerError("Error",500);}
 
}
}

module.exports.getAll = async (email,limit,skip) => {
  try{
  const allBuzz = await buzz.aggregate([
    {
        $addFields: {
            liked: { $in: [email, "$likedBy"] },
            disliked: { $in: [email, "$dislikedBy"] }
        }
    },
    {
        $project: {
            likedBy: 0,
            dislikedBy: 0
        }
    },
    {
        $sort: {
            createdOn: -1
        }
    },
    {
        $skip: skip
    },
    {
        $limit: limit
    }
]).exec();
  return allBuzz;}
  catch(err){
  
  }
};

module.exports.updateLikes=async({id},email,reverse)=>{
  try {
      if (reverse)
          await buzz.findByIdAndUpdate(id, {
              $inc: {
                  likes: -1
              },
              $pull: {
                  likedBy: email
              }
          });
      else
          await buzz.findByIdAndUpdate(id, {
              $inc: {
                  likes: 1
              },
              $push: {
                  likedBy: email
              },
          });
        return {success:true};
  } catch (err) {
  }
}

module.exports.updateDislikes=async({id},email,reverse)=>{
  try {
      if (reverse)
          await buzz.findByIdAndUpdate(id, {
              $inc: {
                  dislikes: -1
              },
              $pull: {
                  dislikedBy: email
              }
          });
      else
          await buzz.findByIdAndUpdate(id, {
              $inc: {
                  dislikes: 1
              },
              $push: {
                  dislikedBy: email
              },
          });
        return {success:true};
  } catch (err) {
  }
}

module.exports.delete= async () => {
  const response = await buzz.deleteMany({});
  return response;
};
