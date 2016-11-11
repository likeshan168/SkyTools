
var xlsx = require("node-xlsx");


//const workbook = xlsx.parse("../wwwroot/Uploads/雪地靴&男棉鞋条码.xlsx");
//if (workbook && workbook[0] && workbook[0].data && workbook[0].data[0]) {

//    var columns = workbook[0].data[0];
//    for (var i in columns) {
//        console.log (columns[i])
//    }
//    //console.log(workbook[0].data[0]);
//}





module.exports = function (callback, excelFile) {

    const workbook = xlsx.parse(excelFile);
    if (workbook && workbook[0] && workbook[0].data && workbook[0].data[0]) {
        callback(null, workbook[0].data[0]);
    } else {
        callback(null, []);
    }

}

//var Excel = require('exceljs');

//// read from a file
//var workbook = new Excel.Workbook();
//workbook.xlsx.readFile("../wwwroot/Uploads/雪地靴&男棉鞋条码.xlsx")
//    .then(function () {
//        // use workbook
//        console.log(workbook.getWorksheet(1).headers);
//    });