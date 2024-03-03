const AttendanceRecord = require("../models/attendance");
const User = require("../models/user");
const { formatDate, formatTime } = require("../utils/format");
const calculateLoggedHours = require("../utils/calculateLoggedHours");
const getAllDatesInRange = require("../utils/getAllDatesInRange");

exports.attendanceReport = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const data = await User.find({ role: "user" });

    res.json(data);
  } catch (err) {
    console.error("Failed to get admin attendance report:", err);
    res.status(500).json({ message: "Failed to get admin attendance report" });
  }
};

exports.viewAttendance = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }
    const { username } = req.params;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const userId = user._id;
    const attendanceRecords = await AttendanceRecord.find({ userId });
    const startDate = new Date(user.createDate);
    const endDate = new Date();
    const allDatesInRange = getAllDatesInRange(startDate, endDate);
    const presentDates = attendanceRecords.map((record) =>
      new Date(record.signInTime).toDateString()
    );

    const absentDays = allDatesInRange.filter(
      (date) => !presentDates.includes(date.toDateString())
    );

    const formattedAbsentDays = absentDays.map((date) => formatDate(date)); // Format absent days using formatDate function

    // Loop through each attendance record and update absentDays and formattedAbsentDays
    for (const record of attendanceRecords) {
      record.absentDays = absentDays;
      record.formattedAbsentDays = formattedAbsentDays;
      await record.save(); // Save each updated record to the database
    }
    const report = {
      attendance: attendanceRecords.map((record) => ({
        date: formatDate(record.signInTime),
        signInTime: record.signInTimeFormatted,
        signOutTime: record.signOutTimeFormatted,
        loggedHours: record.loggedHours,
      })),
      absentDays: formattedAbsentDays, // Include formatted absent days in the report
    };
    res.status(200).json(report);
  } catch (err) {
    console.error("Failed to get attendance report for user:", err);
    res
      .status(500)
      .json({ message: "Failed to get attendance report for user" });
  }
};
