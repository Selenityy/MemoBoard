const asyncHandler = require("express-async-handler");
const Tag = require("../models/tagModel");
const { body, validationResult } = require("express-validator");

// Display all tags
exports.getAllTags = asyncHandler(async (req, res, next) => {
  const userId = req.user._id; // Assuming req.user is populated by Passport's JWT strategy
  try {
    const tags = await Tag.find({ user: userId });
    if (!tags) {
      return res.status(404).json({ message: "All tags are not found" });
    }
    const tagObjects = tags.map((tag) => tag.toObject({ virtuals: true }));
    res.json({
      message: "Successfully retrieved all tags",
      tags: tagObjects,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error, cannot display all tags" });
  }
});

// Create a tag
exports.createTag = [
  // Validation middleware
  body("name")
    .trim()
    .isLength({ min: 2, max: 20 })
    .withMessage("The tag name must be between 2 and 20 characters long."),
  body("user")
    .isMongoId()
    .withMessage("User must be a valid MongoDB ObjectId."),

  // Controller logic
  asyncHandler(async (req, res, next) => {
    const userId = req.user._id; // Assuming req.user is populated by Passport's JWT strategy

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: "Errors with validation result",
        errors: errors.array(),
      });
    }

    const { name } = req.body;
    try {
      const newTag = new Tag({
        name,
        user: userId,
      });
      await newTag.save();
      return res
        .status(201)
        .json({ message: "Tag created successfully", newTag: newTag });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error, cannot create tag" });
    }
  }),
];

// Update an existing tag
exports.updateTag = asyncHandler(async (req, res, next) => {
  const userId = req.user._id; // Assuming req.user is populated by Passport's JWT strategy
  const tagId = req.params.tagId;

  try {
    const updatedTag = await Tag.findOneAndUpdate(
      { _id: tagId, user: userId },
      req.body,
      { new: true }
    );
    if (!updatedTag) {
      return res.status(404).json({ message: "Updated tag not found" });
    }

    const updatedTagObject = updatedTag.toObject({ virtuals: true });
    res.json({
      message: "Successfully updated a tag",
      updatedTag: updatedTagObject,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Server error, cannot update existing tag" });
  }
});

// Delete a tag
exports.deleteTag = asyncHandler(async (req, res, next) => {
  const userId = req.user._id; // Assuming req.user is populated by Passport's JWT strategy
  const tagId = req.params.tagId;

  try {
    const deleteTag = await Tag.findOneAndDelete({
      _id: tagId,
      user: userId,
    });
    if (!deleteTag) {
      return res.status(400).json({ message: "Delete tag not found" });
    }
    res.status(204).json({ message: "Successfully deleted tag" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Server error, cannot delete a tag" });
  }
});
