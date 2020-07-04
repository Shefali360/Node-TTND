const dept = require("../Models/DepartmentModel");
const { ServerError } = require("../../ErrorHandler/Generic/GenericExceptions");
const { DataValidationFailed } = require("../../ErrorHandler/Buzz/BuzzExceptions");
const {DuplicateKey} = require('../../ErrorHandler/Validation/ValidationExceptions');

module.exports.createDept=async(data)=>{
    const department=new dept(data);
   try{
    await department.save();
    return department;
   } 
   catch(err){
      if (err.name === 'ValidationError')
              {throw new DataValidationFailed(err.message, 500);}
      else
      if(err.code===11000){
        throw new DuplicateKey(err.message, 400);
      }else{throw new ServerError("Error",500);
    }  
  }
  }

  module.exports.getDept = async (query, limit, skip) => {
    try {
      const department = await dept
        .find(
          query
        )
      return department;
    } catch (err) {
      throw new ServerError("Error", 500);
    }
  };
  
  module.exports.editDept=async({id},updatedData)=>{
    try {
        const response = await dept.findOneAndUpdate({_id:id},{$set:updatedData},{new:true,runValidators:true});
        return response;
        }catch(err){
    if (err.name === "ValidationError") {
        throw new DataValidationFailed(err.message, 500);
      } else {
        throw new ServerError("Error", 500);
      }
}
}

module.exports.findDept=async(query)=>{
  try{
    const department=await dept.findOne(query);
    return department;
  }catch(err){
    throw new ServerError("Error", 500);
  
  }
}

module.exports.delete = async ({ id }) => {
    try{
    const response = await dept.deleteOne({
      _id: id,
    });
    return response;
    }catch (err) {
    throw new ServerError("Error", 500);
  }
};
  