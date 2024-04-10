require("dotenv").config();
const express = require("express");
const passport = require("passport");
const cors = require("cors");
const path = require("path");
const session = require("express-session");
const logger = require("morgan");
const cookieParser = require("cookie-parser");

const authRoutes = require("../routes/authRoutes");
const dashboardRoutes = require("../routes/dashboardRoutes");

const app = express();
app.use(express.json());

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

require("../helpers/passport");
app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", authRoutes);
app.use("/dashboard", dashboardRoutes);

// app.use((req, res, next) => {
//   next(createError(404));
// });

// app.use((err, req, res, next) => {
//   res.status(err.status || 500).json({ error: err.message });
// });

  app.use((err, req, res, next) => {
    res.status(err.status || 500).json({
      message: err.message || "An error occurred",
      error: req.app.get("env") === "development" ? err : {},
    });
  });

module.exports = app;
