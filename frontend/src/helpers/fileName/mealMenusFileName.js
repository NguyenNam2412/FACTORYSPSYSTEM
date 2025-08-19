import { formatDate } from "@utils/dateTime/formatDate";

export function parseWeekAndMonth(filename) {
  const match = filename.match(/(\d+)\.T(\d+)/i);
  if (!match) {
    console.log(
      "file name not match week.Tmonth format, expected: week.Tmonth"
    );
    return null;
  }

  const week = parseInt(match[1], 10); // number of week
  const month = parseInt(match[2], 10); // number of month
  const year = new Date().getFullYear(); // current year

  if (week < 1 || week > 5 || month < 1 || month > 12) {
    console.log("Invalid week or month");
  }

  // Find the first day of the month
  const firstDayOfMonth = new Date(year, month - 1, 1);
  const dayOfWeek = firstDayOfMonth.getDay(); // 0 (CN) - 6 (T7)

  // Calculate offset to find the first Monday of the month
  const offsetToMonday = dayOfWeek === 0 ? 1 : 8 - dayOfWeek;
  const firstMonday = new Date(firstDayOfMonth);
  firstMonday.setDate(firstDayOfMonth.getDate() + offsetToMonday - 1);

  // Calculate the start date of the week `week`
  const startDate = new Date(firstMonday);
  startDate.setDate(firstMonday.getDate() + (week - 1) * 7);

  if (startDate.getDay() === 0) {
    startDate.setDate(startDate.getDate() + 1);
  }

  let endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 6);

  if (endDate.getDay() === 0) {
    endDate.setDate(endDate.getDate() - 1);
  }

  return {
    from: formatDate.toLocalDateStr(startDate),
    to: formatDate.toLocalDateStr(endDate),
    week: week,
  };
}
