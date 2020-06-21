const usersService = require("../Services/UserServices");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const {UnauthorizedAccess} = require("../../ErrorHandler/Admin/AdminExceptions");
const userRole=require('../../Config/Config');

dotenv.config();

module.exports.updateProfile = async (req, res, next) => {
  try {
    if(req.body.email||req.body.role){
      throw new UnauthorizedAccess(("Insufficient privileges to change email or role keys..",403));
    }
    delete req.body.picture;
    const email=req.data.email;
    const userProfile=await usersService.updateProfile(email,req.body);
    const userRoleCode=userRole.roles[userProfile.role];
    const id_token = jwt.sign(
      {
        name: userProfile.name,
        email: userProfile.email,
        picture:userProfile.picture,
        role: userProfile.role,
        roleCode:userRoleCode
      },
      process.env.CLIENT_SECRET
    );
    res.send(id_token);
  } catch (err) {
    next(err);
  }
};

module.exports.updateProfilePicture = async (req, res, next) => {
  try {
    if(req.file){
      req.body.picture=req.file.path;
   }
    const email=req.data.email;
    const userProfile=await usersService.updateProfile(email,{picture:req.body.picture});
    const userRoleCode=userRole.roles[userProfile.role];
    const id_token = jwt.sign(
      {
        name: userProfile.name,
        email: userProfile.email,
        picture:userProfile.picture,
        role: userProfile.role,
        roleCode:userRoleCode
      },
      process.env.CLIENT_SECRET
    );
    res.send(id_token);
  } catch (err) {
    next(err);
  }
};

module.exports.updateRole = async (req, res, next) => {
  try {
    const userProfile=await usersService.updateRole(req.params.id,req.params.role);
    const userRoleCode=userRole.roles[userProfile.role];
    const id_token = jwt.sign(
      {
        name: userProfile.name,
        email: userProfile.email,
        picture:userProfile.picture,
        role: userProfile.role,
        roleCode:userRoleCode
      },
      process.env.CLIENT_SECRET
    );
    res.send(id_token);
  } catch (err) {
    next(err);
  }
};

module.exports.getUsers = async (req, res, next) => {
  const limitCount = req.query.limit;
  delete req.query.limit;
  const skipCount = req.query.skip;
  delete req.query.skip;
  try {
    const response = await usersService.getUsers(
      req.query,
      Number(limitCount),
      Number(skipCount)
    );
    res.send(response);
  } catch (err) {
    next(err);
  }
};

module.exports.deleteUser = async (req, res) => {
  try {
    const response = await usersService.deleteUser(req.params);
    res.send(response);
  } catch (err) {
    res.status(500).send(err);
  }
};
