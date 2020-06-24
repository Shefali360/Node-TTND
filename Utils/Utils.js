const departmentService = require("../App-backend/Services/DepartmentServices");

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

