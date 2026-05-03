import ExcelJS from "exceljs";

export async function workbookBuffer(sheets) {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "FeesPro";
  workbook.created = new Date();

  for (const [name, rows] of Object.entries(sheets)) {
    const worksheet = workbook.addWorksheet(name.slice(0, 31));
    const keys = rows.length ? Object.keys(rows[0]) : ["No Data"];
    worksheet.columns = keys.map((key) => ({ header: key, key, width: Math.max(14, key.length + 4) }));
    rows.forEach((row) => worksheet.addRow(row));
    worksheet.getRow(1).font = { bold: true, color: { argb: "FFFFFFFF" } };
    worksheet.getRow(1).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF047857" } };
  }

  return workbook.xlsx.writeBuffer();
}

export async function readFirstSheet(filePath) {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);
  const worksheet = workbook.worksheets[0];
  if (!worksheet) return [];

  const headers = [];
  worksheet.getRow(1).eachCell((cell, colNumber) => {
    headers[colNumber] = String(cell.value || "").trim();
  });

  const rows = [];
  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return;
    const data = {};
    row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
      const value = cell.value?.text || cell.value?.result || cell.value || "";
      data[headers[colNumber] || `Column ${colNumber}`] = value;
    });
    rows.push(data);
  });

  return rows;
}
