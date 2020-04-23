using cgsjgpt.Controllers.Filters;
using cgsjgpt.userclass.data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using cgsjgpt.Models;
using cgsjgpt.userclass.method;
using Newtonsoft.Json;
using System.Collections;

namespace cgsjgpt.Controllers
{
    public class LoginController : ApiController
    {
        private Entities db = new Entities();
        [CustomAuthAttribute(false)]
        [HttpGet]
        public Hashtable Login(string LoginName, string Pwd)
        {
            Hashtable ret = new Hashtable();
            string pwd1= SecurityHelper.DESEncrypt(Pwd, "pzhsjjzd");
            USERDB u = (from p in db.USERDB where p.LOGINNAME == LoginName && p.PWD == pwd1 select p).Single();
            ret["Msg"] = "0";
            string g = System.Guid.NewGuid().ToString("D");
            ret["memo1"] = g;
            List<USERDB> us = new List<USERDB>();
            u.PWD = "";
            us.Add(u);
            ret["Data"]=us;
            HttpRuntimeCache.Set(g, u);
            ret["CONFIGBM"] = (from p in db.CONFIGBM where p.DWNO == u.DWNO select p).ToList();
            CONFIGBASE b = (from p in db.CONFIGBASE where p.LX == "系统" && p.KEYWORD == "VERSION" select p).First();
            ret["VERSION"] = b.V1 + "-" + b.V2;
            return ret;

        }
        [CustomAuthAttribute(true)]
        [HttpGet]
        public Hashtable EnterMain()
        {
            string Authorization = Request.Headers.Authorization.ToString();
            USERDB user = HttpRuntimeCache.Get(Authorization) as USERDB;
            Hashtable ret = new Hashtable();
            List<string> ids = JsonConvert.DeserializeObject<List<string>>(user.QXS);
            if (user.QXLX == "自由权限")
            {
                 ret["Data"] = (from p in db.MENUDB where ids.Contains(p.ID) orderby p.PID, p.SORT select p).ToList();
            }
            else
            {
               IQueryable<ROLES> rs = from p in db.ROLES where ids.Contains(p.ID) select p;
                List<string> ids1 = new List<string>();
                foreach(ROLES r in rs)
                {
                    ids1.AddRange (JsonConvert.DeserializeObject<List<string>>(r.IDS));
                }
                ids1 = ids1.Distinct().ToList();
                ret["Data"] = (from p in db.MENUDB where ids1.Contains(p.ID) orderby p.PID, p.SORT select p).ToList();
            }
           
            ret["YJHCCDID"] = (from p in db.CONFIGBASE where p.LX == "系统" && p.KEYWORD == "YJHCCDID" select p).First().V1;
            ret["XSQZXGD"] = (from p in db.CONFIGBASE where p.LX == "系统" && p.KEYWORD == "XSQZXGD" select p).First().V1;
            return ret;

        }
        /// <summary>
        /// 站内登陆
        /// </summary>
        /// <returns></returns>
        [CustomAuthAttribute(false)]
        [HttpGet]
        public string InLogin() {
            using (EntitiesTrff db3 = new EntitiesTrff())
            {
                try
                {
                    var a = (from p in db3.DRIVINGLICENSE where p.SFZMHM == "510402197607265117" select p).First();
                    //PubMethod.wrlog("InLogin1", JsonConvert.SerializeObject(a));
                }
                catch { }
                try
                {
                    var b = from p in db3.VEHICLE where p.SFZMHM == "510402197607265117" select p;
                   // PubMethod.wrlog("InLogin2", JsonConvert.SerializeObject(b));
                }
                catch { }
            }
                return "ok";
        }

    }
}
