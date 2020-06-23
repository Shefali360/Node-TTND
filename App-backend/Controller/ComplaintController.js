const customId = require("custom-id");
const complaintService = require("../Services/ComplaintServices");
const {
  UnauthorizedAccess,
} = require("../../ErrorHandler/Admin/AdminExceptions");
const{ActionNotAcceptable}=require("../../ErrorHandler/Generic/GenericExceptions");
const mail=require('../../Mails/Mails');


module.exports.createComplaint = async (req, res, next) => {
  const myuserdata = req.data;
  const admin = await complaintService.assignAdmin(
    req.body.department,
    myuserdata.email
  );
  req.body.assignedTo = admin;
  req.body.email = myuserdata.email;
  req.body.name = myuserdata.name;
  req.body.lockedBy = myuserdata.name;
  const issueId = customId({
    email: myuserdata.email,
    randomLength: 2,
  });

  req.body.issueId = issueId;
  req.body.timestamp = Date.now();
  const paths = [];
  if (req.files) {
    req.files.forEach((path) => {
      paths.push(path.path);
    });
  }
  req.body.files = paths;
  try {
    const response = await complaintService.createComplaint(req.body);
    res.send(response);
    mail.sendMail(req.body.email,"Complaint created..",
    "hjvxsajgcjas","<h1>hjvxsajgcjas</h1>");
  } catch (err) {
    next(err);
  }
};

module.exports.getComplaints = async (req, res, next) => {
  const userEmail = req.data.email;
  if(!(req.query.all&&req.data.role==="SuperAdmin")){
  req.query["email"] = userEmail;
  }
  delete req.query.all;
  const limitCount = req.query.limit;
  delete req.query.limit;
  const skipCount = req.query.skip;
  delete req.query.skip;
  try {
    const response = await complaintService.getComplaints(
      req.query,
      Number(limitCount),
      Number(skipCount)
    );
    res.send(response);
  } catch (err) {
    next(err);
  }
};

module.exports.getAssignedComplaints=async(req,res,next)=>{
  const userEmail = req.data.email;
  req.query["assignedTo"] = userEmail;
  const limitCount = req.query.limit;
  delete req.query.limit;
  const skipCount = req.query.skip;
  delete req.query.skip;
  try {
    const response = await complaintService.getComplaints(
      req.query,
      Number(limitCount),
      Number(skipCount)
    );
    res.send(response);
  } catch (err) {
    next(err);
  }

}

module.exports.updateComplaints = async (req, res, next) => {
  try {
    if (req.body.assignedTo || req.body.status || req.body.estimatedTime) {
      throw new UnauthorizedAccess(
        ("Insufficient privileges to change these keys..", 403)
      );
    }
    const complaint = await complaintService.getComplaintById(req.params);
    console.log(complaint);
    if (complaint.email !== req.data.email) {
      throw new UnauthorizedAccess(
        ("Insufficient privileges to change these keys..", 403)
      );
    }
    if (req.body.department) {
      if (complaint.department !== req.body.department) {
        const admin = await complaintService.assignAdmin(
          req.body.department,
          req.data.email
        );
        req.body.assignedTo = admin;
      }
    }
    const paths = [];
    if (req.files) {
      req.files.forEach((path) => {
        paths.push(path.path);
      });
    }
    req.body.files = paths;
    const complaintData = await complaintService.updateComplaints(
      req.params,
      req.body
    );
    res.send(complaintData);
  } catch (err) {
    next(err);
  }
};
module.exports.updateComplaintStatusById = async (req, res, next) => {
  try {
    if (
      req.body.issue ||
      req.body.department ||
      req.body.concern ||
      req.body.files
    ) {
      throw new ActionNotAcceptable(("This action is unacceptable", 406));
    }
    const complaint = await complaintService.getComplaintById(req.params);
    if (complaint.email === req.data.email) {
      throw new ActionNotAcceptable(
        ("Admin cannot resolve his/her own complaints", 403)
      );
    }
    if (complaint.assignedTo !== req.data.email) {
      throw new ActionNotAcceptable(
        ("You must be assigned a request to resolve it", 403)
      );
    }
    const response = await complaintService.updateComplaints(
      req.params,
      req.body
    );
    res.send(response);
    if(req.body.status==="Closed"){
      mail.sendMail(complaint.email,"Complaint resolved..","hjvxsajgcjas","<h1>hjvxsajgcjas</h1>");
    }
  } catch (err) {
    console.log(err);
    next(err);
  }
};

module.exports.delete = async (req, res) => {
  try {
    const complaint = await complaintService.getComplaintById(req.params);
    if(complaint.email!==req.data.email){
      throw new ActionNotAcceptable(
        ("Only creator can delete his/her complaint", 403)
      );
    }
    const response = await complaintService.delete(req.params);
    res.send(response);
  } catch (err) {
    res.status(500).send(err);
  }
};
