const user = require("../../App-backend/Controller/UserController");
const router = require("express").Router();
// const midware = require("../Midwares/Midwares");

router.patch("/update-profile/:id",user.updateProfile);
router.patch("/update-role/:id/:role", user.updateRole);
router.get("/",user.getUsers);
router.delete("/:id",user.deleteUser);

module.exports = router;