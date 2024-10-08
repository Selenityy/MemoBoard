const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SectionSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true, maxLength: 100 },
  memos: [{ type: Schema.Types.ObjectId, ref: "Memo" }],
  index: { type: Number },
  project: { type: Schema.Types.ObjectId, ref: "Project", required: true },
});

module.exports = mongoose.model("Section", SectionSchema);
