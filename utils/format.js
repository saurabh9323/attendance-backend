// utils/formatDate.js

// Define a function to format date in dd/mm/yyyy format
function formatDate(date) {
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
}

// Define a function to format time in 12-hour format
function formatTime(date) {
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const period = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12; // Convert hours to 12-hour format
  return `${hours}:${minutes} ${period}`;
}

module.exports = { formatDate, formatTime };
