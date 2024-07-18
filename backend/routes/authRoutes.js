const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// /auth/...
router.get("/auth/google", authController.google);
router.get("/auth/google/callback", authController.googleCB);
router.get("/auth/failure", authController.failedLogin);
router.get("/logout", authController.logout);
router.post("/signup", authController.signup);
router.post("/login", authController.login);

module.exports = router;
