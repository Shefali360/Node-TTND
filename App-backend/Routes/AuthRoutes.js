const auth = require("../../App-backend/Controller/AuthController");
const router = require("express").Router();
router.get("/signup/:code", auth.signup);
router.get("/signin/:code",auth.signin)
router.post("/logout", auth.handleLogout);


module.exports = router;
