using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace webapi.Models
{
    public class ColumnMap
    {
        public IEnumerable<string> ExcelColumns { get; set; }

        public IEnumerable<string> DbColumns { get; set; }

        public string ExcelPath { get; set; }
    }
}
