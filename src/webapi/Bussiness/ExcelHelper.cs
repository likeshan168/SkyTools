using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;
using Dapper;
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
                string sql = "SELECT name from syscolumns where id=(select max(id) from sysobjects where xtype='u' and name='ProductInfo')";
                return conn.Query<string>(sql);
            }

        }
    }
}
