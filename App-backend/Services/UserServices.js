const users = require("../Models/UserModel");
const { ServerError } = require("../../ErrorHandler/Generic/GenericExceptions");
const {
  DataValidationFailed,
} = require("../../ErrorHandler/Buzz/BuzzExceptions");
const {DuplicateKey} = require('../../ErrorHandler/Validation/ValidationExceptions');

module.exports.createUser = async (data) => {
  const user=new users(data);
  try {
    await user.save();      
    return user.toJSON();
  } catch (err) {
    console.log(err);
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
      console.log(err);
      throw new ServerError("Error", 500);
    }
  }
};

module.exports.getUsers = async (query, limit, skip) => {
  try {
    const usersData = await users
      .find(query)
      .limit(limit ? limit : 0)
      .skip(skip ? skip : 0);
    return usersData;
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
