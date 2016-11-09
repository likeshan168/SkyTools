using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace webapi.Bussiness
{
    public class ResponseFile
    {
        public string ThumbnailUrl { get; set; }
        public string Url { get; set; }

        public string Name { get; set; }

        public long Size { get; set; }

        public string DeleteUrl { get; set; }

        public string DeleteType { get; set; }

        public string Error { get; set; }
    }
}
