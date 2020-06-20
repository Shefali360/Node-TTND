const axios = require("axios");
const { InvalidFileFormat } = require("../../ErrorHandler/Buzz/BuzzExceptions");
const {
  invalidTokenError,
  authHeadersAbsent,
  invalidAuthHeaderFormat,
  authTokenAbsent,
} = require("../../ErrorHandler/Auth/AuthExceptions");
const { ServerError } = require("../../ErrorHandler/Generic/GenericExceptions");
const multer = require("multer");
const {getAdmin}=require("../../App-backend/Services/AdminServices");
const {UnauthorizedAccess}=require('../../ErrorHandler/Admin/AdminExceptions');
const jwt=require("jsonwebtoken");

module.exports.verifyTokenMiddleware = async (req, res, next) => {
  
  try {
    if (!req.headers["authorization"]) {
      return next(
        new authHeadersAbsent("Authorization headers are absent", 401)
      );
    }

    const tokenType = req.headers["authorization"].split(",")[0];
    const accessToken=tokenType.split(" ")[0];
    if (accessToken !== "Bearer") {
      return next(
        new invalidAuthHeaderFormat("Auth token should be of Bearer type", 401)
      );
    }
    const accessTokenValue =tokenType.split(" ")[1];
    if (!accessTokenValue) {
      return next(new authTokenAbsent("Auth token is not provided"), 401);
    }
    try {
      await axios.get(
        "https://oauth2.googleapis.com/tokeninfo" +
          `?access_token=${accessTokenValue}`
      );
      return next();
    } catch (err) {
      return next(
        new invalidTokenError(
          "Invalid token received",
          401,
          err.response.data
        )
      );
    }
  } catch {
    return next(new ServerError("Error", 500));
  }
};

module.exports.verifyTokenToGetUserData = async (req, res, next) => {
  try {
    if (!req.headers["authorization"]) {
      return next(
        new authHeadersAbsent("Authorization headers are absent", 401)
      );
    }
    const tokenType = req.headers["authorization"].split(",")[1];
    const idToken=tokenType.split(" ")[0];
    if (idToken !== "Bearer") {
      return next(
        new invalidAuthHeaderFormat("Auth token should be of Bearer type", 401)
      );
    }
    const idTokenValue = tokenType.split(" ")[1];
    if (!idTokenValue) {
      return next(new authTokenAbsent("Auth token is not provided"), 401);
    }

    try {
      req.data = jwt.verify(idTokenValue, process.env.CLIENT_SECRET);
      return next();
    } catch (err) {
      return next(
        new invalidTokenError(
          "Invalid id token received",
          401,
          err.response.data
        )
      );
    }
  } catch {
    return next(new ServerError("Error"), 500);
  }
};

module.exports.imageStorage = multer.diskStorage({
  destination: function (req, files, callback) {
    callback(null, "./Images/");
  },
  filename: function (req, files, callback) {
    callback(null, new Date().toISOString() + files.originalname);
  },
});

module.exports.fileStorage = multer.diskStorage({
  destination: function (req, files, callback) {
    callback(null, "./Attachments/");
  },
  filename: function (req, files, callback) {
    callback(null, new Date().toISOString() + files.originalname);
  },
});

module.exports.imageFileFilter = (req, files, callback) => {
  if (
    files.mimetype === "image/jpeg" ||
    files.mimetype === "image/png" ||
    files.mimetype === "image/jpg"
  ) {
    callback(null, true);
  } else {
    callback(new InvalidFileFormat("Please insert images only",400),false);
  }
};

module.exports.checkAdminPrivileges= async (req,res,next)=>{
 try{ const userEmail=req.data.email;
  const adminResponse = await getAdmin(userEmail);
  if(adminResponse){
    return next();
  }else{
    return next(new UnauthorizedAccess("You need admin privileges to access this data.",400));
  }}catch(err){
    return next(new ServerError("Error"), 500);
  }

}

module.exports.errorHandlingMiddleware = (err, req, res, next) => {
  res.status(err.responseCode || 500);
  res.json({
    error: err.name,
    errorCode: err.code,
    message: err.message,
    payload: err.payload,
  });
};
