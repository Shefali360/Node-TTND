const customId = require("custom-id");
const complaintService = require("../Services/ComplaintServices");

module.exports.createComplaint = async (req, res, next) => {
  const myuserdata = req.data;
  req.body.email = myuserdata.email;
  req.body.name = myuserdata.name;
  req.body.assignedTo = myuserdata.name;
  req.body.lockedBy = myuserdata.name;
  const issueId = customId({
    email: myuserdata.email,
    randomLength: 2,
  });
  req.body.issueId = issueId;
  req.body.timestamp=Date.now();
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
  } catch (err) {
    next(err);
  }
};

module.exports.getAllComplaints = async (req, res, next) => {
  const limitCount = req.query.limit;
  delete req.query.limit;
  const skipCount = req.query.skip;
  delete req.query.skip;
  try {
    const response = await complaintService.getAllComplaints(
      req.query,
      Number(limitCount),Number(skipCount)
    );
    res.send(response);
  } catch (err) {
    next(err);
  }
};
module.exports.getComplaintsByUserEmail = async(req, res, next) => {
  const userEmail = req.data.email;
  req.query["email"]=userEmail;
  const limitCount = req.query.limit;
  delete req.query.limit;
  const skipCount = req.query.skip;
  delete req.query.skip;
  try {
    const response = await complaintService.getComplaintsByUserEmail(
      req.query,
      Number(limitCount),Number(skipCount)
    );
    res.send(response);
  } catch (err) {
    next(err);
  }
};

module.exports.updateComplaintStatusById = async (req, res,next) => {
  try {
    const response = await complaintService.updateComplaintStatusById(req.params,req.body);
    res.send(response);
  } catch (err) {
    next(err);
  }
};

module.exports.delete = async (req, res) => {
  try {
    const response = await complaintService.delete();
    res.send(response);
    
  } catch (err) {
    res.status(500).send(err);
  }
};

