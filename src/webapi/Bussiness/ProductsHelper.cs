using Dapper;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;
using webapi.Models;

namespace webapi.Bussiness
{
    public class ProductsHelper
    {
        public static readonly ProductsHelper Instance = new ProductsHelper();
        private ProductsHelper()
        {
        }

        public IEnumerable<ProductInfo> SearchProductInfo(string word, string connStr)
        {
            using (IDbConnection conn = new SqlConnection(connStr))
            {
                if (conn.State == ConnectionState.Closed)
                {
                    conn.Open();
                }

                //return conn.Query<ProductInfo>(@"select * from ProductInfo where ProductNo like '%@word%' or ProductCName like '%@word%' or ProductEName like '%@word%' or BarCode like '%@word%' or JDCode like '%@word%'", new { word = word });
                return conn.Query<ProductInfo>($"select * from ProductInfo where ProductNo like '%{word}%' or ProductCName like '%{word}%' or ProductEName like '%{word}%' or BarCode like '%{word}%' or JDCode like '%{word}%'");
            }
        }
    }
}
