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


module.exports.getBuzz = async (email,query,limit,skip) => {
  try{
    const pipeline=[
        {$match:query},
        {
            $addFields: {
                liked: { $in: [email, "$likedBy"] },
                disliked: { $in: [email, "$dislikedBy"] }
            }
        },
        {
            $lookup:{
                from:"users",
                localField:"userId",
                foreignField:"email",
                as:"user"
            }
        },
        {
            $set:{
              user:{$arrayElemAt:['$user',0]}
            }
          },
        {
            $project: {
                likedBy: 0,
                dislikedBy: 0,
                user: {
                    _id:0,
                    __v:0,
                    dob:0,
                    phone:0,
                    role:0,
                    department:0
                }   
            }
        },
        {
            $sort: {
                createdOn: -1
            }
        },
        {
            $skip: skip
        }
    ];

    if(limit){
        pipeline.push({$limit:limit})
    }
const allBuzz = await buzz.aggregate(pipeline).exec();
  return allBuzz;
}
  catch(err){
    throw new ServerError("Error", 500);
  }
};

module.exports.getBuzzById=async({id})=>{
    try{
      const response=await buzz.findById({_id:id});
      return response;
    }catch(err){
      throw new ServerError("Error", 500);
    }
  }

module.exports.updateBuzz=async({id},updatedData)=>{
    try {
        const response = await buzz.findOneAndUpdate({_id:id},{$set:updatedData},{new:true,runValidators:true});
        return response;
}catch(err){
    if (err.name === "ValidationError") {
        throw new DataValidationFailed(err.message, 500);
      } else {
        throw new ServerError("Error", 500);
      }
}
}

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
    throw new ServerError("Error", 500);
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
    throw new ServerError("Error", 500);
  }
}

module.exports.delete= async ({id}) => {
  try{
      const response = await buzz.deleteOne({_id:id});
  return response;
  }catch(err){
    throw new ServerError("Error", 500);
  }
};
