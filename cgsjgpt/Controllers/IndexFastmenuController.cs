using cgsjgpt.Controllers.Filters;
using cgsjgpt.Models;
using cgsjgpt.userclass.method;
using Newtonsoft.Json;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace cgsjgpt.Controllers
{
    [WebApiExceptionFilter]
    [CustomAuthAttribute(true)]
    public class IndexFastmenuController : ApiController
    {
        private Entities db = new Entities();
        [HttpGet]
        public Hashtable FastmenuInit()
        {
            string Authorization = Request.Headers.Authorization.ToString();
            USERDB user = HttpRuntimeCache.Get(Authorization) as USERDB;
            Hashtable ret = new Hashtable();
            ret["user"] = (from p in db.USERDB where p.ID == user.ID select p).First(); ;

            List<string> ids = JsonConvert.DeserializeObject<List<string>>(user.QXS);
            List<MENUDB> menus = new List<MENUDB>();
            if (user.QXLX == "自由权限")
            {
                menus = (from p in db.MENUDB where ids.Contains(p.ID) orderby p.PID, p.SORT select p).ToList();
            }
            else
            {
                IQueryable<ROLES> rs = from p in db.ROLES where ids.Contains(p.ID) select p;
                List<string> ids1 = new List<string>();
                foreach (ROLES r in rs)
                {
                    ids1.AddRange(JsonConvert.DeserializeObject<List<string>>(r.IDS));
                }
                ids1 = ids1.Distinct().ToList();
                menus = (from p in db.MENUDB where ids1.Contains(p.ID) orderby p.PID, p.SORT select p).ToList();
            }
            ret["menus"] = menus;
            return ret;
        }
        [HttpPost]
        public void EditFastMenu(dynamic obj)
        {
            string Authorization = Request.Headers.Authorization.ToString();
            USERDB user = HttpRuntimeCache.Get(Authorization) as USERDB;
            USERDB u = (from p in db.USERDB where p.ID == user.ID select p).First();
            u.FASTMENU = Convert.ToString(obj.fastmenu);
            db.SaveChanges();
        }
    }
}
