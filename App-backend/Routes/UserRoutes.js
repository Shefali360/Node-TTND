const user = require("../../App-backend/Controller/UserController");
const router = require("express").Router();
const midware = require("../Midwares/Midwares");

router.patch(
  "/update-profile",
  midware.verifyTokenToGetUserData,
  user.updateProfile
);
router.patch(
  "/update-role/:id/:role",
  midware.verifyTokenToGetUserData,
  midware.checkPrivileges("SuperAdmin"),
  user.updateRole
);
router.get("/", user.getUsers);
router.delete(
  "/:id",
  midware.verifyTokenToGetUserData,
  midware.checkPrivileges("SuperAdmin"),
  user.deleteUser
);

module.exports = router;
