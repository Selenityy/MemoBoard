const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const Memo = require("../models/memoModel");
const Tag = require("../models/tagModel");

exports.userData = asyncHandler(async (req, res, next) => {
  const userId = req.user._id; // Assuming req.user is populated by Passport's JWT strategy
  try {
    const userData = await User.findById(userId);

    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "Successfully retrieved user profile data.",
      user: userData,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Server error, cannot retrieve user data." });
  }
});

exports.timezone = asyncHandler(async (req, res, next) => {
  const { updatedTimezone } = req.body;
  const userId = req.user._id; // Assuming req.user is populated by Passport's JWT strategy

  if (!updatedTimezone) {
    return res.status(400).json({ message: "Timezone is required." });
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { timezone: updatedTimezone },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found." });
    }

    res.json({
      message: "Successfully updated timezone.",
      timezone: updatedUser.timezone,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error, cannot update timezone." });
  }
});

exports.updateProfileGoogleAuth = asyncHandler(async (req, res, next) => {
  const { username, timezone } = req.body;
  const userId = req.user._id; // Assuming req.user is populated by Passport's JWT strategy

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
  const userId = req.user._id; // Assuming req.user is populated by Passport's JWT strategy
  //   if (!newEmail) {
  //     return res.status(400).json({ message: "Email is required." });
  //   }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { email: newEmail },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found." });
    }

    res.json({
      message: "Successfully updated email.",
      email: updatedUser.email,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Server error, cannot update email." });
  }
});

exports.updateName = asyncHandler(async (req, res, next) => {
  const { newFirstName, newLastName } = req.body;
  const userId = req.user._id; // Assuming req.user is populated by Passport's JWT strategy
  //   if (!newFirstName || !newLastName) {
  //     return res
  //       .status(400)
  //       .json({ message: "First and last name is required." });
  //   }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { firstName: newFirstName, lastName: newLastName },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found." });
    }

    res.json({
      message: "Successfully updated full name.",
      user: {
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
      },
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Server error, cannot update full name." });
  }
});

exports.updateUsername = asyncHandler(async (req, res, next) => {
  const { newUsername } = req.body;
  const userId = req.user._id; // Assuming req.user is populated by Passport's JWT strategy
  //   if (!newUsername) {
  //     return res.status(400).json({ message: "Username is required" });
  //   }

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
      message: "Successfully updated username.",
      username: updatedUser.username,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Server error, cannot update username." });
  }
});

exports.updateTimezone = asyncHandler(async (req, res, next) => {
  const { newTimezone } = req.body;
  const userId = req.user._id; // Assuming req.user is populated by Passport's JWT strategy
  if (!newTimezone) {
    return res.status(400).json({ message: "Timezone is required." });
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
      message: "Successfully updated timezone.",
      timezone: updatedUser.timezone,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Server error, cannot update timezone." });
  }
});

exports.deleteAccount = asyncHandler(async (req, res, next) => {
  const userId = req.user._id; // Assuming req.user is populated by Passport's JWT strategy
  try {
    await Memo.deleteMany({ user: userId });
    await Tag.deleteMany({ user: userId });
    await User.findByIdAndDelete(userId);

    // if (!user) {
    //   return res.status(404).json({ message: "User not found." });
    // }

    res.status(200).json({
      message:
        "User account and all related memos and tags have been successfully deleted.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error, cannot delete account." });
  }
});

exports.getUserNotes = asyncHandler(async (req, res, next) => {
  const userId = req.user._id; // Assuming req.user is populated by Passport's JWT strategy
  try {
    const user = await User.findById(userId).select("notes");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({
      message: "Successfully retreieved user notes.",
      notes: user.notes,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Server error, cannot retrieve user notes" });
  }
});

exports.updateUserNotes = asyncHandler(async (req, res, next) => {
  const userId = req.user._id; // Assuming req.user is populated by Passport's JWT strategy
  const { notes } = req.body;
  // console.log("backend id:", userId);
  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { notes },
      { new: true }
    ).select("notes");
    // if (!user) {
    //   return res.status(404).json({ message: "User not found" });
    // }
    res.json({ message: "Notes updated successfully", notes: user.notes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error, cannot update user notes" });
  }
});
