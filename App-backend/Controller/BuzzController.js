const {ServerError} = require("../../ErrorHandler/Generic/GenericExceptions");
const buzzService=require('../Services/BuzzServices');

module.exports.createBuzz = async(req, res,next) => {
  const paths=[];
  if(req.files){
  req.files.forEach(path=>{
    paths.push(path.path);
  })}
  req.body.images=paths;
  req.body.createdOn=Date.now();
  const myuserdata = req.data;
  req.body.userId=myuserdata.email;
  try{
    const response=await buzzService.createBuzz(req.body);
    res.send(response);
  }
  catch (err) {
   next(err);
  }
};

module.exports.getAll = async (req, res,next) => {
  try {
    const limitCount=req.query.limit;
    const skipCount=req.query.skip;
    const email = req.data.email;
    const response = await buzzService.getAll(email,Number(limitCount), Number(skipCount));
    res.send(response);
  } catch (err) {
    return next( new ServerError("Error",500));
  }
};

module.exports.updateLikes = async (req, res) => {
  try {
    const email = req.data.email;
    const response = await buzzService.updateLikes(req.params,email,req.query.reverse);
    res.send(response);
  } catch (err) {
    return next(new ServerError("Error",500));
  }
};

module.exports.updateDislikes = async (req, res) => {
  try {
    const email = req.data.email;
    const response = await buzzService.updateDislikes(req.params,email,req.query.reverse);
    res.send(response);
  } catch (err) {
    return next(new ServerError("Error",500));
  }
};

module.exports.delete = async (req, res) => {
  try {
    const response = await buzzService.delete();
    res.send(response);
    
  } catch (err) {
    res.status(500).send(err);
  }
};


