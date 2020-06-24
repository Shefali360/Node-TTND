const complaint = require("../../App-backend/Controller/ComplaintController");
const midware = require("../Midwares/Midwares");
const router = require("express").Router();
const multer = require("multer");
const fileUpload = multer({
  storage: midware.fileStorage('./Attachments/'),
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: midware.fileFilter
});

router.post(
    "/",
    midware.verifyTokenToGetUserData,
    fileUpload.array("files",5),
    complaint.createComplaint
  );
  router.get(
    "/",
    midware.verifyTokenToGetUserData,
    complaint.getComplaints
  );
  router.get(
    "/assigned",
    midware.verifyTokenToGetUserData,
    midware.checkPrivileges("Admin"),
    complaint.getAssignedComplaints
  );
  router.patch(
    "/:id",
    midware.verifyTokenToGetUserData,
    fileUpload.array("files",5),
   complaint.updateComplaints
   );
  router.patch(
   "/resolve/:id",
   midware.verifyTokenToGetUserData,
   midware.checkPrivileges("Admin"),
  complaint.updateComplaintStatusById
  );
  router.delete("/:id",midware.verifyTokenToGetUserData,complaint.deleteComplaint);
  module.exports = router;