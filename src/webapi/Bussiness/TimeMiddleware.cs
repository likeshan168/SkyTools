using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;

namespace webapi.Bussiness
{
    public class TimeMiddleware
    {
        private Stopwatch _stopwatch;
        private RequestDelegate _next;
        public TimeMiddleware(RequestDelegate next, Stopwatch stopwatch)
        {
            _next = next;
            _stopwatch = stopwatch;
        }

        public async Task Invoke(HttpContext context)
        {
            _stopwatch?.Start();
            await _next(context);
            //await context.Response.WriteAsync($"<div>共耗时：{_stopwatch.ElapsedMilliseconds}</div>");
        }
    }
}
