const usersService = require("../Services/UserServices");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const {
  UnauthorizedAccess,
} = require("../../ErrorHandler/Admin/AdminExceptions");
const userRole = require("../../Config/Config");
const mail = require("../../Mails/Mails");

dotenv.config();

module.exports.updateProfile = async (req, res, next) => {
  try {
    if (req.body.email || req.body.role) {
      throw new UnauthorizedAccess(
        ("Insufficient privileges to change email or role keys..", 403)
      );
    }
    delete req.body.picture;
    const email = req.data.email;
    const userProfile = await usersService.updateProfile(email, req.body);
    const userRoleCode = userRole.roles[userProfile.role];
    const id_token = jwt.sign(
      {
        ...userProfile,
        roleCode: userRoleCode,
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
    if (req.file) {
      req.body.picture = req.file.filename;
    }
    const email = req.data.email;
    const userProfile = await usersService.updateProfile(email, {
      picture: req.body.picture,
    });
    const userRoleCode = userRole.roles[userProfile.role];
    const id_token = jwt.sign(
      {
       ...userProfile,
        roleCode: userRoleCode,
      },
      process.env.CLIENT_SECRET
    );
    res.send(id_token);
  } catch (err) {
    next(err);
  }
};

module.exports.updatePrivileges = async (req, res, next) => {
  try {
    const email = req.params.email;
    const updatedData={
      ...(req.body.role&&{role:req.body.role}),
      ...(req.body.department&&{department:req.body.department._id})
    }
    const userProfile = await usersService.updatePrivileges(email,updatedData);
    if(updatedData.role){
    const userRoleCode = userRole.roles[userProfile.role];
    const id_token = jwt.sign(
      {
        ...userProfile,
        roleCode: userRoleCode,
      },
      process.env.CLIENT_SECRET
    );
    res.send(id_token);
    mail.sendMail(email, `Your role has been modified..`, {
			heading: `hello`,
			content: `Your role has been changed to ${req.body.role}.`,
			salutation: 'thank you',
			from: 'to the new team'
    });
  }else{
    res.send(updatedData);
    mail.sendMail(email, `You have been assigned a department,${req.body.department.department}`, {
			heading: `hello`,
			content: `You have been set up with a department,${req.body.department.department}`,
			salutation: 'thank you',
			from: 'to the new team'
    });
}
}catch (err) {
    next(err);
  }
};

module.exports.getUsers = async (req, res, next) => {
  const limitCount = req.query.limit;
  delete req.query.limit;
  const skipCount = req.query.skip;
  delete req.query.skip;
  if(req.query.department){
    const ObjectId = require('mongodb').ObjectId;
    req.query["department"] = new ObjectId( req.query["department"]);
  }
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

module.exports.followOrUnfollowUser = async (req, res, next) => {
  try {
    const email = req.data.email;
    const response = await usersService.followOrUnfollowUser(
      email,
      req.params.name,
      req.query.reverse
    );
    res.send(response);
  } catch (err) {
    console.log(err);
    next(err);
  }
};


module.exports.deleteUser = async (req, res) => {
  try {
    const email = req.params.email;
    const response = await usersService.deleteUser(email);
    res.send(response);
  } catch (err) {
    res.status(500).send(err);
  }
};
