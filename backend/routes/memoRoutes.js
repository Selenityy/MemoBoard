const express = require("express");
const router = express.Router();
const memoController = require("../controllers/memoController");

router.get("/all-memos", memoController.getAllMemos);
router.get("/", memoController.getAllParentMemos);
router.get("/:memoId", memoController.getSpecifictParentMemo);
router.get(
  "/:memoId/children",
  memoController.getAllChildrenMemosOfAParentMemo
);
router.post("/create", memoController.createMemo);
router.put("/:memoId/update", memoController.updateMemo);
router.delete("/:memoId/delete", memoController.deleteMemo);

module.exports = router;
