using cgsjgpt.Controllers.Filters;
using cgsjgpt.Models;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using cgsjgpt.userclass.method;
using Newtonsoft.Json;
namespace cgsjgpt.Controllers
{
    [CustomAuthAttribute(true)]
    [WebApiExceptionFilter]
    public class XfywJcpzController : ApiController
    {
        private Entities db = new Entities();
        private EntitiesXfyw db5 = new EntitiesXfyw();
        [HttpGet]
        public Hashtable  QueryBusinessBase(int page, int limit, string ptlb, string xtlb, string ywlx, string ywyy,string blms)
        {
            Hashtable ret = new Hashtable();
            IQueryable<BUSINESSBASE> source = from p in db5.BUSINESSBASE
                                       where  (ptlb == null || p.PTLB.Contains(ptlb)) && (xtlb == null || p.XTLB.Contains(xtlb))
                                       && (ywlx == null || p.YWLX.Contains(ywlx)) && (ywyy == null || p.YWYY.Contains(ywyy))
                                       && (blms == null || p.BLMS.Contains(blms))
                                       orderby p.ID
                                       select p;
            ret["code"] = 0;
            ret["count"] = source.Count();
            ret["data"] = source.Skip((page - 1) * limit).Take(limit).ToList();
            return ret;
        }
        [HttpPost]
        public void BusinessBaseAdd(dynamic obj)
        {
            BUSINESSBASE bs = new BUSINESSBASE();
            bs.ID = PubMethod.maxid();
            bs.PTLB = Convert.ToString(obj.ptlb);
            bs.XTLB = Convert.ToString(obj.xtlb);
            bs.YWLX = Convert.ToString(obj.ywlx);
            bs.YWYY = Convert.ToString(obj.ywyy);
            bs.YHPHMISNULL = Convert.ToString(obj.yhphmisnull);
            bs.CYLSHISNULL = Convert.ToString(obj.cylshisnull);
            bs.BLMS = Convert.ToString(obj.blms);
            bs.SHMS = Convert.ToString(obj.shms);
            bs.BRZL = Convert.ToString(obj.brzls);
            bs.DLRZL = Convert.ToString(obj.dlrzls);
            bs.DWZL = Convert.ToString(obj.dwzls);
            db5.BUSINESSBASE.Add(bs);
            db5.SaveChanges();

        }
        [HttpGet]
        public Hashtable BusinessBaseGet(string id)
        {
            Hashtable ret = new Hashtable();
            ret["data"] = (from p in db5.BUSINESSBASE where p.ID == id select p).First();
            return ret;
        }
        [HttpPost]
        public void BusinessBaseEdit(dynamic obj)
        {
            string id = Convert.ToString(obj.id);
            BUSINESSBASE bs = (from p in db5.BUSINESSBASE where p.ID == id select p).First();
            bs.PTLB = Convert.ToString(obj.ptlb);
            bs.XTLB = Convert.ToString(obj.xtlb);
            bs.YWLX = Convert.ToString(obj.ywlx);
            bs.YWYY = Convert.ToString(obj.ywyy);
            bs.YHPHMISNULL = Convert.ToString(obj.yhphmisnull);
            bs.CYLSHISNULL = Convert.ToString(obj.cylshisnull);
            bs.BLMS = Convert.ToString(obj.blms);
            bs.SHMS = Convert.ToString(obj.shms);
            bs.BRZL = Convert.ToString(obj.brzls);
            bs.DLRZL = Convert.ToString(obj.dlrzls);
            bs.DWZL = Convert.ToString(obj.dwzls);
            db5.SaveChanges();

        }
        [HttpPost]
        public void BusinessBaseDel(dynamic obj)
        {
            string id = Convert.ToString(obj.id);
            int count = (from p in db5.BUSINESSBM where p.BIDS.Contains(id) select p).Count();
            if (count > 0)
            {
                throw new Exception("配置已被使用，不能删除！");
                return;
            }
            BUSINESSBASE bs = (from p in db5.BUSINESSBASE where p.ID == id select p).First();
            db5.BUSINESSBASE.Remove(bs);
            db5.SaveChanges();
        }
        [HttpGet]
        public Hashtable BusinessBmQxGet(string dwno)
        {
            Hashtable ret = new Hashtable();
            ret["data"] = "nodata";
            try
            {
                BUSINESSBM bb = (from p in db5.BUSINESSBM where p.DWNO == dwno select p).First();
                ret["data"] =JsonConvert.DeserializeObject<List<string>>( bb.BIDS);
            }
            catch
            {

            }
            return ret;
        }
        [HttpPost]
        public void BusinessBmQxSave(dynamic obj)
        {
            string id = Convert.ToString(obj.dw.ID);
            try
            {
                BUSINESSBM bbm = (from p in db5.BUSINESSBM where p.DWNO == id select p).First();
                bbm.BIDS = Convert.ToString(obj.bids);
                db5.SaveChanges();
            }
            catch
            {
                BUSINESSBM bbm = new BUSINESSBM();
                bbm.ID = PubMethod.maxid();
                bbm.DWNO = Convert.ToString(obj.dw.ID);
                bbm.DWMC = Convert.ToString(obj.dw.NAME);
                bbm.BIDS = Convert.ToString(obj.bids);
                db5.BUSINESSBM.Add(bbm);
                db5.SaveChanges();

            }
        }
        [HttpGet]
        public Hashtable BusinessBmQxQuery()
        {
            string Authorization = Request.Headers.Authorization.ToString();
            USERDB user = HttpRuntimeCache.Get(Authorization) as USERDB;
            Hashtable ret = new Hashtable();
            try
            {
                BUSINESSBM bbm = (from p in db5.BUSINESSBM where p.DWNO == user.DWNO select p).First();
                List<string> bids = JsonConvert.DeserializeObject<List<string>>(bbm.BIDS);
                var k = from p in bids
                        join p1 in db5.BUSINESSBASE
                        on p equals p1.ID into des
                        from dwyw in des.DefaultIfEmpty()
                        select new
                        {
                            dwyw
                        };
                ret["count"] = k.Count();
                ret["data"] = k;
            }
            catch
            {
                throw new Exception("没有可办理的授权业务,请联系上级主管部门!");
            }
            return ret;
        }
    }
}
