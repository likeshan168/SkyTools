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
using Microsoft.Extensions.Primitives;
using Microsoft.Extensions.Caching.Memory;
using webapi.Bussiness;

namespace webapi.Controllers
{
    [Route("api/[controller]")]
    public class ValuesController : Controller
    {

        private string UploadFolders = "Uploads";

        private IHostingEnvironment _environment;
        private IMemoryCache _caching;
        public ValuesController(IHostingEnvironment environment, IMemoryCache caching)
        {
            _environment = environment;
            _caching = caching;
        }

        [HttpGet("{fileName}")]
        public JsonResult Post(string fileName)
        {
            List<ResponseFile> responseFiles;
            if (!_caching.TryGetValue("fileNames", out responseFiles))
            {

                var uploads = Path.Combine(_environment.WebRootPath, UploadFolders);
                //System.IO.File
                DirectoryInfo di = new DirectoryInfo(uploads);
                var files = di.GetFiles();
                responseFiles = new List<ResponseFile>();
                foreach (FileInfo file in files)
                {
                    responseFiles.Add(new ResponseFile()
                    {
                        Name = file.Name,
                        Size = file.Length,
                        Url = GetFileUrl(file.Name),
                        ThumbnailUrl = GetThumbnailUrl(file.Name),
                        DeleteUrl = "/api/values",
                        DeleteType = "DELETE"
                    });
                }

                _caching.Set("fileNames", responseFiles);
            }

            return Json(responseFiles.Select(f => f.Name == fileName));
        }
        // POST api/values
        [HttpPost]
        public async Task<IActionResult> Post(ICollection<IFormFile> files)
        {
            try
            {
                var uploadedFiles = Request.Form.Files;
                var uploads = Path.Combine(_environment.WebRootPath, UploadFolders);
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
                    new ResponseFile
                    {
                        ThumbnailUrl = GetThumbnailUrl(f.FileName),
                        Url = GetFileUrl(f.FileName),
                        Name = f.FileName,
                        Size = f.Length,
                        DeleteUrl = "/api/values",
                        DeleteType = "DELETE",
                        Error = ""
                    })
                };
                return Json(obj);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        // DELETE api/values/5
        [HttpDelete]
        public ActionResult Delete(string fileName)
        {
            try
            {
                StringValues files;
                var frm = Request.Form.TryGetValue("name", out files);
                if (files.Count > 0)
                {
                    string path = Path.Combine(_environment.WebRootPath, UploadFolders);
                    foreach (var item in files)
                    {
                        path = Path.Combine(path, item);
                        FileInfo fi = new FileInfo(path);
                        if (fi.Exists)
                            fi.Delete();
                        fi = null;
                    }
                }

                return Json(new { result = "success" });
            }
            catch (Exception ex)
            {

                return new InternalServerErrorResult();
            }

        }
        [HttpGet]

        public async Task<IActionResult> Get([FromServices]INodeServices nodeServices)
        {
            var result = await nodeServices.InvokeAsync<int>("./nodejs/addNumbers", 1, 2);
            return Content("1 + 2 =" + result);
        }

        private string GetFileUrl(string fileName)
        {
            return $"/{UploadFolders}/{fileName}";
        }

        private string GetThumbnailUrl(string fileName)
        {
            return (Path.GetExtension(fileName) == ".xls" || Path.GetExtension(fileName) == ".xlsx") ? $"/src/images/excel.png" : $"/{UploadFolders}/{fileName}";
        }
    }
}
