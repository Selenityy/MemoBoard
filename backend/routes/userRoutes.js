const express = require("express");
const router = express.Router();
const passport = require("passport");
const userController = require("../controllers/userController");
const memoRoutes = require("./memoRoutes");
const tagRoutes = require("./tagRoutes");

// check if user is logged in
// function isLoggedIn(req, res, next) {
//   req.user ? next() : res.sendStatus(401);
// }

// GET
router.get("/auth/google", userController.google);

router.get("/auth/google/callback", userController.googleCB);

router.get("/auth/failure", userController.failedLogin);

router.get("/logout", userController.logout);

// POST
router.post("/signup", userController.signup);

router.post("/login", userController.login);

module.exports = router;
