const mongoose = require("mongoose");
const { DateTime } = require("luxon");

const Schema = mongoose.Schema;

const MemoSchema = new Schema({
  body: { type: String, required: true, maxLength: 100 },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  dueDateTime: { type: Date },
  progress: {
    type: String,
    required: true,
    enum: ["Not Started", "Active", "Pending", "Completed", "Cancelled"],
    default: "Not Started",
  },
  tags: [{ type: Schema.Types.ObjectId, ref: "Tags" }],
  priority: {
    type: String,
    required: false,
    enum: ["Low", "Medium", "High"],
    default: null,
  },
  notes: { type: String, maxLength: 300 },
  parentId: { type: Schema.Types.ObjectId, ref: "Memo", default: null },
});

MemoSchema.virtual("url").get(function () {
  return `/memo/${this._id}`;
});

MemoSchema.virtual("dueDateTime_formatted").get(function () {
  const customFormat = "ccc, LLL dd, h:mm a"; // Wed, Apr 03, 4:00PM
  return DateTime.fromJSDate(this.dueDateTime).toFormat(customFormat);
});

module.exports = mongoose.model("Memo", MemoSchema);
