const express = require("express");
const router = express.Router();
const passport = require("passport");
const userController = require("../controllers/userController");

// check if user is logged in
function isLoggedIn(req, res, next) {
  req.user ? next() : res.sendStatus(401);
}

router.get("/failure", (req, res) => {
  res.send("Something went wrong.");
});

router.get("/protected", isLoggedIn, (req, res) => {
  res.send;
  ("Hello protected!");
});

// POST
router.post("/signup", userController.signup);

router.post("/login", userController.login);

// GET
router.get("/auth/google", userController.google);

router.get("/auth/google/callback", userController.googleCB);

router.get("/auth/failure", userController.failedLogin);

router.get("/protected", userController.succesfulLogin);

router.get("/data", userController.userData);

router.get("/timezone", userController.timezone);

router.get("/logout", userController.logout);

// PUT
router.put("/:userId/updateEmail", userController.updateEmail);

router.put("/:userId/updateName", userController.updateName);

router.put("/:userId/updateUsername", userController.updateUsername);

router.put("/:userId/updateTimezone", userController.updateTimezone);

// DELETE

router.delete("/:userId/account", userController.deleteAccount);
