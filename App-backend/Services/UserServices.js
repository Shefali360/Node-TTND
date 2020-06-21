const users = require("../Models/UserModel");
const { ServerError } = require("../../ErrorHandler/Generic/GenericExceptions");
const {
  DataValidationFailed,
} = require("../../ErrorHandler/Buzz/BuzzExceptions");

module.exports.addOrUpdateUser = async (data) => {
  try {
    const response = await users.findOneAndUpdate(
      { email: data.email },
      { $setOnInsert: data },
      {
        upsert: true,
        setDefaultsOnInsert: true,
        new: true,
        runValidators: true,
      }
    );
    return response;
  } catch (err) {
    if (err.name === "ValidationError") {
      throw new DataValidationFailed(err.message, 500);
    } else {
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
    return update;
  } catch (err) {
    if (err.name === "ValidationError") {
      throw new DataValidationFailed(err.message, 500);
    } else {
      throw new ServerError("Error", 500);
    }
  }
};

module.exports.updateRole = async (email,updatedData) => {
  try {
    const update = await users.findOneAndUpdate(
      {email:email},
      { $set:updatedData },
      { new: true, runValidators: true }
    );
    return update;
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
