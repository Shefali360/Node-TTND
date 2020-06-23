const departmentService = require("../App-backend/Services/DepartmentServices");
const userService = require("../App-backend/Services/UserServices");

module.exports.validatorFunc = async (id) => {
  try {
    const response = await departmentService.findDept({ _id: id });
    if (response) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    throw err;
  }
};

module.exports.validateAdmin = async (email) => {
    try{
    const response=await userService.getUserByEmail(email);
    if (response) {
        return true;
      } else {
        return false;
      }
    } catch (err) {
      throw err;
    }
};
