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
    fileUpload.array("files"),
    complaint.createComplaint
  );
  router.get(
    "/",
    midware.verifyTokenToGetUserData,
    complaint.getComplaints
  );
  router.patch(
   "/:id",
   midware.verifyTokenToGetUserData,
   midware.checkAdminPrivileges,
  complaint.updateComplaintStatusById
  );
  router.delete("/",complaint.delete);
  module.exports = router;