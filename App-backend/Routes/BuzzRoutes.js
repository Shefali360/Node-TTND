const buzz = require("../../App-backend/Controller/BuzzController");
const midware = require("../Midwares/Midwares");
const router = require("express").Router();
const multer = require("multer");
const imageUpload = multer({
  storage: midware.imageStorage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: midware.imageFileFilter,
});
router.get("/", midware.verifyTokenToGetUserData,buzz.getAll);
router.post(
  "/",
  midware.verifyTokenToGetUserData,
  imageUpload.array("images"),
  buzz.createBuzz
);
router.patch("/like/:id",midware.verifyTokenToGetUserData, buzz.updateLikes);
router.patch("/dislike/:id",midware.verifyTokenToGetUserData, buzz.updateDislikes);
router.delete("/", buzz.delete);
module.exports=router;