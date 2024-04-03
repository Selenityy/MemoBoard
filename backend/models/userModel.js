const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  firstName: { type: String, required: true, minLength: 2, maxLength: 100 },
  lastName: { type: String, required: true, minLength: 2, maxLength: 100 },
  username: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 20,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: (value) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      },
      message: "Please provide a valid email address",
    },
  },
  password: { type: String, required: true },
});

module.exports = mongoose.model("User", UserSchema);