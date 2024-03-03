const AttendanceRecord = require("../models/attendance");
const User = require("../models/user");
const { formatDate, formatTime } = require("../utils/format");
const calculateLoggedHours = require("../utils/calculateLoggedHours");
const getAllDatesInRange = require("../utils/getAllDatesInRange");

exports.signIn = async (req, res) => {
  try {
    const { username } = req.user;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const signInTime = new Date();
    const formattedDate = formatDate(signInTime);
    const formattedTime = formatTime(signInTime);
    const signInDateTime = `${formattedDate} ${formattedTime}`;
    const attendanceRecord = new AttendanceRecord({
      userId: user._id,
      username,
      signInTime,
      signInTimeFormatted: signInDateTime,
    });
    await attendanceRecord.save();
    res.status(200).json({ message: "Sign-in successful" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.signOut = async (req, res) => {
  try {
    const { username } = req.user;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const attendanceRecord = await AttendanceRecord.findOne({
      userId: user._id,
      signOutTime: null,
    }).sort({ signInTime: -1 });
    if (!attendanceRecord) {
      return res.status(400).json({ message: "No sign-in record found" });
    }
    const signOutTime = new Date();
    attendanceRecord.signOutTime = signOutTime;
    const formattedDate = formatDate(signOutTime);
    const formattedTime = formatTime(signOutTime);
    attendanceRecord.signOutTimeFormatted = `${formattedDate} ${formattedTime}`;
    const signInTime = attendanceRecord.signInTime;
    const loggedHours = calculateLoggedHours(signInTime, signOutTime);
    attendanceRecord.loggedHours = loggedHours;
    await attendanceRecord.save();
    res.status(200).json({ message: "Sign-out successful" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.attendReports = async (req, res) => {
  try {
    const { username } = req.user;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const attendanceRecords = await AttendanceRecord.find({ userId: user._id });

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
      user: {
        username: user.username,
        email: user.email,
        phone: user.phone,
      },
      attendance: attendanceRecords.map((record) => ({
        date: formatDate(record.signInTime),
        signInTime: record.signInTimeFormatted,
        signOutTime: record.signOutTimeFormatted,
        loggedHours: record.loggedHours,
      })),
      absentDays: formattedAbsentDays, // Include formatted absent days in the report
    };

    res.status(200).json(report);
  } catch (error) {
    console.error("Failed to generate attendance report:", error);
    res.status(500).json({ message: "Failed to generate attendance report" });
  }
};
