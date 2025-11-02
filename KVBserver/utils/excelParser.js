import ExcelJS from "exceljs";

export const parseExcel = async (buffer) => {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(buffer);
  const worksheet = workbook.worksheets[0]; // Assuming first sheet

  const data = [];
  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber > 1) {
      // Skip header
      const rowData = {};
      row.eachCell((cell, colNumber) => {
        const header = worksheet.getCell(1, colNumber).value;
        rowData[header] = cell.value;
      });
      data.push(rowData);
    }
  });
  return data;
};
