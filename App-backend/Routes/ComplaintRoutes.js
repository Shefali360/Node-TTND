const complaint = require("../../App-backend/Controller/ComplaintController");
const midware = require("../Midwares/Midwares");
const router = require("express").Router();
const multer = require("multer");
const fileUpload = multer({
  storage: midware.fileStorage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
});


router.post(
    "/",
    midware.verifyTokenToGetUserData,
    fileUpload.array("files"),
    complaint.createComplaint
  );
  router.get(
    "/all",
    midware.verifyTokenToGetUserData,
    midware.checkAdminPrivileges,
    complaint.getAllComplaints
  );
  router.get(
    "/",
    midware.verifyTokenToGetUserData,
    complaint.getComplaintsByUserEmail
  );
  router.patch(
   "/:id",
   midware.verifyTokenToGetUserData,
   midware.checkAdminPrivileges,
  complaint.updateComplaintStatusById
  );
  router.delete("/",complaint.delete);
  module.exports = router;