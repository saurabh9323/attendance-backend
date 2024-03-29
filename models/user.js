const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, unique: true },
  phone: { type: String },
  role: { type: String, default: "user", enum: ["user", "admin"] },
  // role: { type: String, required: true, enum: ["user", "admin"] },
  createDate: { type: String },
});

module.exports = mongoose.model("User", userSchema);
