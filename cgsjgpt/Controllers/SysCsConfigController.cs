using cgsjgpt.Controllers.Filters;
using cgsjgpt.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using cgsjgpt.userclass.method;
using System.Collections;

namespace cgsjgpt.Controllers
{
    [CustomAuthAttribute(true)]
    [WebApiExceptionFilter]
    public class SysCsConfigController : ApiController
    {
        private Entities db = new Entities();
        [HttpGet]
        public void RefConfig()
        {
            string Authorization = Request.Headers.Authorization.ToString();
            USERDB user = HttpRuntimeCache.Get(Authorization) as USERDB;
            IQueryable<BMDB> bm = from p in db.BMDB select p;
            IQueryable<CONFIGBASE> conf = from p in db.CONFIGBASE where p.LX=="业务" select p;
            foreach(BMDB b in bm)
            {
                foreach(CONFIGBASE c in conf)
                {
                    int i = (from p in db.CONFIGBM where p.DWNO == b.ID && p.CID == c.ID select p).Count();
                    if (i == 0)
                    {
                        CONFIGBM cm = new CONFIGBM();
                        cm.ID = PubMethod.maxid();
                        cm.CID = c.ID;
                        cm.DWNO = b.ID;
                        cm.DWMC = b.NAME;
                        cm.SORT = c.SORT;
                        cm.KEYWORD = c.KEYWORD;
                        cm.NAME = c.NAME;
                        cm.K1 = c.K1;
                        cm.LX1 = c.LX1;
                        cm.V1 = c.V1;
                        cm.K2= c.K2;
                        cm.LX2 = c.LX2;
                        cm.V2 = c.V2;
                        cm.K3 = c.K3;
                        cm.LX3 = c.LX3;
                        cm.V3 = c.V3;
                        cm.K4= c.K4;
                        cm.LX4= c.LX4;
                        cm.V4 = c.V4;
                        cm.K5 = c.K5;
                        cm.LX5 = c.LX5;
                        cm.V5 = c.V5;
                        cm.MEMO = c.MEMO;
                        cm.OPTIME = System.DateTime.Now;
                        cm.OPERID = user.ID;
                        cm.OPER = user.NAME;
                        db.CONFIGBM.Add(cm);

                    }
                }
            }
            db.SaveChanges();
        }
        [HttpGet]
        public Hashtable GetBmConfigs(int page, int limit,string bmid)
        {
            Hashtable ret = new Hashtable();
            var source = (from p in db.CONFIGBM where p.DWNO==bmid orderby p.ID select p).ToList();
            ret["code"] = "0";
            ret["count"] = source.Count;
            ret["data"] = source;
            return ret;
        }
        [HttpGet]
        public Hashtable GetSingBmConfig(string id)
        {
            Hashtable ret = new Hashtable();
            var source = (from p in db.CONFIGBM where p.ID == id orderby p.ID select p).First();
            ret["Data"] = source;
            return ret;
        }
        [HttpPost]
        public void SaveSingBmConfig(dynamic obj)
        {
            string id = Convert.ToString(obj.ID);
            CONFIGBM cm = (from p in db.CONFIGBM where p.ID == id select p).First();
            cm.V1 = Convert.ToString(obj.V1);
            cm.V2 = Convert.ToString(obj.V2);
            cm.V3 = Convert.ToString(obj.V3);
            cm.V4 = Convert.ToString(obj.V4);
            cm.V5 = Convert.ToString(obj.V5);
            db.SaveChanges();

        }

        [HttpGet]
        public Hashtable GetSysConfigs(int page, int limit)
        {
            Hashtable ret = new Hashtable();
            var source = (from p in db.CONFIGBASE where p.LX== "系统" orderby p.ID select p).ToList();
            ret["code"] = "0";
            ret["count"] = source.Count;
            ret["data"] = source;
            return ret;
        }
        [HttpGet]
        public Hashtable GetSingSysConfig(string id)
        {
            Hashtable ret = new Hashtable();
            var source = (from p in db.CONFIGBASE where p.ID == id orderby p.ID select p).First();
            ret["Data"] = source;
            return ret;
        }
        [HttpPost]
        public void SaveSingSysConfig(dynamic obj)
        {
            string id = Convert.ToString(obj.ID);
            CONFIGBASE cm = (from p in db.CONFIGBASE where p.ID == id select p).First();
            cm.V1 = Convert.ToString(obj.V1);
            cm.V2 = Convert.ToString(obj.V2);
            cm.V3 = Convert.ToString(obj.V3);
            cm.V4 = Convert.ToString(obj.V4);
            cm.V5 = Convert.ToString(obj.V5);
            db.SaveChanges();
            MvcApplication.SysConfigs = (from p in db.CONFIGBASE where p.LX == "系统" select p).ToList();

        }
    }
}
