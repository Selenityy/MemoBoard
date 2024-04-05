const asyncHandler = require("express-async-handler");
const Memo = require("../models/memoModel");
const Tag = require("../models/tagModel");
const User = require("../models/userModel");
const { body, validationResult } = require("express-validator");
const { mongoose } = require("mongoose");

// Display all parent memos
exports.getAllParentMemos = asyncHandler(async (req, res, next) => {
  const userId = req.user._id; // Assuming req.user is populated by Passport's JWT strategy
  try {
    const parentMemos = await Memo.find({ user: userId, parentId: null });
    if (!parentMemos) {
      return res.status(404).json({ message: "All parent memos not found" });
    }
    const parentMemosObject = parentMemos.map((memo) =>
      memo.toObject({ virtuals: true })
    );
    res.json({
      message: "Successfully retrieved all parent memos",
      parentMemos: [parentMemosObject],
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Server error, cannot display all parent memos" });
  }
});

// Display all children memos
exports.getAllChildrenMemosOfAParentMemo = asyncHandler(
  async (req, res, next) => {
    const parentId = req.params.memoId; // get parentId from the URL params
    const userId = req.user._id; // Assuming req.user is populated by Passport's JWT strategy

    try {
      const childMemos = await Memo.find({ parentId, user: userId });
      if (!childMemos) {
        return res.status(404).json({ message: "Child memo not found" });
      }
      const childMemosObject = childMemos.map((memo) =>
        memo.toObject({ virtuals: true })
      );
      res.json({
        message: "Successfully retrieved all children memos",
        childMemos: [childMemosObject],
      });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: "Server error, cannot display children memos" });
    }
  }
);

// Display one parent memo
exports.getSpecifictParentMemo = asyncHandler(async (req, res, next) => {
  const parentMemoId = req.params.memoId;
  const userId = req.user._id; // Assuming req.user is populated by Passport's JWT strategy

  try {
    const specificParentMemo = await Memo.findOne({
      _id: parentMemoId,
      user: userId,
    });
    if (!specificParentMemo) {
      return res
        .status(404)
        .json({ message: "Specific parent memo not found" });
    }
    const specificParentMemoObject = specificParentMemo.toObject({
      virtuals: true,
    });
    res.json({
      message: "Successfully retrieved a specific parent memo",
      parentMemo: specificParentMemoObject,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Server error, cannot diaplay specific parent memo" });
  }
});

// Create a memo
exports.createMemo = asyncHandler(async (req, res, next) => {
  const { body, dueDateTime, progress, tags, priority, notes, parentId } =
    req.body;
  const userId = req.user._id; // Assuming req.user is populated by Passport's JWT strategy

  try {
    const newMemo = new Memo({
      body,
      user: userId,
      dueDateTime,
      progress,
      tags,
      priority,
      notes,
      parentId,
    });
    await newMemo.save();
    return res
      .status(201)
      .json({ message: "Memo created successfully", newMemo: newMemo });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Server error, cannot create a memo" });
  }
});

// Update a memo
exports.updateMemo = asyncHandler(async (req, res, next) => {
  const memoId = req.params.memoId;
  const userId = req.user._id; // Assuming req.user is populated by Passport's JWT strategy

  try {
    const updatedMemo = await Memo.findOneAndUpdate(
      { _id: memoId, user: userId },
      req.body,
      {
        new: true,
      }
    );
    if (!updatedMemo) {
      return res.status(404).json({ message: "Updated memo not found" });
    }

    const updatedMemoObject = updatedMemo.toObject({
      virtuals: true,
    });
    res.json({
      message: "Successfully retrieved a specific parent memo",
      updatedMemo: updatedMemoObject,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Server error, cannot update a memo" });
  }
});

// Delete a memo
exports.deleteMemo = asyncHandler(async (req, res, next) => {
  const memoId = req.params.memoId;
  const userId = req.user._id; // Assuming req.user is populated by Passport's JWT strategy

  try {
    const deleteMemo = await Memo.findOneAndDelete({
      _id: memoId,
      user: userId,
    });
    if (!deleteMemo) {
      return res.status(404).json({ message: "Delete memo not found" });
    }

    // delete sub memos with the parent id matching the deleted memo
    await Memo.deleteMany({ parentId: memoId });

    res.json({ message: "Successfully deleted memo" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Server error, cannot delete a memo" });
  }
});
