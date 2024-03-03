const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  username: { type: String },
  signInTime: { type: Date, required: true },
  signOutTime: { type: Date },
  signInTimeFormatted: { type: String },
  signOutTimeFormatted: { type: String },
  loggedHours: { type: String },
  absentDays: [{ type: Date }],
  formattedAbsentDays: [{ type: String }], // Add formatted absent days field
});

module.exports = mongoose.model("AttendanceRecord", attendanceSchema);
