const dept = require("../../App-backend/Controller/DepartmentController");
const router = require("express").Router();
const midware = require("../Midwares/Midwares");

router.post( "/",  midware.verifyTokenToGetUserData,midware.checkPrivileges("SuperAdmin"),dept.createDept);
router.get("/",  midware.verifyTokenToGetUserData,dept.getDept);
router.delete("/:id", midware.verifyTokenToGetUserData, midware.checkPrivileges("SuperAdmin"),dept.delete);

module.exports = router;