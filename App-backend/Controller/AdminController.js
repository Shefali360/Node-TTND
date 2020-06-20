const {
  ServerError,
} = require("../../ErrorHandler/Generic/GenericExceptions");
const adminService = require("../Services/AdminServices");

module.exports.createAdmin = async (req, res, next) => {
  const myuserdata = req.data;
  req.body.email = myuserdata.email;
  try {
    const response = await adminService.createAdmin(req.body);
    res.send(response);
  } catch (err) {
    next(err);
  }
};

module.exports.getAdmin = async (req, res, next) => {
  try {
    const email = req.data.email;
    const response = await adminService.getAdmin(email);
    res.send(response);
  } catch (err) {
    return next(new ServerError("Error", 500));
  }
};

module.exports.delete = async (req, res) => {
  try {
    const response = await adminService.delete(req.params);
    res.send(response);
  } catch (err) {
    res.status(500).send(err);
  }
};
