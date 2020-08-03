const user = require("../../App-backend/Controller/UserController");
const router = require("express").Router();
const midware = require("../Midwares/Midwares");
const multer = require("multer");
const profilePicUpload = multer({
  storage: midware.fileStorage("./ProfilePic/"),
  limits: {
    fileSize: 1024 * 1024 * 2,
  },
  fileFilter: midware.imageFileFilter,
});

router.patch(
  "/update-profile",
  midware.verifyTokenToGetUserData,
  user.updateProfile
);

router.patch(
  "/update-profile-pic",
  midware.verifyTokenToGetUserData,
  profilePicUpload.single("picture"),
  user.updateProfilePicture
)
router.patch(
  "/update-privileges/:email",
  midware.verifyTokenToGetUserData,
  midware.checkPrivileges("SuperAdmin"),
  user.updatePrivileges
);
router.get("/", user.getUsers);
router.delete(
  "/:email",
  midware.verifyTokenToGetUserData,
  midware.checkPrivileges("SuperAdmin"),
  user.deleteUser
);
router.patch("/followorunfollow/:name",midware.verifyTokenToGetUserData,user.followOrUnfollowUser);
module.exports = router;
