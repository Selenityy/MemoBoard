const express = require("express");
const router = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");
const JwtStrategy = require("passport-jwt").Strategy;
const mongoose = require("mongoose");
const dashboardController = require("../controllers/dashboardController");
const memoRoutes = require("../routes/memoRoutes");
const tagRoutes = require("../routes/tagRoutes");
const projectRoutes = require("../routes/projectRoutes");

// Apply JWT authentication middleware to all routes in this router
router.use(passport.authenticate("jwt", { session: false }));

router.get("/", (req, res) => {
  res.json({ message: "Successful login to protected routes" });
});
router.get("/data", dashboardController.userData);
router.get("/timezone", dashboardController.timezone);
router.put("/:userId/updateEmail", dashboardController.updateEmail);
router.put("/:userId/updateName", dashboardController.updateName);
router.put("/:userId/updateUsername", dashboardController.updateUsername);
router.put("/:userId/updateTimezone", dashboardController.updateTimezone);
router.put(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  dashboardController.updateProfileGoogleAuth
);
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
router.use(
  "/projects",
  passport.authenticate("jwt", { session: false }),
  projectRoutes
);

module.exports = router;
