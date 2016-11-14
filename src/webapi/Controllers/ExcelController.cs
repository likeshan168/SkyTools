using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.NodeServices;
using Microsoft.AspNetCore.Hosting;
using System.IO;
using Microsoft.Extensions.Options;
using webapi.Bussiness;
using webapi.Models;

// For more information on enabling Web API for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860

namespace webapi.Controllers
{
    [Route("api/[controller]")]
    public class ExcelController : Controller
    {
        private INodeServices _nodeServices;
        private IHostingEnvironment _environment;
        private string UploadDir = "Uploads";
        private IOptions<Settings> _settings;
        public ExcelController([FromServices]INodeServices nodeServices, IHostingEnvironment environment, IOptions<Settings> settings)
        {
            _nodeServices = nodeServices;
            _environment = environment;
            _settings = settings;
        }

        // GET: api/values
        [HttpGet("{name}")]
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET api/values/5
        [HttpGet("{id}")]
        public IActionResult Get(string id)
        {
            try
            {
                string filePath = Path.Combine(_environment.WebRootPath, UploadDir, id);
                //var excelColumns = await _nodeServices.InvokeAsync<List<string>>("./nodejs/NodeExcel", filePath);
                var excelColumns = ExcelHelper.Instance.GetExcelColumns(filePath);
                var dbColumns = ExcelHelper.Instance.GetExcelMappedColumns(_settings.Value.DefaultConnection);
                ColumnMap columns = new ColumnMap() { DbColumns = dbColumns, ExcelColumns = excelColumns,ExcelPath = filePath };
                return Json(columns);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return StatusCode(500, ex.Message);
            }

        }

        // POST api/values
        [HttpPost]
        public IActionResult Post(ColumnMap columnMaps)
        {
            try
            {
                ExcelHelper.Instance.SaveDataToDb(columnMaps, _settings.Value.DefaultConnection);
                return Content("success");
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        // PUT api/values/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE api/values/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
