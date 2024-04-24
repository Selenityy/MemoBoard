const express = require("express");
const router = express.Router();
const projectController = require("../controllers/projectController");

router.get("/", projectController.listProjects);
router.get("/:projectId", projectController.getProject);
router.post("/create", projectController.createProject);
router.put("/:projectId/update", projectController.updateProject);
router.delete("/:projectId/delete", projectController.deleteProject);

module.exports = router;
