// '2025-07-27'
function toDateStr(d) {
  if (!(d instanceof Date)) {
    d = new Date(d); // convert epoch time or string
  }
  return d.toISOString().slice(0, 10);
}

// 'DD/MM/YYYY'
function toLocalDateStr(d) {
  if (!(d instanceof Date)) {
    d = new Date(d); //  convert epoch time or string
  }

  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

export const formatDate = {
  toDateStr,
  toLocalDateStr,
};
