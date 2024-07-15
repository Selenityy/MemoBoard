const asyncHandler = require("express-async-handler");
const Memo = require("../models/memoModel");
const Project = require("../models/projectModel");
const { body, validationResult } = require("express-validator");

// Display all memos
exports.getAllMemos = asyncHandler(async (req, res, next) => {
  const userId = req.user._id; // Assuming req.user is populated by Passport's JWT strategy
  try {
    const memos = await Memo.find({ user: userId })
      .populate({
        path: "project",
        model: "Project",
        select: "name description user memos color _id",
      })
      .populate("parentId");
    if (!memos) {
      return res.status(404).json({ message: "All memos not found" });
    }
    const memosObject = memos.map((memo) => memo.toObject({ virtuals: true }));
    res.json({
      message: "Successfully retrieved all memos",
      memos: memosObject,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error, cannot display all memos" });
  }
});

// Display all parent memos
exports.getAllParentMemos = asyncHandler(async (req, res, next) => {
  const userId = req.user._id; // Assuming req.user is populated by Passport's JWT strategy
  try {
    const parentMemos = await Memo.find({
      user: userId,
      parentId: null,
    }).populate({
      path: "project",
      model: "Project",
      select: "name description user memos color _id",
    });
    if (!parentMemos) {
      return res.status(404).json({ message: "All parent memos not found" });
    }
    const parentMemosObject = parentMemos.map((memo) =>
      memo.toObject({ virtuals: true })
    );
    // console.log("backend parent memos:", parentMemosObject);
    res.json({
      message: "Successfully retrieved all parent memos",
      parentMemos: parentMemosObject,
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
      const childMemos = await Memo.find({ parentId, user: userId })
        .populate({
          path: "parentId",
          model: "Memo",
          populate: [
            {
              path: "parentId",
              model: "Memo",
              populate: [
                { path: "parentId", model: "Memo" },
                {
                  path: "project",
                  model: "Project",
                  select: "name description user memos color _id",
                },
              ],
            },
            {
              path: "project",
              model: "Project",
              select: "name description user memos color _id",
            },
          ],
        })
        .populate({
          path: "project",
          model: "Project",
          select: "name description user memos color _id",
        });
      if (!childMemos) {
        return res.status(404).json({ message: "Child memo not found" });
      }
      const childMemosObject = childMemos.map((memo) =>
        memo.toObject({ virtuals: true })
      );
      res.json({
        message: "Successfully retrieved all children memos",
        childMemos: childMemosObject,
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
    }).populate({
      path: "project",
      model: "Project",
      select: "name description user memos color _id",
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
exports.createMemo = [
  // Validation middleware
  body("body")
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("The memo body must be between 1 and 100 characters long."),
  body("dueDateTime")
    .optional({ checkFalsy: true })
    .isISO8601()
    .toDate()
    .withMessage("The due date must be a valid date."),
  body("progress")
    .isIn(["Not Started", "Active", "Pending", "Completed", "Cancelled"])
    .withMessage("Invalid progress status."),
  body("priority")
    .optional({ checkFalsy: true })
    .isIn(["Low", "Medium", "High"])
    .withMessage("Invalid priority value."),
  body("notes")
    .optional()
    .isLength({ max: 300 })
    .withMessage("Notes must be 300 characters or less."),
  body("tags")
    .optional({ checkFalsy: true })
    .isArray()
    .withMessage("Tags must be an array."),
  body("tags.*")
    .isMongoId()
    .withMessage("Each tag must be a valid MongoDB ObjectId."),
  body("parentId")
    .optional({ nullable: true, checkFalsy: true })
    .isMongoId()
    .withMessage("ParentId must be a valid MongoDB ObjectId."),
  body("project").optional({ checkFalsy: true }).isMongoId(),

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

    const {
      body,
      dueDateTime,
      progress,
      tags,
      priority,
      notes,
      parentId,
      project,
    } = req.body;
    try {
      let parentProject = project;
      if (!parentProject && parentId) {
        const parentMemo = await Memo.findById(parentId);
        if (parentMemo && parentMemo.project) {
          parentProject = parentMemo.project;
        }
      }

      const newMemo = new Memo({
        body,
        user: userId,
        dueDateTime,
        progress,
        tags,
        priority,
        notes,
        parentId,
        project: parentProject,
      });
      await newMemo.save();

      if (parentProject) {
        await Project.findByIdAndUpdate(
          parentProject,
          {
            $push: { memos: newMemo._id },
          },
          { new: true }
        );
      }

      await Project.findByIdAndUpdate(
        project,
        {
          $push: { memos: newMemo._id },
        },
        { new: true }
      );
      return res
        .status(201)
        .json({ message: "Memo created successfully", newMemo: newMemo });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: "Server error, cannot create a memo" });
    }
  }),
];

// Update a memo
exports.updateMemo = asyncHandler(async (req, res, next) => {
  const memoId = req.params.memoId;
  const userId = req.user._id; // Assuming req.user is populated by Passport's JWT strategy
  const { project, ...updateFields } = req.body;

  try {
    // const updatedMemo = await Memo.findOneAndUpdate(
    //   { _id: memoId, user: userId },
    //   req.body,
    //   {
    //     new: true,
    //     runValidators: true,
    //   }
    // );
    const updateData = {
      $set: {
        ...updateFields,
        project: project === null ? null : project,
      },
    };
    const updatedMemo = await Memo.findByIdAndUpdate(memoId, updateData, {
      new: true,
      runValidators: true,
    });

    await Project.findByIdAndUpdate(project, {
      $push: { memos: updatedMemo._id },
    });

    if (!updatedMemo) {
      return res.status(404).json({ message: "Updated memo not found" });
    }

    const updatedMemoObject = updatedMemo.toObject({
      virtuals: true,
    });
    res.json({
      message: "Successfully updated a specific parent memo",
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

    res.status(200).json({ message: "Successfully deleted memo" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Server error, cannot delete a memo" });
  }
});
