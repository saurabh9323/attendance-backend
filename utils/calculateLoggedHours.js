function calculateLoggedHours(signInTime, signOutTime) {
  const millisecondsDiff = signOutTime - signInTime;
  const hours = millisecondsDiff / (1000 * 60 * 60);
  return hours.toFixed(2); // Return hours with 2 decimal places
}

module.exports = calculateLoggedHours;
