import * as XLSX from "xlsx";

/**
 * Export table-like data to excel with basic styling.
 * options:
 *  - data: array of objects
 *  - columns: array of { key, dataIndex, title }
 *  - filename: string
 *  - columnWidths: optional array of numbers (wch units) to force column widths
 */
export function exportTableToExcel({
  data = [],
  columns = [],
  filename = "export.xlsx",
  columnWidths = null,
}) {
  const headers = columns.map(
    (col) => col.title || col.key || col.dataIndex || ""
  );
  const rows = (data || []).map((row) =>
    columns.map((col) => {
      const field = col.dataIndex ?? col.key;
      const val =
        row && Object.prototype.hasOwnProperty.call(row, field)
          ? row[field]
          : "";
      return val;
    })
  );

  const aoa = [headers, ...rows];
  const ws = XLSX.utils.aoa_to_sheet(aoa);

  // set column widths (wch = character width)
  ws["!cols"] = (columns || []).map((col, idx) => {
    if (columnWidths && columnWidths[idx]) return { wch: columnWidths[idx] };
    // estimate width from header and data
    const maxLen = Math.max(
      String(headers[idx] || "").length,
      ...rows.map((r) => String(r[idx] ?? "").length)
    );
    return { wch: Math.min(Math.max(maxLen + 4, 12), 60) }; // clamp
  });

  // basic style objects
  const borderThin = {
    top: { style: "thin", color: { rgb: "FFBBBBBB" } },
    bottom: { style: "thin", color: { rgb: "FFBBBBBB" } },
    left: { style: "thin", color: { rgb: "FFBBBBBB" } },
    right: { style: "thin", color: { rgb: "FFBBBBBB" } },
  };

  // apply styles per cell
  for (let r = 0; r < aoa.length; r++) {
    for (let c = 0; c < (columns || []).length; c++) {
      const cellAddr = XLSX.utils.encode_cell({ r, c });
      const cell = ws[cellAddr];
      if (!cell) continue;

      // common styles for all cells
      const baseStyle = {
        border: borderThin,
        alignment: { vertical: "center", horizontal: "left", wrapText: true },
        font: { name: "Calibri", sz: 11, color: { rgb: "FF000000" } },
      };

      if (r === 0) {
        // header style: bold, center, light background
        cell.s = {
          ...baseStyle,
          font: { ...baseStyle.font, bold: true, sz: 12 },
          alignment: {
            vertical: "center",
            horizontal: "center",
            wrapText: false,
          },
          fill: { patternType: "solid", fgColor: { rgb: "FFF2F2F2" } },
        };
      } else {
        cell.s = baseStyle;
      }
    }
  }

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

  XLSX.writeFile(wb, filename);
}
