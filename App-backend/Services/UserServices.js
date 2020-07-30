const users = require("../Models/UserModel");
const { ServerError } = require("../../ErrorHandler/Generic/GenericExceptions");
const {
  DataValidationFailed,
} = require("../../ErrorHandler/Buzz/BuzzExceptions");
const {
  UnauthorizedAccess,
} = require("../../ErrorHandler/Admin/AdminExceptions");
const {DuplicateKey} = require('../../ErrorHandler/Validation/ValidationExceptions');

module.exports.createUser = async (data) => {
  const user=new users(data);
  try {
    await user.save();      
    return user;
  } catch (err) {
    if(err.name === "ValidationError") {
      throw new DataValidationFailed(err.message, 500);
    } else  if(err.code===11000){
      throw new DuplicateKey(err.message, 400);
    }else{
      throw new ServerError("Error", 500);
    }
  }
};

module.exports.updateProfile = async (email, updatedData) => {
  try {
    const update = await users.findOneAndUpdate(
      { email: email },
      { $set: updatedData },
      { new: true, runValidators: true }
    );
    return update.toJSON();
  } catch (err) {
    if (err.name === "ValidationError") {
      throw new DataValidationFailed(err.message, 500);
    } else {
      throw new ServerError("Error", 500);
    }
  }
};

module.exports.updatePrivileges = async (email,updatedData) => {
  try {
    const update = await users.findOneAndUpdate(
      {email:email},
      { $set:updatedData },
      { new: true, runValidators: true}
    );
    return update.toJSON();
  } catch (err) {
    if (err.name === "ValidationError") {
      throw new DataValidationFailed(err.message, 500);
    } else {
      throw new ServerError("Error", 500);
    }
  }
};

module.exports.getUsers = async (query, limit, skip) => {
  try {
    const pipeline=[
    {$match:query},
    {
      $lookup: {
        from: "departments",
        localField: "department",
        foreignField: "_id",
        as: "department",
      },
    },
    {
      $set: {
        department: { $arrayElemAt: ["$department", 0] },
      },
    },
    {
      $skip: skip,
    }
  ]
  if(limit) {
    pipeline.push({ $limit: limit });
  }
  const userData = await users.aggregate(pipeline).exec();
  return userData;

  } catch (err) {
    throw new ServerError("Error", 500);
  }
};


module.exports.getUserByEmail=async(email)=>{
  try {
    const response = await users.findOne({email:email});
    return response;
  } catch (err) {
    throw new ServerError("Error", 500);
  }
}


module.exports.followUser=async(email,mailId)=>{

  try {
         const response= await users.findOneAndUpdate({email}, {
              $push: {
                  followed:mailId
              }
          });
        return response;
  } catch (err) {
    console.log(err);
    throw new ServerError("Error", 500);
  }
}

module.exports.unfollowUser=async(email,mailId)=>{
 
  try {
         const response= await users.findOneAndUpdate({email}, {
              $pull: {
                  followed:mailId
              }
          });
        return response;
  } catch (err) {
    console.log(err);
    throw new ServerError("Error", 500);
  }
}


module.exports.deleteUser = async (email) => {
  try {
    const response = await users.deleteOne({
      email:email,
    });
    return response;
  } catch (err) {
    throw new ServerError("Error", 500);
  }
};
