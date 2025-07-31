// '2025-07-27'
function toDateStr(d) {
  return d.toISOString().slice(0, 10);
}

function toLocalDateStr(d) {
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
}

const formatDate = {
  toDateStr,
  toLocalDateStr,
};

module.exports = formatDate;
