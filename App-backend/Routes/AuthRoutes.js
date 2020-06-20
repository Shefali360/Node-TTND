const auth = require("../../App-backend/Controller/AuthController");
const router = require("express").Router();
router.get("/authToken/:code", auth.handleAuthTokenRequest);
router.post("/logout", auth.handleLogout);


module.exports = router;
