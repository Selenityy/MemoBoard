const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ProjectSchema = new Schema({
  name: { type: String, required: true, maxLength: 100 },
  description: { type: String, maxLength: 300 },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  memos: [{ type: Schema.Types.ObjectId, ref: "Memo" }],
  color: { type: String, required: true },
  sections: [{ type: Schema.Types.ObjectId, ref: "Section" }],
});

module.exports = mongoose.model("Project", ProjectSchema);
