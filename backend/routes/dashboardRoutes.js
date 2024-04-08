const express = require("express");
const router = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");
const JwtStrategy = require("passport-jwt").Strategy;
const mongoose = require("mongoose");

// GET
router.get(
  "/dashboard",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({ message: "Successful login to protected routes" });
  }
);

router.get("/data", userController.userData);

router.get("/timezone", userController.timezone);

// PUT
router.put("/:userId/updateEmail", userController.updateEmail);

router.put("/:userId/updateName", userController.updateName);

router.put("/:userId/updateUsername", userController.updateUsername);

router.put("/:userId/updateTimezone", userController.updateTimezone);

// DELETE
router.delete("/:userId/account", userController.deleteAccount);

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
