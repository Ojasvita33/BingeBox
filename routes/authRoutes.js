const router = require("express").Router();
const auth = require("../controllers/authController");

router.get("/login", auth.getLogin);
router.get("/register", auth.getRegister);
router.get("/forgot-password", auth.getForgotPassword);
router.get("/reset-password/:token", auth.getResetPassword);
router.post("/login", auth.login);
router.post("/register", auth.register);
router.post("/forgot-password", auth.forgotPassword);
router.post("/reset-password", auth.resetPassword);
router.get("/logout", auth.logout);

module.exports = router;
