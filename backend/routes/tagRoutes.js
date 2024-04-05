const express = require("express");
const router = express.Router();
const tagController = require("../controllers/tagController");

router.get("/", tagController.getAllTags);
router.post("/create", tagController.createTag);
router.put("/:tagId/update", tagController.updateTag);
router.delete("/:tagId/delete", tagController.deleteTag);

module.exports = router;
