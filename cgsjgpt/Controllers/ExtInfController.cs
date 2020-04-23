using cgsjgpt.userclass.method;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace cgsjgpt.Controllers
{
    public class ExtInfController : ApiController
    {
        [HttpGet]
        public Hashtable StrToHash(string pwd)
        {
            Hashtable ret = new Hashtable();
            ret["hash"]= SecurityHelper.DESEncrypt(pwd, "pzhsjjzd");
            return ret;
        }
    }
}
