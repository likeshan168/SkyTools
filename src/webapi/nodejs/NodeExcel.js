
var xlsx = require("node-xlsx");
module.exports = function (callback, excelFile) {
    const workbook = xlsx.parse(excelFile);
    callback(null, workbook);
}