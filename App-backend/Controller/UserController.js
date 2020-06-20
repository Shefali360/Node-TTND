const usersService = require("../Services/UsersServices");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

module.exports.addOrUpdateUser = async (req, res, next) => {
  const myuserdata = req.data;
  try {
    const response = await usersService.addOrUpdateUser(myuserdata);
    res.send(response);
  } catch (err) {
    next(err);
  }
};

module.exports.updateProfile = async (req, res, next) => {
  try {
    const userProfile=await usersService.updateProfile(req.params, req.body);
    const id_token = jwt.sign(
      {
        name: userProfile.name,
        email: userProfile.email,
        picture: userProfile.picture,
        role: userProfile.role,
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
    const id_token = jwt.sign(
      {
        name: userProfile.name,
        email: userProfile.email,
        picture: userProfile.picture,
        role: userProfile.role,
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
