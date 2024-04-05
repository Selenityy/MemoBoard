const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const TagSchema = new Schema({
  name: { type: String, minLength: 2, maxLenght: 20 },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

// virtual url to add more tags
TagSchema.virtual("url").get(function () {
  return `/tags/${this._id}`;
});

module.exports = mongoose.model("Tags", TagSchema);
