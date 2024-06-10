const express = require("express");
const router = express.Router();
const sectionController = require("../controllers/sectionController");

// /dashboard/sections/...
router.get("/all-sections", sectionController.getAllSections);
router.get("/:sectionId", sectionController.getSpecificSection);
router.post("/create", sectionController.createSection);
router.put("/:sectionId/update", sectionController.updateSection);
router.delete("/:sectionId/delete", sectionController.deleteSection);

module.exports = router;
