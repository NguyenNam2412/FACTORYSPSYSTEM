import dayjs from "./dayjsConfig";

// input to Date
function parseLocalDate(input) {
  if (!input) return null;

  // Date
  if (input instanceof Date) return new Date(input.getTime());

  // epoch
  if (typeof input === "number") return new Date(input);

  // "DD/MM/YYYY"
  if (typeof input === "string" && /^\d{2}\/\d{2}\/\d{4}$/.test(input)) {
    const [day, month, year] = input.split("/").map(Number);
    return new Date(year, month - 1, day);
  }

  const d = dayjs(input);
  return d.isValid() ? d.toDate() : null;
}

// set time to 00:00:00
function normalizeToStartOfDay(input) {
  const d = parseLocalDate(input);
  return d ? dayjs(d).startOf("day").toDate() : null;
}

// input to epoch (ms)
function toEpochTime(input) {
  const d = parseLocalDate(input);
  return d ? dayjs(d).startOf("day").valueOf() : null;
}

// input to "DD/MM/YYYY"
function toLocalDateStr(input) {
  const d = parseLocalDate(input);
  return d ? dayjs(d).startOf("day").format("DD/MM/YYYY") : "";
}

export const formatDate = {
  parseLocalDate,
  normalizeToStartOfDay,
  toEpochTime,
  toLocalDateStr,
};
