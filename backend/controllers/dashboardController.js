const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

exports.userData = asyncHandler(async (req, res, next) => {
  // go to the home page
  // display all memos
  // display username
});

exports.timezone = asyncHandler(async (req, res, next) => {
  // set the timezone
});

exports.updateProfileGoogleAuth = asyncHandler(async (req, res, next) => {
  const { username, timezone } = req.body;
  const userId = req.user._id;

  try {
    await User.findByIdAndUpdate(
      userId,
      { username, timezone },
      { new: true, runValidators: true }
    );
    res.json({ message: "Profile updated successfully." });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating profile.", error: error.message });
  }
});

exports.updateEmail = asyncHandler(async (req, res, next) => {
  const { newEmail } = req.body;
  const userId = req.user._id;
  if (!newEmail) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { email: newEmail },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "Successfully updated email",
      email: updatedUser.email,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Server error, cannot update email" });
  }
});

exports.updateName = asyncHandler(async (req, res, next) => {
  const { newFirstName, newLastName } = req.body;
  const userId = req.user._id;
  if (!newFirstName || !newLastName) {
    return res.status(400).json({ message: "First and last name is required" });
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { firstName: newFirstName, lastName: newLastName },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "Successfully updated full name",
      user: {
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
      },
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Server error, cannot update full name" });
  }
});

exports.updateUsername = asyncHandler(async (req, res, next) => {
  const { newUsername } = req.body;
  const userId = req.user._id;
  if (!newUsername) {
    return res.status(400).json({ message: "Username is required" });
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { username: newUsername },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "Successfully updated username",
      username: updatedUser.username,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Server error, cannot update username" });
  }
});

exports.updateTimezone = asyncHandler(async (req, res, next) => {
  const { newTimezone } = req.body;
  const userId = req.user._id;
  if (!newTimezone) {
    return res.status(400).json({ message: "Timezone is required" });
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { timezone: newTimezone },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "Successfully updated timezone",
      timezone: updatedUser.timezone,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Server error, cannot update timezone" });
  }
});

exports.deleteAccount = asyncHandler(async (req, res, next) => {
  // confirm deletion
  // delete the account
});
