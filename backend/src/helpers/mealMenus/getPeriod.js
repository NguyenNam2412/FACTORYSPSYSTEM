const formatDate = require("../../utils/dateTime/formatDate");

/**
 * get period range based on the menu date
 * @param {Object} menu_date - { from: '21/07/2025', to: '27/07/2025' }
 * @returns {Object} { from_date_str, to_date_str, week, month, year }
 */

function getPeriod(menu_date) {
  // Convert from 'DD/MM/YYYY' to Date object
  const [fromDay, fromMonth, fromYear] = menu_date.from.split("/").map(Number);
  const fromDate = new Date(fromYear, fromMonth - 1, fromDay);

  const [toDay, toMonth, toYear] = menu_date.to.split("/").map(Number);
  const toDate = new Date(toYear, toMonth - 1, toDay);

  // month and year from the fromDate
  const month = fromDate.getMonth() + 1;
  const year = fromDate.getFullYear();

  return {
    from_date_str: menu_date.from,
    to_date_str: menu_date.to,
    week: menu_date.week,
    month,
    year,
  };
}

module.exports = getPeriod;
