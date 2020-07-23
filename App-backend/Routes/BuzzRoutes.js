const buzz = require("../../App-backend/Controller/BuzzController");
const midware = require("../Midwares/Midwares");
const router = require("express").Router();
const multer = require("multer");

const imageUpload = multer({
  storage: midware.fileStorage('./Images/'),
  limits: {
    fileSize: 1024 * 1024,
  },
  fileFilter: midware.imageFileFilter,
});
router.get("/", midware.verifyTokenToGetUserData,buzz.getBuzz);
router.post(
  "/",
  midware.verifyTokenToGetUserData,
  imageUpload.array("images",5),
  buzz.createBuzz
);
router.patch("/update/:id", imageUpload.array("images",5),midware.verifyTokenToGetUserData,buzz.updateBuzz);
router.patch("/like/:id",midware.verifyTokenToGetUserData, buzz.updateLikes);
router.patch("/dislike/:id",midware.verifyTokenToGetUserData, buzz.updateDislikes);
router.delete("/:id",midware.verifyTokenToGetUserData, buzz.delete);
module.exports=router;