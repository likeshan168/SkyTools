using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.NodeServices;
using Microsoft.AspNetCore.Http;
using System.IO;
using Microsoft.AspNetCore.Hosting;
using System.ServiceModel.Channels;

namespace webapi.Controllers
{
    [Route("api/[controller]")]
    public class ValuesController : Controller
    {
        // GET api/values
        //[HttpGet]
        //public IEnumerable<string> Get()
        //{
        //    return new string[] { "value1", "value2" };
        //}

        private IHostingEnvironment _environment;
        public ValuesController(IHostingEnvironment environment)
        {
            _environment = environment;
        }
        // GET api/values/5
        [HttpGet("{id}")]
        public string Get(int id)
        {
            return "value";
        }

        // POST api/values
        [HttpPost]
        public async Task<IActionResult> Post(ICollection<IFormFile> files)
        {
            var uploadedFiles = Request.Form.Files;
            var uploads = Path.Combine(_environment.WebRootPath, "Uploads");
            foreach (var file in uploadedFiles)
            {
                if (file.Length > 0)
                {
                    using (var fileStream = new FileStream(Path.Combine(uploads, file.FileName), FileMode.Create))
                    {
                        await file.CopyToAsync(fileStream);
                    }
                }
            }

            var obj = new
            {
                files = uploadedFiles.Select(f =>
                new
                {
                    thumbnailUrl = $"/Uploads/{f.FileName}",
                    url = $"/Uploads/{f.FileName}",
                    name = f.FileName,
                    size = f.Length,
                    deleteUrl ="/api/values"
                })
            };
            return Json(obj);
        }

        // PUT api/values/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE api/values/5
        [HttpDelete("{id}")]
        public void Delete(int id,[FromBody]string fileName)
        {
        }
        [HttpGet]

        public async Task<IActionResult> Get([FromServices]INodeServices nodeServices)
        {
            var result = await nodeServices.InvokeAsync<int>("./nodejs/addNumbers", 1, 2);
            return Content("1 + 2 =" + result);
        }
    }
}
