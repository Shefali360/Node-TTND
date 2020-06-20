const admin = require("../../App-backend/Controller/AdminController");
const midware = require("../Midwares/Midwares");
const router = require("express").Router();

router.post("/", midware.verifyTokenToGetUserData, admin.createAdmin);
router.get("/",midware.verifyTokenToGetUserData, admin.getAdmin);
router.delete("/:id", admin.delete);
module.exports = router;

