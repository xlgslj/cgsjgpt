using cgsjgpt.Controllers.Filters;
using cgsjgpt.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using cgsjgpt.userclass.data;
using cgsjgpt.userclass.method;
using Newtonsoft.Json;
using System.Collections;
using System.Data.Entity.Core.Objects;

namespace cgsjgpt.Controllers
{
    [CustomAuthAttribute(true)]
    [WebApiExceptionFilter]
    public class YjglYjglController : ApiController
    {
        private Entities db = new Entities();
        private EntitiesDtgl db1 = new EntitiesDtgl();
        private EntitiesXfyw db2 = new EntitiesXfyw();
        private EntitiesSys1 db3 = new EntitiesSys1();
        [HttpGet]
        public Hashtable YwblYjhcList(int page, int limit, string xtlb, string warnlx,
                                       string warnlx1,
                                       string oplx,
                                       string name,
                                       string sfzmhm,
                                       string hphm,
                                       string oper,
                                       string rq1,
                                       string rq2,
                                       string bmno)
        {
            Hashtable ret = new Hashtable();
            DateTime kssj = Convert.ToDateTime(rq1 + " 00:00:00");
            DateTime jssj = Convert.ToDateTime(rq2 + " 23:59:59");

            IQueryable<WARNLOG> source = from p in db1.WARNLOG where p.HCZT == "0" && p.WARNLX!= "排队叫号"
                                         && (xtlb == null || p.XTLB.Contains(xtlb)) && (warnlx == null || p.WARNLX.Contains(warnlx))
                                         && (warnlx1 == null || p.WARNLX1.Contains(warnlx1)) && (oplx == null || p.OPLX.Contains(oplx))
                                         && (name == null || p.NAME.Contains(name)) && (sfzmhm == null || p.SFZMHM.Contains(sfzmhm))
                                         && (hphm == null || p.HPHM.Contains(hphm))
                                         && (oper == null || p.OPERNAME.Contains(oper))
                                         && (bmno == null || p.DWNO.Contains(bmno))
                                         && p.CREATETIME >= kssj && p.CREATETIME <= jssj
                                         orderby p.ID descending select p;
            ret["code"] = 0;
            ret["count"] = source.Count();
            ret["data"] = source.Skip((page - 1) * limit).Take(limit).ToList();
            return ret;
        }
        [HttpGet]
        public Hashtable YwblYjhcList1(int page, int limit, string xtlb, string warnlx,
                                       string warnlx1,
                                       string oplx,
                                       string name,
                                       string sfzmhm,
                                       string hphm,
                                       string hczt,
                                       string oper,
                                       string hcjg,
                                       string rq1,
                                       string rq2,
                                       string bmno)
        {
            Hashtable ret = new Hashtable();
            DateTime kssj = Convert.ToDateTime(rq1 + " 00:00:00");
            DateTime jssj = Convert.ToDateTime(rq2 + " 23:59:59");
            IQueryable<WARNLOG> source = from p in db1.WARNLOG
                                         where  p.WARNLX != "排队叫号"
                                         && (xtlb == null || p.XTLB.Contains(xtlb)) && (warnlx == null || p.WARNLX.Contains(warnlx))
                                         && (warnlx1 == null || p.WARNLX1.Contains(warnlx1)) && (oplx == null || p.OPLX.Contains(oplx))
                                         && (name == null || p.NAME.Contains(name)) && (sfzmhm == null || p.SFZMHM.Contains(sfzmhm))
                                         && (hphm == null || p.HPHM.Contains(hphm)) && (hczt == null || p.HCZT.Contains(hczt))
                                         && (oper == null || p.OPERNAME.Contains(oper)) && (hcjg == null || p.HCJG.Contains(hcjg))
                                         && (bmno == null || p.DWNO.Contains(bmno))
                                         && p.CREATETIME>=kssj && p.CREATETIME<=jssj
                                         orderby p.ID descending
                                         select p;
            ret["code"] = 0;
            ret["count"] = source.Count();
            ret["data"] = source.Skip((page - 1) * limit).Take(limit).ToList();
            return ret;
        }
        [HttpGet]
        public Hashtable GetSignWarnlog(string id)
        {
            Hashtable ret = new Hashtable();
            WARNLOG w= (from p in db1.WARNLOG where p.ID == id select p).First();
            ret["warnlog"] = w;
            ret["flow"] = null;
            if (w.WARNLX1 == "违规办理" && w.XTLB == "机动车" &&( w.OPLX == "临牌核发超过次数"||w.OPLX== "注册/转移登记年龄超限"))
            {
                ret["flow"] = (from p in db3.VVEH_FLOW1 where p.LSH == w.GLLSH select p).First();
            }
            else
            {
                try
                {
                    ret["flow"] = (from p in db3.DDRV_FLOW where p.LSH == w.GLLSH select p).First();
                }
                catch
                {
                    try
                    {
                        ret["flow"] = (from p in db3.VVEH_FLOW where p.LSH == w.GLLSH select p).First();
                    }
                    catch
                    {

                    }
                }
            }
            ret["main"] = null;
            if (w.WARNLX == "大厅业务")
            {
                try
                {
                    ret["main"] = (from p in db1.PDXX where p.XH == w.KEY6 select p).First();
                }
                catch
                {

                }
            }
            else if (w.WARNLX == "下放业务")
            {
                try
                {
                    ret["main"] = (from p in db2.BUSINESS_FLOW where p.ID == w.KEY6 select p).First();
                }
                catch
                {

                }
            }
            return ret;
        }
        [HttpPost]
        public void YwblHcSave(dynamic obj)
        {
            string Authorization = Request.Headers.Authorization.ToString();
            USERDB user = HttpRuntimeCache.Get(Authorization) as USERDB;
            string id = Convert.ToString(obj.ID);
            WARNLOG wn = (from p in db1.WARNLOG where p.ID == id select p).First();
            wn.HCZT = "1";
            wn.HCJG = Convert.ToString(obj.HCJG);
            wn.MEMO1 = Convert.ToString(obj.MEMO1);
            wn.MEMO2 = Convert.ToString(obj.MEMO2);
            wn.HCSJ = DateTime.Now;
            wn.HCOPER = user.NAME;
            db1.SaveChanges();
        }
        [HttpGet]
        public Hashtable YjzhcxInit()
        {
            Hashtable ret = new Hashtable();
            IQueryable<WARNLOG> source = from p in db1.WARNLOG
                                         where p.WARNLX != "排队叫号" select p;
            ret["warnlx"] = (new string[] { "" }).Concat((from p in source select p.WARNLX).Distinct());
            ret["warnlx1"] =(new string[] { "" }).Concat((from p in source select p.WARNLX1).Distinct());
            ret["xtlb"] = (from p in source select p.XTLB).Distinct();
            ret["oplx"] = (new string[] { "" }).Concat((from p in source select p.OPLX).Distinct());

            return ret;
        }
        [HttpGet]
        public Hashtable QueryHmd(string id,string zl)
        {
            Hashtable ret = new Hashtable();
            if (zl == "1")
            {
                PDXX px = (from p in db1.PDXX where p.XH == id select p).First();
                ret["data"] = px.DRVANDVEHINFO;
            }
            else if (zl == "2")
            {
                BUSINESS_FLOW bf = (from p in db2.BUSINESS_FLOW where p.ID == id select p).First();
                ret["data"] = bf.DRVANDVEHINFO;
            }
            return ret;
        }
    }
}
