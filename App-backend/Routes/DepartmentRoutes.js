const dept = require("../../App-backend/Controller/DepartmentController");
const router = require("express").Router();

router.post( "/",dept.createDept);
router.get("/",dept.getDept);
router.delete("/:id", dept.delete);

module.exports = router;