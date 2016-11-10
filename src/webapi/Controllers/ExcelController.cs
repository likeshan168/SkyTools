using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.NodeServices;
using Microsoft.AspNetCore.Hosting;
using System.IO;

// For more information on enabling Web API for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860

namespace webapi.Controllers
{
    [Route("api/[controller]")]
    public class ExcelController : Controller
    {
        private INodeServices _nodeServices;
        private IHostingEnvironment _environment;
        private string UploadDir = "Uploads";
        public ExcelController([FromServices]INodeServices nodeServices, IHostingEnvironment environment)
        {
            _nodeServices = nodeServices;
            _environment = environment;
        }

        // GET: api/values
        [HttpGet("{name}")]
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET api/values/5
        [HttpGet("{id}")]
        public async Task<IActionResult> Get(string id)
        {
            string filePath = Path.Combine(_environment.WebRootPath, UploadDir, id);
            var result = await _nodeServices.InvokeAsync<int>("./nodejs/NodeExcel", filePath);
            return Json(result);

        }

        // POST api/values
        [HttpPost]
        public void Post([FromBody]string value)
        {
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
