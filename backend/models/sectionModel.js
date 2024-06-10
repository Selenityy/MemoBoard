const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SectionSchema = new Schema({
  name: { type: String, required: true, maxLength: 100 },
  memos: [{ type: Schema.Types.ObjectId, ref: "Memo" }],
  index: { type: Number, required: true, default: 0 },
  project: { type: Schema.Types.ObjectId, ref: "Project", required: true },
});

module.exports = mongoose.model("Section", SectionSchema);
