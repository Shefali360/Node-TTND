const customId = require("custom-id");
const complaintService = require("../Services/ComplaintServices");
const userService = require("../Services/UserServices");
const {
  DataValidationFailed,
} = require("../../ErrorHandler/Buzz/BuzzExceptions");
const {
  UnauthorizedAccess,
} = require("../../ErrorHandler/Admin/AdminExceptions");
const {
  ActionNotAcceptable,
} = require("../../ErrorHandler/Generic/GenericExceptions");
const mail = require("../../Mails/Mails");

const fileArray=(files)=>{
  const paths = [];
  if (files) {
   files.forEach((path) => {
      paths.push(path.path);
    });
  }
  return paths;
}
module.exports.createComplaint = async (req, res, next) => {
  if (req.body.assignedTo || req.body.status || req.body.estimatedTime) {
    return next(new DataValidationFailed("Cannot modify these keys..", 403));
  }
  const myuserdata = req.data;
  let admin = await complaintService.assignAdmin(
    req.body.department,
    myuserdata.email
  );
  req.body.assignedTo = admin.email;
  console.log(admin);
  // console.log(req.body.assignedTo.name);
  req.body.email = myuserdata.email;
  req.body.name = myuserdata.name;
  req.body.lockedBy = myuserdata.name;
  const issueId = customId({
    email: myuserdata.email,
    randomLength: 2,
  });

  req.body.issueId = issueId;
  req.body.timestamp = Date.now();
  req.body.files = fileArray(req.files);
  try {
    const response = await complaintService.createComplaint(req.body);
    res.send(response);
    console.log(admin);
    mail.sendMail(
      req.body.email,
      `Your complaint has been logged with ID: ${issueId}`,
      {
        heading: `hello ${myuserdata.name.split(" ")[0]}`,
        content: `<span style="text-transform: capitalize">${req.body.issue}</span><br/><br/>
    Your complaint has been assigned to <span style="text-transform: capitalize>&nbsp;${admin.name}</span> (${admin.email}).`,
        salutation: "thank you",
        from: "to the new team",
      }
    );
    mail.sendMail(
     req.body.assignedTo.email,
      `New complaint assigned with Issue ID: ${issueId}`,
      {
        heading: `hello ${req.body.assignedTo.name.split(" ")[0]}`,
        content: `You have been assigned a new complain with Issue ID: ${issueId}.`,
        salutation: "thank you",
        from: "to the new team",
      }
    );
  } catch (err) {
    next(err);
  }
};

module.exports.getComplaints = async (req, res, next) => {
  const userEmail = req.data.email;
  if (!(req.query.all && req.data.role === "SuperAdmin")) {
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

module.exports.getAssignedComplaints = async (req, res, next) => {
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
};

module.exports.updateComplaints = async (req, res, next) => {
  try {
    const complaint = await complaintService.getComplaintById(req.params);

    if (complaint.email !== req.data.email) {
      return next(
        new UnauthorizedAccess(
          "Insufficient privileges to change these keys..",
          403
        )
      );
    }
    if (req.body.assignedTo || req.body.status || req.body.estimatedTime) {
      return next(new DataValidationFailed("Cannot modify these keys..", 403));
    }
    let newAdmin = null;
    if (req.body.department && complaint.department !== req.body.department) {
      newAdmin = await complaintService.assignAdmin(
        req.body.department,
        req.data.email
      );
      req.body.assignedTo = newAdmin;
    }
    req.body.files = fileArray(req.files);
    const complaintData = await complaintService.updateComplaints(
      req.params,
      req.body
    );
    res.send(complaintData);
    if (newAdmin) {
      mail.sendMail(
        complaint.email,
        `Complaint updated having Issue ID: ${complaint.issueId}`,
        {
          heading: "",
          content: `Hello<br/>Your complaint has been updated successfully and is assigned to
                <span style="text-transform: capitalize>&nbsp;${newAdmin.name}</span> (${newAdmin.email}).`,
          salutation: "thank you",
          from: "to the new team",
        }
      );
      mail.sendMail(
        newAdmin.email,
        `New complaint assigned with Issue ID: ${complaint.issueId}`,
        {
          heading: "",
          content: `Hello<br/>You have been assigned a new complaint with Issue ID: ${complaint.issueId}.`,
          salutation: "thank you",
          from: "to the new team",
        }
      );
      mail.sendMail(
        complaint.assignedTo,
        `Complaimt with Issue ID: ${complaint.issueId} has been reassigned`,
        {
          heading: "",
          content: `Hello<br/>Complaint with Issue ID: ${complaint.issueId} has been reassigned. You are no longer concerned with it.`,
          salutation: "thank you",
          from: "to the new team",
        }
      );
    } else {
      mail.sendMail(
        complaint.email,
        `Complaint updated having Issue ID: ${complaint.issueId}`,
        {
          heading: "",
          content: `Hello<br/>Your complaint has been updated successfully.`,
          salutation: "thank you",
          from: "to the new team",
        }
      );
      mail.sendMail(
        complaint.assignedTo,
        `Issue ID: ${complaint.issueId} has been reassigned`,
        {
          heading: "",
          content: `Hello<br/>Complaint with Issue ID: ${complaint.issueId} is updated. Login to view changes.`,
          salutation: "thank you",
          from: "to the new team",
        }
      );
    }
  } catch (err) {
    next(err);
  }
};

const checkReassignedUserCredentials = async (email, department,next) => {
  const user = await userService.getUserByEmail(email);

  if (!user)
    return next( new DataValidationFailed("Assigned user does not exists", 500));
  else if (user.role !== "Admin")
    return next( new DataValidationFailed("Assigned user must be an admin", 500));
  else if (
    !user.department ||
    (user.department && user.department.toString() !== department.toString())
  )
    return next( new DataValidationFailed(
      "Complaint cannot be assigned to user of another department",
      500
    ));
  return { name: user.name, email: user.email };
};

module.exports.updateComplaintStatusById = async (req, res, next) => {
  try {
    const complaint = await complaintService.getComplaintById(req.params);
    if (complaint.assignedTo !== req.data.email) {
      return next(
        new ActionNotAcceptable(
          "You must be assigned a request to resolve it",
          403
        )
      );
    }
    if (
      req.body.issue ||
      req.body.department ||
      req.body.concern ||
      req.body.files
    ) {
      return next(new ActionNotAcceptable("This action is unacceptable", 406));
    }
    let newAssignedUser=null;
    if (req.body.assignedTo) {
      if (req.body.assignedTo === complaint.email) {
        return next(
          new ActionNotAcceptable(
            "The logger cannot be assigned his own complaint",
            403
          )
        );
      }
   else if (req.body.assignedTo === complaint.assignedTo) {
        return next(
          new ActionNotAcceptable(
            "Complaint cannot be assigned again with same value ",
            403
          )
        );
      }

    newAssignedUser=await checkReassignedUserCredentials(req.body.assignedTo,complaint.department);
    }

    if (complaint.email === req.data.email) {
      return next(
        new ActionNotAcceptable(
          "Admin cannot resolve his/her own complaints",
          403
        )
      );
    }
    const response = await complaintService.updateComplaints(
      req.params,
      req.body.assignedTo ? { assignedTo: req.body.assignedTo } : req.body
    );
    res.send(response);
    if (newAssignedUser) {
      mail.sendMail(
        complaint.email,
        `Complaint with Issue ID: ${complaint.issueId} has been reassigned`,
        {
          heading: "",
          content: `Hello<br/>Your complaint is reassigned to
                <span style="text-transform: capitalize">&nbsp;${newAssignedUser.name}</span> (${newAssignedUser.email})`,
          salutation: "thank you",
          from: "to the new team",
        }
      );
      mail.sendMail(
        newAssignedUser.email,
        `Issue ID: ${complaint.issueId} is deferred to you`,
        {
          heading: "",
          content: `Hello<br/>Issue ID: ${complaint.issueId} is deferred to you by
                <span style="text-transform: capitalize">&nbsp;${req.data.name}</span> (${req.data.name}).`,
          salutation: "thank you",
          from: "to the new team",
        }
      );
    }else{
      mail.sendMail(complaint.email, `Status of complaint with Issue ID: ${complaint.issueId} has been updated`, {
				heading: '',
				content: `Hello<br/>Your complaint is updated with status: ${req.body.status}.`,
				salutation: 'thank you',
				from: 'to the new team'
			});
    }
  } catch (err) {
    next(err);
  }
};

module.exports.deleteComplaint = async (req, res, next) => {
  try {
    const complaint = await complaintService.getComplaintById(req.params);
    if (complaint.email !== req.data.email) {
      return next(
        new ActionNotAcceptable(
          "Only creator can delete his/her complaint",
          403
        )
      );
    }
    const response = await complaintService.deleteComplaint(req.params);
    res.send(response);
    mail.sendMail(complaint.email, `Complaint with Issue ID: ${complaint.issueId} has been deleted`, {
			heading: `hello`,
			content: `Your complaint with Issue ID: ${complaint.issueId} is deleted successfully.`,
			salutation: 'thank you',
			from: 'to the new team'
		});
		mail.sendMail(complaint.assignedTo, `Issue ID: ${complaint.issueId} is deleted.`, {
			heading: `hello`,
			content: `Complaint with Issue ID: ${complaint.issueId} has been deleted.`,
			salutation: 'thank you',
			from: 'to the new team'
		});
  } catch (err) {
    res.status(500).send(err);
  }
};
