const asyncHandler = require("express-async-handler");
const Project = require("../models/projectModel");
const Memo = require("../models/memoModel");
const { body, validationResult } = require("express-validator");

// Display all Projects
exports.listProjects = asyncHandler(async (req, res, next) => {
  const userId = req.user._id; // Assuming req.user is populated by Passport's JWT strategy
  try {
    const projects = await Project.find({ user: userId }).populate({
      path: "memos",
      select:
        "body user dueDateTime progress tags priority notes parentId project sections", // specify all fields you need
      populate: {
        path: "tags",
        select: "name", // populate tags within memos if needed
      },
    });
    if (!projects) {
      return res.status(404).json({ message: "All projects not found" });
    }
    res.json({
      message: "Successfully retrieved all projects",
      projects: projects,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Server error, cannot display all projects" });
  }
});

// Fetch a specific project
exports.getProject = asyncHandler(async (req, res, next) => {
  const projectId = req.params.projectId;
  const userId = req.user._id; // Assuming req.user is populated by Passport's JWT strategy
  try {
    const project = await Project.findOne({
      _id: projectId,
      user: userId,
    })
      .populate({
        path: "memos",
        select:
          "body user dueDateTime progress tags priority notes parentId project", // specify all fields you need
        populate: {
          path: "tags",
          select: "name", // populate tags within memos if needed
        },
      })
      .exec();
    if (!project) {
      return res.status(404).json({ message: "Specific project not found" });
    }
    // console.log(project);
    res.json({
      message: "Successfully retrieved a specific project",
      project: project,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Server error, cannot display a specific project" });
  }
});

exports.createProject = [
  body("name")
    .trim()
    .isLength({ max: 100 })
    .withMessage("The project name must 100 characters or less"),
  body("color"),
  body("description")
    .trim()
    .optional()
    .isLength({ max: 300 })
    .withMessage("Descriptions must be 300 characters or less"),

  asyncHandler(async (req, res, next) => {
    const userId = req.user._id; // Assuming req.user is populated by Passport's JWT strategy

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: "Errors with validation result",
        errors: errors.array(),
      });
    }

    const { name, description, color } = req.body;
    try {
      const newProject = new Project({
        name,
        description,
        color,
        user: userId,
      });
      await newProject.save();
      return res.status(201).json({
        message: "Project created successfully",
        newProject: newProject,
      });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: "Server error, cannot create a project" });
    }
  }),
];

exports.updateProject = asyncHandler(async (req, res) => {
  const projectId = req.params.projectId;
  const { addMemos, removeMemos, ...updateFields } = req.body;

  try {
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Remove memos from the project
    if (removeMemos && removeMemos.length) {
      project.memos = project.memos.filter(
        (memoId) => !removeMemos.includes(memoId.toString())
      );
    }

    // Add new memos to the project
    if (addMemos && addMemos.length) {
      const uniqueAddMemos = addMemos.filter(
        (memoId) => !project.memos.includes(memoId)
      );
      project.memos = [...project.memos, ...uniqueAddMemos];
    }

    // Update other project fields
    Object.keys(updateFields).forEach((key) => {
      project[key] = updateFields[key];
    });

    await project.save();
    // console.log("backend project:", project);

    res.status(200).json({
      message: "Project updated successfully",
      project,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Server error, cannot update the project" });
  }
});

exports.deleteProject = asyncHandler(async (req, res, next) => {
  const projectId = req.params.projectId;
  const userId = req.user._id; // Assuming req.user is populated by Passport's JWT strategy
  try {
    const deleteProject = await Project.findOneAndDelete({
      _id: projectId,
      user: userId,
    });
    if (!deleteProject) {
      return res.status(404).json({ message: "Delete project not found" });
    }

    // delete memos associated with the project
    await Memo.deleteMany({ project: projectId });

    res.status(204).json({ message: "Successfully deleted project" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Server error, cannot delete a project" });
  }
});
