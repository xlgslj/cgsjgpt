using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using cgsjgpt.Controllers.Filters;
using cgsjgpt.Models;
using cgsjgpt.userclass.method;
namespace cgsjgpt.Controllers
{
    [WebApiExceptionFilter]
    [CustomAuthAttribute(true)]
    public class ZhglPzglController : ApiController
    {
        private EntitiesDtgl db = new EntitiesDtgl();
        /// <summary>
        /// 待制作和待领证
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public Hashtable GetPzInfo1(string name,string zjhm)
        {
            Hashtable ret = new Hashtable();
            var source = (from p in db.LICENSE where (p.ZT == "0" || p.ZT == "1")
                          &&(name==null||p.NAME.Contains(name))&&(zjhm==null||p.ZJHM.Contains(zjhm)) orderby p.ZT descending,p.OPTIME
                          select p).ToList();
            ret["code"] = 0;
            ret["count"] = source.Count();
            ret["data"] = source;// source.Skip((page - 1) * limit).Take(limit).ToList();
            return ret;
        }
        /// <summary>
        /// 综合查询
        /// </summary>
        /// <param name="name"></param>
        /// <param name="zjhm"></param>
        /// <returns></returns>
        [HttpGet]
        public Hashtable GetPzInfo2(int page,int limit,string rq1,string rq2,string zt,string name, string zjhm)
        {
            Hashtable ret = new Hashtable();
            DateTime d1 = rq1 == null ? Convert.ToDateTime("1900-01-01" + " 00:00:00") : Convert.ToDateTime(rq1 + " 00:00:00");
            DateTime d2=rq2==null ? Convert.ToDateTime("2099-01-01" + " 23:59:59") : Convert.ToDateTime(rq2 + " 23:59:59");
            var source = (from p in db.LICENSE
                          where (zt == null || p.ZT == zt)&&p.OPTIME>=d1&&p.OPTIME<=d2
                           && (name == null || p.NAME.Contains(name)) && (zjhm == null || p.ZJHM.Contains(zjhm))
                           &&(zt==null||p.ZT==zt)
                          select p).ToList();
            ret["code"] = 0;
            ret["count"] = source.Count();
            ret["data"] =  source.Skip((page - 1) * limit).Take(limit).ToList();
            return ret;
        }
        [HttpPost]
        public void EditLicenseZt(dynamic obj)
        {
            string id = Convert.ToString(obj.id);
            string zt = Convert.ToString(obj.zt);
            LICENSE lc = (from p in db.LICENSE where p.ID == id select p).First();
            lc.ZT = zt;
            if (zt == "1")
            {
                lc.ZZTIME = DateTime.Now;
            }
            if (zt == "2" || zt == "4")
            {
                lc.FFTIME = DateTime.Now;
            }
            db.SaveChanges();
        }
        [HttpPost]
        public void SgAdd(dynamic obj)
        {
            string Authorization = Request.Headers.Authorization.ToString();
            USERDB user = HttpRuntimeCache.Get(Authorization) as USERDB;
            string zjlx = Convert.ToString(obj.zjlx);
            string zjhm = Convert.ToString(obj.zjhm);
            string name = Convert.ToString(obj.name);
            LICENSE lc = new LICENSE();
            lc.ID = PubMethod.maxid();
            lc.DWMC = user.DWNAME;
            lc.DWNO = user.DWNO;
            lc.PID = "0000000000";
            lc.BLLX = "本人业务";
            lc.NAME = name;
            lc.ZJLX = zjlx;
            lc.ZJHM = zjhm;
            lc.OPER = user.NAME;
            lc.OPTIME = DateTime.Now;
            lc.ZT = "0";
            db.LICENSE.Add(lc);
            db.SaveChanges();
        }
    }
}
