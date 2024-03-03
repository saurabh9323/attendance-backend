const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const attendanceController = require("../controllers/attendanceController");
const adminController = require("../controllers/adminController");
const ProtectedRoute = require("../middleware/ProtectedRoute");
// Authentication routes
router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/signin", ProtectedRoute, attendanceController.signIn);
router.post("/signout", ProtectedRoute, attendanceController.signOut);
router.get(
  "/attendance/report",
  ProtectedRoute,
  attendanceController.attendReports
);
router.get("/admin/report", ProtectedRoute, adminController.attendanceReport);
router.get(
  "/admin/report/:username",
  ProtectedRoute,
  adminController.viewAttendance
);
module.exports = router;
