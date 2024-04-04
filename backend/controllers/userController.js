const asyncHandler = require("express-async-handler");
const { hashPassword } = require("../helpers/bcrypt");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const JwtStrategy = require("passport-jwt").Strategy;
const mongoose = require("mongoose");

// Sign up
exports.signup = asyncHandler(async (req, res, next) => {
  const { username, email, password, firstName, lastName } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are requried" });
  }

  const exisitingUser = await User.findOne({ $or: [{ username }, { email }] });
  if (exisitingUser) {
    return res
      .status(400)
      .json({ message: "Username or email already exists" });
  }

  const hashedPassword = await hashPassword(password);
  const newUser = new User({
    username,
    password: hashedPassword,
    email,
    firstName,
    lastName,
  });
  await newUser.save();

  return res
    .status(201)
    .json({ message: "User created successfully", newUser });
});

// Login
exports.login = asyncHandler(async (req, res, next) => {
  passport.authenticate(
    "local",
    { session: false, failureRedirect: "/login", failureMessage: true },
    async (err, user, info) => {
      if (!user) {
        return res.status(401).json({ message: "User does not exist" });
      }
      try {
        const populatedUser = await User.findById(user._id)
          .select("-password")
          .populate("email")
          .populate("username")
          .populate("firstName")
          .populate("lastName")
          .exec();

        const token = jwt.sign(
          { id: populatedUser._id },
          process.env.SESSION_SECRET,
          {
            expiresIn: "1d",
          }
        );

        res.status(200).json({ user: populatedUser, token });
      } catch (error) {
        next(error);
      }
    }
  )(req, res, next);
});

//Google Auth
exports.google = passport.authenticate("google", {
  scope: ["email", "profile"],
});

exports.googleCB = (req, res, next) => {
  passport.authenticate(
    "google",
    { failureRedirect: "/auth/failure" },
    (err, user, info) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.redirect("/auth/failure");
      }

      try {
        const token = jwt.sign({ id: user._id }, process.env.SESSION_SECRET, {
          expiresIn: "1d",
        });
        res.status(200).json({ user, token });
      } catch (error) {
        next(error);
      }
    }
  )(req, res, next);
};

// Logout
exports.logout = asyncHandler(async (req, res, next) => {
  res.json({ message: "Logged out" });
});
