const complaint  = require("../Models/ComplaintModel");
const { ServerError } = require("../../ErrorHandler/Generic/GenericExceptions");
const { DataValidationFailed } = require("../../ErrorHandler/Buzz/BuzzExceptions");

module.exports.createComplaint = async (data) => {
  const complaintData = new complaint(data);
  try {
    await complaintData.save();
    return complaintData;
  } catch (err) {
    if (err.name === "ValidationError") {
      throw new DataValidationFailed(err.message, 500);
    } else {
      throw new ServerError("Error", 500);
    }
  }
};

module.exports.getComplaints = async (query, limit, skip) => {
  try {
    const pipeline=[
      {$match:query},
      {
        $lookup:{
            from:"users",
            localField:"email",
            foreignField:"email",
            as:"lockedBy"
        }
      },
      {
      $lookup:{
          from:"users",
          localField:"assignedTo",
          foreignField:"email",
          as:"assignedTo"
      }
    },
     {
     $lookup:{
        from:"departments",
        localField:"department",
        foreignField:"department",
        as:"department"
      }
    },
    {
      $set:{
        lockedBy:{$arrayElemAt:['$lockedBy',0]},
        assignedTo:{$arrayElemAt:['$assignedTo',0]},
        department:{$arrayElemAt:['$department',0]},

      }
    },
    {
      $project:{
        __v:0,
        email:0,
        lockedBy:{
          _id:0,
          __v:0,
          picture:0,
          dob:0,
          phone:0,
          role:0,
          department:0
        },
        assignedTo:{
          _id:0,
          __v:0,
          picture:0,
          dob:0,
          phone:0,
          role:0,
          department:0
        },
        department:{
          __v:0
        }
      }
    },
  {
    $sort:{
      timestamp:-1
    }
  },
  {
      $skip: skip
  }
]
  if(limit){
    pipeline.push({$limit:limit})
  }
const complaintList=await complaint.aggregate(pipeline).exec();
    return complaintList;
   
  } catch (err) {
    console.log(err);
    throw new ServerError("Error", 500);
  }
};

module.exports.updateComplaintStatusById = async ({id}, complaintData) => {
  try {
  const response=await complaint.findByIdAndUpdate(id, {
    $set: complaintData,
  }, {runValidators: true, new: true}).exec();
    return response;

  } catch (err) {
    if (err.name === "ValidationError")
      throw new DataValidationFailed(err.message, 500);
    else throw new InternalServerError("Error", 500);
  }
};

module.exports.delete= async () => {
  const response = await complaint.deleteMany({});
  return response;
};