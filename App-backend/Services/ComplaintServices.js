const complaint = require("../Models/ComplaintModel");
const user = require("../Models/UserModel");
const { ServerError } = require("../../ErrorHandler/Generic/GenericExceptions");
const {
  DataValidationFailed,
} = require("../../ErrorHandler/Buzz/BuzzExceptions");
const mongoose = require("mongoose");

const randomInterval = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);

const adminAssignment = (adminArr) => {
  while (1) {
    const index = randomInterval(0, adminArr.length - 1);
    if (adminArr[index].role !== "SuperAdmin") {
      return adminArr[index];
    }
  }
};

module.exports.assignAdmin = async (department, email) => {
  try {
    let admin = await user
      .find({
        $or: [
          { department: department, role: "Admin", email: {$ne: email} },
          {
            role: "SuperAdmin",
          },
        ]
      })
      .lean();
    if (admin.length === 1) {
      return admin[0];
    }
    return adminAssignment(admin);
  } catch (err) {
    console.log(err);
    throw new ServerError("Error", 500);
  }
};
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
    const pipeline = [
      { $match: query },
      {
        $lookup: {
          from: "users",
          localField: "email",
          foreignField: "email",
          as: "lockedBy",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "assignedTo",
          foreignField: "email",
          as: "assignedTo",
        },
      },
      {
        $lookup: {
          from: "departments",
          localField: "department",
          foreignField: "_id",
          as: "department",
        },
      },
      {
        $set: {
          lockedBy: { $arrayElemAt: ["$lockedBy", 0] },
          assignedTo: { $arrayElemAt: ["$assignedTo", 0] },
          department: { $arrayElemAt: ["$department", 0] },
        },
      },
      {
        $project: {
          __v: 0,
          email: 0,
          lockedBy: {
            _id: 0,
            __v: 0,
            picture: 0,
            dob: 0,
            phone: 0,
            role: 0,
            department: 0,
          },
          assignedTo: {
            _id: 0,
            __v: 0,
            picture: 0,
            dob: 0,
            phone: 0,
            role: 0,
            department: 0,
          },
          department: {
            __v: 0,
          },
        },
      },
      {
        $sort: {
          timestamp: -1,
        },
      },
      {
        $skip: skip,
      },
    ];
    if (limit) {
      pipeline.push({ $limit: limit });
    }
    const complaintList = await complaint.aggregate(pipeline).exec();
    return complaintList;
  } catch (err) {
    throw new ServerError("Error", 500);
  }
};
module.exports.getComplaintById=async({id})=>{
  try{
    const response=await complaint.findById({_id:id});
    return response;
  }catch(err){
    throw new ServerError("Error", 500);
  }
}

module.exports.updateComplaints=async({id},complaintData)=>{
  try{
      const response = await complaint.findOneAndUpdate({_id:id},
        {$set:complaintData},{new:true,runValidators:true});
      return response;
}catch(err){
  if (err.name === "ValidationError") {
      throw new DataValidationFailed(err.message, 500);
    } else {
      throw new ServerError("Error", 500);
    }
}
}

module.exports.deleteComplaint = async ({id}) => {
  try{
  const response = await complaint.deleteOne({_id:id});
  return response;
  }catch(err){
    throw new ServerError("Error", 500);
  }
};
