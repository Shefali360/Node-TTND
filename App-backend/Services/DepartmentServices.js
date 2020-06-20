const dept = require("../Models/DepartmentModel");
const { ServerError } = require("../../ErrorHandler/Generic/GenericExceptions");
const { DataValidationFailed } = require("../../ErrorHandler/Buzz/BuzzExceptions");

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
              {throw new ServerError("Error",500);}
   
  }
  }

  module.exports.getDept = async (query, limit, skip) => {
    try {
      const department = await dept
        .find(
          query
        )
        .limit(limit ? limit : 0)
        .skip(skip ? skip : 0);
      return department;
    } catch (err) {
      throw new ServerError("Error", 500);
    }
  };
  

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
  