using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using webapi.Models;
using Microsoft.Extensions.Options;
using webapi.Bussiness;

// For more information on enabling Web API for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860

namespace webapi.Controllers
{
    [Route("api/[controller]")]
    public class LabelController : Controller
    {
        private IOptions<Settings> _settings;
        public LabelController(IOptions<Settings> settings)
        {
            _settings = settings;
        }
        // GET: api/values
        [HttpGet]
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET api/values/5
        [HttpGet("{id}")]
        public JsonResult Get(string id)
        {
            return Json(ProductsHelper.Instance.GetProductInfo(id, _settings.Value.DefaultConnection));
            //return Json(new ProductInfo()
            //{
            //    BarCode = "9341517040020",
            //    AUS = "36",
            //    EU = "36",
            //    CM = "22.3",
            //    Inches = "8.78",
            //    USA = "4/5B",
            //    ProductNo = "OB001",
            //    ColorEName = "SAND",
            //    ColorCName = "沙色",
            //    ProductCName = "女士长筒雪地靴",
            //    ProductEName = "UGG LONG BOOTS",
            //    ProductImgPath = "001sha",
            //    JDCode = "3418353",
            //    OldJDCode = ""
            //});
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
