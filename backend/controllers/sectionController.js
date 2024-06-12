const asyncHandler = require("express-async-handler");
const Section = require("../models/sectionModel");
const Project = require("../models/projectModel");
const Memo = require("../models/memoModel");
const { body, validationResult } = require("express-validator");

// Display all the sections within a project
exports.getAllSections = asyncHandler(async (req, res, next) => {
  const projectId = req.params.projectId;
  const userId = req.user._id; // Assuming req.user is populated by Passport's JWT strategy
  try {
    const sections = await Section.find({ user: userId, project: projectId });
    if (!sections) {
      return res.status(404).json({ message: "All sections not found" });
    }
    const sectionObject = sections.map((section) =>
      section.toObject({ virtuals: true })
    );
    res.json({
      message: "Successfully retrieved all sections",
      sections: sectionObject,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Server error, cannot display all sections" });
  }
});

// Diplay one specific section within a project
exports.getSpecificSection = asyncHandler(async (req, res, next) => {
  const projectId = req.params.projectId;
  const sectionId = req.params.sectionId;
  const userId = req.user._id; // Assuming req.user is populated by Passport's JWT strategy
  try {
    const section = await Section.findOne({
      _id: sectionId,
      user: userId,
      project: projectId,
    })
      .populate({
        path: "memos",
        select:
          "body user dueDateTime progress tags priority notes parentId project",
      })
      .exec();
    console.log("backend section:", section);
    if (!section) {
      return res.status(404).json({ message: "Specific section not found" });
    }
    res.json({
      message: "Successfully retrieved a specific section",
      section: section,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Server error, cannot get specific section" });
  }
});

// Create a section within a project
exports.createSection = [
  body("name")
    .trim()
    .isLength({ max: 100 })
    .withMessage("The section name must be 100 characters or less"),
  body("memos")
    .optional({ checkFalsy: true })
    .isMongoId()
    .withMessage("Each memo must be a valid MongoDB ObjectId."),
  body("index").isNumeric(),
  body("project")
    .isMongoId()
    .withMessage("Project must be a valid MongoDB ObjectId."),
  body("user").isMongoId().withMessage("User must be a valid MongoDB ObjectId"),

  asyncHandler(async (req, res, next) => {
    const projectId = req.params.projectId;
    const userId = req.user._id; // Assuming req.user is populated by Passport's JWT strategy

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: "Errors with validation result",
        errors: errors.array(),
      });
    }

    const { name, memos, index } = req.body;
    try {
      let newSection = new Section({
        user: userId,
        name,
        memos,
        index,
        project: projectId,
      });
      console.log("backend new section:", newSection);
      await newSection.save();

      // update project with the section
      await Project.findByIdAndUpdate(projectId, {
        $push: { sections: newSection._id },
      });

      return res.status(201).json({
        message: "Section created successfully",
        newSection: newSection,
      });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: "Server error, cannot create a section" });
    }
  }),
];

// Add one memo to section
exports.addMemoToSection = asyncHandler(async (req, res, next) => {
  const projectId = req.params.projectId;
  const sectionId = req.params.sectionId;
  const memoId = req.params.memoId;
  const userId = req.user._id; // Assuming req.user is populated by Passport's JWT strategy
  try {
    const updatedSectionMemo = await Section.findOneAndUpdate(
      { _id: sectionId, user: userId, project: projectId },
      { $push: { memos: memoId } },
      { new: true }
    );
    console.log("backend updated section memo:", updatedSectionMemo);
    if (!updatedSectionMemo) {
      return res
        .status(404)
        .json({ message: "Updated section memo not found" });
    }
    res.json({
      message: "Successfully updated section with memo",
      updatedSectionMemo: updatedSectionMemo,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Server error, cannot add memo to specific section" });
  }
});

// Add multiple memos to a section
exports.addMultipleMemosToSection = asyncHandler(async (req, res, next) => {
  const projectId = req.params.projectId;
  const sectionId = req.params.sectionId;
  const userId = req.user._id; // Assuming req.user is populated by Passport's JWT strategy
  const memoIdsToAdd = req.body.memoIds;
  console.log("memo ids to add:", memoIdsToAdd);
  //   if (!Array.isArray(memoIdsToAdd)) {
  //     return res
  //       .status(400)
  //       .json({ message: "Invalid memo IDs provided, must be an array." });
  //   }
  try {
    const updatedSectionMemos = await Section.findOneAndUpdate(
      { _id: sectionId, user: userId, project: projectId },
      { $push: { memos: { $each: memoIdsToAdd } } },
      { new: true, runValidators: true }
    ).populate("memos");
    console.log("backend updated section all memos:", updatedSectionMemos);
    if (!updatedSectionMemos) {
      return res
        .status(404)
        .json({ message: "Updated section all memos not found" });
    }
    res.json({
      message: "Successfully updated section with all memos",
      updatedSectionMemos: updatedSectionMemos,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error, cannot add all memos to specific section",
    });
  }
});

// Update a section within a project
exports.updateSection = asyncHandler(async (req, res, next) => {
  const projectId = req.params.projectId;
  const sectionId = req.params.sectionId;
  const userId = req.user._id; // Assuming req.user is populated by Passport's JWT strategy
  try {
    const updatedSection = await Section.findOneAndUpdate(
      {
        _id: sectionId,
        user: userId,
        project: projectId,
      },
      req.body,
      { new: true, runValidators: true }
    );
    console.log("backend updated section:", updatedSection);
    if (!updatedSection) {
      return res.status(404).json({ message: "Updated section not found" });
    }
    res.json({
      message: "Successfully updated a specific section",
      updatedSection: updatedSection,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Server error, cannot update specific section" });
  }
});

// Delete a section within a project
exports.deleteSection = asyncHandler(async (req, res, next) => {
  const projectId = req.params.projectId;
  const sectionId = req.params.sectionId;
  const userId = req.user._id; // Assuming req.user is populated by Passport's JWT strategy
  try {
    const deletedSection = await Section.findOneAndDelete({
      _id: sectionId,
      user: userId,
      project: projectId,
    });
    console.log("backend deleted section:", deletedSection);
    if (!deletedSection) {
      return res.status(404).json({ message: "Deleted section not found" });
    }
    res.status(204).json({ message: "Successfully deleted section" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Server error, cannot delete specific section" });
  }
});
