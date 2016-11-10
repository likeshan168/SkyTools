using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace webapi.Bussiness
{
    public class ExcelHelper
    {
        private static readonly ExcelHelper Instance = new ExcelHelper();
        private const string connStr = "Provider=Microsoft.ACE.OLEDB.12.0;Data Source={0};Extended Properties=&quot;Excel 12.0 Xml;HDR=YES;IMEX=1&quot;";
        private ExcelHelper()
        {

        }

        public IEnumerable<string> GetExcelColumnNames(string filePath)
        {
            using (IDbConnection conn = new OleDbConnection)
            {

            }
        }
    }
}
