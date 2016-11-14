using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;
using Dapper;
using System.IO;
using System.Data.OleDb;
using NPOI.SS.UserModel;
using NPOI.XSSF.UserModel;
using NPOI.HSSF.UserModel;
using webapi.Models;
using Npoi.Mapper;
using System.Linq.Expressions;

namespace webapi.Bussiness
{
    public class ExcelHelper
    {
        public static readonly ExcelHelper Instance = new ExcelHelper();
        private const string connStr = "";
        private ExcelHelper()
        {

        }

        public IEnumerable<string> GetExcelMappedColumns(string connStr)
        {
            using (IDbConnection conn = new SqlConnection(connStr))
            {
                string sql = "SELECT name from syscolumns where id=(select max(id) from sysobjects where xtype='u' and name='ProductInfo') ORDER BY colid asc";
                return conn.Query<string>(sql);
            }

        }
        public IEnumerable<string> GetExcelColumns(string filePath)
        {

            List<string> columns = new List<string>();
            IWorkbook workbook = null;

            using (FileStream fs = File.Open(filePath, FileMode.Open, FileAccess.Read))
            {
                if (Path.GetExtension(filePath) == ".xlsx")
                {
                    workbook = new XSSFWorkbook(fs);
                }
                else
                {
                    workbook = new HSSFWorkbook(fs);
                }

                ISheet sheet = workbook.GetSheetAt(0);
                if (sheet != null)
                {
                    IRow firstRow = sheet.GetRow(0);
                    int cellCount = firstRow.LastCellNum; //一行最后一个cell的编号 即总的列数
                    for (int i = firstRow.FirstCellNum; i < cellCount; ++i)
                    {
                        ICell cell = firstRow.GetCell(i);
                        if (cell != null)
                        {
                            string cellValue = cell.StringCellValue;
                            if (cellValue != null)
                            {
                                columns.Add(cellValue);
                            }
                        }
                    }
                }

                return columns;

            }
        }

        private IEnumerable<ProductInfo> GetExcelData(ColumnMap columnMaps)
        {
            var mapper = new Mapper(columnMaps.ExcelPath);

            Type type = typeof(ProductInfo);
            var excelColumns = columnMaps.ExcelColumns.ToList();
            var dbColumns = columnMaps.DbColumns.ToList();

            //Expression<Func<ProductInfo, object>> exp;
            for (int i = 0; i < excelColumns.Count; i++)
            {
                switch (dbColumns[i])
                {
                    case "ProductNo":
                        mapper.Map<ProductInfo>(excelColumns[i], p => p.ProductNo);
                        break;
                    case "ColorCName":
                        mapper.Map<ProductInfo>(excelColumns[i], p => p.ColorCName);
                        break;
                    case "ProductImgPath":
                        mapper.Map<ProductInfo>(excelColumns[i], p => p.ProductImgPath);
                        break;
                    case "ColorEName":
                        mapper.Map<ProductInfo>(excelColumns[i], p => p.ColorEName);
                        break;
                    case "ProductEName":
                        mapper.Map<ProductInfo>(excelColumns[i], p => p.ProductEName);
                        break;
                    case "ProductCName":
                        mapper.Map<ProductInfo>(excelColumns[i], p => p.ProductCName);
                        break;
                    case "AUS":
                        mapper.Map<ProductInfo>(excelColumns[i], p => p.AUS);
                        break;
                    case "EU":
                        mapper.Map<ProductInfo>(excelColumns[i], p => p.EU);
                        break;
                    case "USA":
                        mapper.Map<ProductInfo>(excelColumns[i], p => p.USA);
                        break;
                    case "CM":
                        mapper.Map<ProductInfo>(excelColumns[i], p => p.CM);
                        break;
                    case "Inches":
                        mapper.Map<ProductInfo>(excelColumns[i], p => p.Inches);
                        break;
                    case "BarCode":
                        mapper.Map<ProductInfo>(excelColumns[i], p => p.BarCode);
                        break;
                    case "JDCode":
                        mapper.Map<ProductInfo>(excelColumns[i], p => p.JDCode);
                        break;
                    case "OldJDCode":
                        mapper.Map<ProductInfo>(excelColumns[i], p => p.OldJDCode);
                        break;
                    default:
                        break;
                }
                //mapper.Map<ProductInfo>(excelColumns[i], p => type.GetProperty(dbColumns[i]).GetValue());

            }
            var results = mapper.Take<ProductInfo>();
            mapper = null;
            return results.Select(r => r.Value).Where(p => !string.IsNullOrWhiteSpace(p.BarCode));
        }

        public bool SaveDataToDb(ColumnMap columnMaps, string connStr)
        {
            IDbTransaction trans = null;
            try
            {
                var products = GetExcelData(columnMaps);
                using (IDbConnection conn = new SqlConnection(connStr))
                {
                    if (conn.State == ConnectionState.Closed)
                    {
                        conn.Open();
                    }
                    trans = conn.BeginTransaction();
                    conn.Execute("delete from ProductInfo where BarCode=@BarCode", products, trans);
                    conn.Execute("insert into ProductInfo(ProductNo,ColorCName,ProductImgPath,ColorEName,ProductEName,ProductCName,AUS,EU,USA,CM,Inches,BarCode,JDCode,OldJDCode) values(@ProductNo, @ColorCName,@ProductImgPath,@ColorEName,@ProductEName,@ProductCName,@AUS,@EU,@USA,@CM,@Inches,@BarCode,@JDCode,@OldJDCode)", products, trans);
                    trans.Commit();
                    return true;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                trans?.Rollback();
                return false;
            }
        }
    }
}
