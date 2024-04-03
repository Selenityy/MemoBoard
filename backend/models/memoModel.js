const mongoose = require("mongoose");
import { DateTime } from "luxon";

const Schema = mongoose.Schema;

const MemoSchema = new Schema({
  body: { type: String, required: true, maxLength: 100 },
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
  memo: [{ type: Schema.Types.ObjectId, ref: "Memo" }],
});

MemoSchema.virtual("url").get(function () {
  return `/memo/${this._id}`;
});

MemoSchema.virtual("dueDateTime_formatted").get(function () {
  const customFormat = "ccc, LLL dd, h:mm a"; // Wed, Apr 03, 4:00PM
  return DateTime.fromJSDate(this.dueDateTime).toFormat(customFormat);
});

module.exports = mongoose.model("Memo", MemoSchema);
