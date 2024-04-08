const express = require("express");
const router = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");
const JwtStrategy = require("passport-jwt").Strategy;
const mongoose = require("mongoose");
const dashboardController = require("../controllers/dashboardController");

// Apply JWT authentication middleware to all routes in this router
router.use(passport.authenticate("jwt", { session: false }));

// GET
router.get(
  "/dashboard",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({ message: "Successful login to protected routes" });
  }
);

router.get("/data", dashboardController.userData);

router.get("/timezone", dashboardController.timezone);

// PUT
router.put("/:userId/updateEmail", dashboardController.updateEmail);

router.put("/:userId/updateName", dashboardController.updateName);

router.put("/:userId/updateUsername", dashboardController.updateUsername);

router.put("/:userId/updateTimezone", dashboardController.updateTimezone);

router.put(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  dashboardController.updateProfileGoogleAuth
);

// DELETE
router.delete("/:userId/account", dashboardController.deleteAccount);

router.use(
  "/memos",
  passport.authenticate("jwt", { session: false }),
  memoRoutes
);

router.use(
  "/tags",
  passport.authenticate("jwt", { session: false }),
  tagRoutes
);

module.exports = router;
