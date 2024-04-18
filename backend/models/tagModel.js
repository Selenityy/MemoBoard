const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const TagsSchema = new Schema({
  name: { type: String, minLength: 2, maxLength: 20 },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

// virtual url to add more tags
TagsSchema.virtual("url").get(function () {
  return `/tags/${this._id}`;
});

module.exports = mongoose.model("Tags", TagsSchema);
