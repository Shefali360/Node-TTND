const axios = require("axios");
const dotenv = require("dotenv");  
const {invalidTokenCodeError,invalidTokenError}=require('../../ErrorHandler/Auth/AuthExceptions');
const {RequiredFieldAbsent}=require('../../ErrorHandler/Validation/ValidationExceptions');
const {ResourceNotFound}=require('../../ErrorHandler/Generic/GenericExceptions');
const jwt=require("jsonwebtoken");
const userService=require('../Services/AdminServices');


dotenv.config();

module.exports.handleAuthTokenRequest = async (req, res,next) => {
  try {
    const token = await axios({
      url: 'https://oauth2.googleapis.com/token',
      method: "post",
      data: {
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        redirect_uri: "http://localhost:3000/authToken",
        grant_type: "authorization_code",
        code: decodeURIComponent(req.params["code"]),
      },
    });
    const userData= jwt.decode(token.data.id_token);
    const userProfile=await userService.addOrUpdateUser({ name: userData.name,
                                email: userData.email,
                              picture:userData.picture});
    token.data['id_token'] = jwt.sign({ name: userProfile.name,email: userProfile.email,picture:userProfile.picture,role:userProfile.role}, process.env.CLIENT_SECRET);
    return res.json(token['data']);
  } catch (err) {
  return next(new invalidTokenCodeError("Invalid code for token access request",401,err.response.data));
  }
};


module.exports.handleLogout = async (req, res,next) => {
  if(!req.body || !req.body['refreshToken'])
  return next(new RequiredFieldAbsent('refresh token is not present', 400));
  try {
   await axios({
      url: 'https://oauth2.googleapis.com/revoke'+`?token=${encodeURIComponent(req.body['refreshToken'])}`,
      method: "post",
    });
    res.send({"success":true});
  } catch (err) {
    console.log(err);
    next(new invalidTokenError("Invalid token received or token has been expired",401,err.response.data));

  }
  
};

module.exports.handleUnknownRequests=(req, res, next)=> {
  return next(new ResourceNotFound('requested resource not found', 404));
}

