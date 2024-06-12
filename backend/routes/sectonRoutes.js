const express = require("express");
const router = express.Router({ mergeParams: true }); // for accessing params from parent router
const sectionController = require("../controllers/sectionController");

// /dashboard/projects/:projectId/sections/...
router.get("/", sectionController.getAllSections);
router.get("/:sectionId", sectionController.getSpecificSection);
router.post("/create", sectionController.createSection);
router.post("/:sectionId/memos/:memoId", sectionController.addMemoToSection);
router.post("/:sectionId/memos", sectionController.addMultipleMemosToSection);
router.put("/:sectionId/update", sectionController.updateSection);
router.delete("/:sectionId/delete", sectionController.deleteSection);

module.exports = router;
