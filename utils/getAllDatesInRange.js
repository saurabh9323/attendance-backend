const getAllDatesInRange = (startDate, endDate) => {
  const dates = [];
  for (
    let date = new Date(startDate);
    date <= endDate;
    date.setDate(date.getDate() + 1)
  ) {
    dates.push(new Date(date));
  }
  return dates;
};
module.exports = getAllDatesInRange;
