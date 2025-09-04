const dayjs = require("dayjs");
const customParseFormat = require("dayjs/plugin/customParseFormat");
const isSameOrAfter = require("dayjs/plugin/isSameOrAfter");
const isSameOrBefore = require("dayjs/plugin/isSameOrBefore");

dayjs.extend(customParseFormat);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

module.exports = dayjs;
