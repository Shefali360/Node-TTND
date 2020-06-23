const axios = require("axios");
const dotenv = require("dotenv");
const {
  invalidTokenCodeError,
  invalidTokenError,
} = require("../../ErrorHandler/Auth/AuthExceptions");
const {
  RequiredFieldAbsent,
} = require("../../ErrorHandler/Validation/ValidationExceptions");
const {
  ResourceNotFound,ServerError
} = require("../../ErrorHandler/Generic/GenericExceptions");
const {
  DuplicateKey
}=require("../../ErrorHandler/Validation/ValidationExceptions");
const {UnauthorizedAccess}=require("../../ErrorHandler/Admin/AdminExceptions");
const jwt = require("jsonwebtoken");
const userService = require("../Services/UserServices");
const userRole = require("../../Config/Config");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

dotenv.config();

const downloadImage=async(path)=>{
  const imageArr=path.split('/');
  const imageExtension=uuidv4()+imageArr[imageArr.length-1];
  const imagePath=[process.cwd(),"ProfilePic",imageExtension].join('/');
  const fileStream=fs.createWriteStream(imagePath);
  try{
    const imageData=await axios.request({
      method:'GET',
      url:path,
      responseType:'arraybuffer'
    });
  fileStream.write(Buffer.from(imageData.data,'binary'),'binary',(err)=>{
    if(err){
      throw new ServerError("Error",500);
    }
  })
  return {imageExtension,imagePath};
  }catch(err){
      throw new ServerError("Error",500);
  }
};

module.exports.signup= async (req, res, next) => {
  let fileData=null;
  try {
    const token = await axios({
      url: "https://oauth2.googleapis.com/token",
      method: "post",
      data: {
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        redirect_uri: "http://localhost:3000/authToken",
        grant_type: "authorization_code",
        code: decodeURIComponent(req.params["code"]),
      },
    });
    const userData = jwt.decode(token.data.id_token);
    fileData=await downloadImage(userData.picture);
    const userProfile={
      name:userData.name,
      email:userData.email,
      picture:fileData.imageExtension
    };
    console.log(fileData);
    const newUser=await userService.createUser(userProfile);
    delete newUser.__v;
    const userRoleCode = userRole.roles[newUser.role];
    token.data["id_token"] = jwt.sign(
      {...newUser, roleCode: userRoleCode},
      process.env.CLIENT_SECRET
    );
    return res.json(token["data"]);
  } catch (err) {
    if(fileData){fs.unlink(fileData.imagePath,()=>{})};
    if(err.code==='DUPLICATE_KEY'){
    return next(err);
  }
    return next(
      new invalidTokenCodeError(
        "Invalid code for token access request",
        401
      )
    );
  }
};

module.exports.signin= async (req, res, next) => {
  try {
    const token = await axios({
      url: "https://oauth2.googleapis.com/token",
      method: "post",
      data: {
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        redirect_uri: "http://localhost:3000/authToken",
        grant_type: "authorization_code",
        code: decodeURIComponent(req.params["code"]),
      },
    });
    const userData = jwt.decode(token.data.id_token);
    const user=await userService.getUserByEmail(userData.email);
    if(!user){
      throw new UnauthorizedAccess('user does not exist.',401);
    }
    const userRoleCode = userRole.roles[user.role];
    token.data["id_token"] = jwt.sign(
      {...user, roleCode: userRoleCode},
      process.env.CLIENT_SECRET
    );
    return res.json(token["data"]);
  } catch (err) {
    console.log(err);
    if(err.code==='UNAUTHORIZED_ACCESS_REQUEST')return next(err);
    return next(
      new invalidTokenCodeError(
        "Invalid code for token access request",
        401,
        err.response.data
      )
    );
  }
};

module.exports.handleLogout = async (req, res, next) => {
  if (!req.body || !req.body["refreshToken"])
    return next(new RequiredFieldAbsent("refresh token is not present", 400));
  try {
    await axios({
      url:
        "https://oauth2.googleapis.com/revoke" +
        `?token=${encodeURIComponent(req.body["refreshToken"])}`,
      method: "post",
    });
    res.send({ success: true });
  } catch (err) {
    console.log(err);
    next(
      new invalidTokenError(
        "Invalid token received or token has been expired",
        401,
        err.response.data
      )
    );
  }
};

module.exports.handleUnknownRequests = (req, res, next) => {
  return next(new ResourceNotFound("requested resource not found", 404));
};
