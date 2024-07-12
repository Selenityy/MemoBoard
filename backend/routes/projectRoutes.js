const express = require("express");
const router = express.Router();
const passport = require("passport");
const projectController = require("../controllers/projectController");
const sectionRoutes = require("../routes/sectonRoutes");

router.get("/", projectController.listProjects);
router.get("/:projectId", projectController.getProject);
router.post("/create", projectController.createProject);
router.put("/:projectId/update", projectController.updateProject);
router.delete("/:projectId/delete", projectController.deleteProject);

router.use(
  "/:projectId/sections",
  passport.authenticate("jwt", { session: false }),
  sectionRoutes
);

module.exports = router;
