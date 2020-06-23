const {ServerError,ActionNotAcceptable} = require("../../ErrorHandler/Generic/GenericExceptions");
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

module.exports.getBuzz = async (req, res,next) => {
  try {
    const limitCount=req.query.limit;
    delete req.query.limit;
    const skipCount=req.query.skip;
    delete req.query.skip;
    const email = req.data.email;
    const response = await buzzService.getBuzz(email,req.query,Number(limitCount), Number(skipCount));
    res.send(response);
   
  } catch (err) {
    return next( new ServerError("Error",500));
  }
};

module.exports.updateBuzz=async(req,res,next)=>{
  try{
    if (req.body.likes || req.body.dislikes || req.body.liked || req.body.disliked) {
      throw new ActionNotAcceptable(
        ("This action is unacceptable", 406)
      );
    }
    const buzzData = await buzzService.getBuzzById(req.params);
    console.log(buzzData);
    if (buzzData.email !== req.data.email) {
      throw new UnauthorizedAccess(
        ("Insufficient privileges to update buzz..", 403)
      );
    }
    const paths=[];
  if(req.files){
  req.files.forEach(path=>{
    paths.push(path.path);
  })}
  req.body.images=paths;
    const buzz=await buzzService.updateBuzz(req.params,req.body);
    res.send(buzz);
  }catch(err){
    next(err);
  }
}

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
    const buzz= await buzzService.getBuzzById(req.params);
    if(buzz.email!==req.data.email){
      throw new ActionNotAcceptable(
        ("Only creator can delete his/her post", 403)
      );
    }
    const response = await buzzService.delete(req.params);
    res.send(response); 
  } catch (err) {
    res.status(500).send(err);
  }
};


