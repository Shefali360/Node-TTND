const  admin  = require("../Models/AdminModel");
const { ServerError } = require("../../ErrorHandler/Generic/GenericExceptions");
const { DataValidationFailed } = require("../../ErrorHandler/Buzz/BuzzExceptions");

module.exports.createAdmin = async (data) => {
  const adminRole = new admin(data);
  try {
    await adminRole.save();
    return adminRole;
  } catch (err) {
    if (err) {
      throw new DataValidationFailed("Duplicate email entered", 400,err.errmsg);
    } else {
      throw new ServerError("Error", 500);
    }
  }
};

module.exports.getAdmin = async (email) => {
  try{
    const adminPresent = await admin.findOne({ email: email });
  if (adminPresent !== null){ return true;}
  else{ return false;}
}
  catch{
    throw new ServerError("Error", 500);
  }
};

module.exports.delete = async ({ id }) => {
  const response = await admin.deleteOne({
    _id: id,
  });
  return response;
};
