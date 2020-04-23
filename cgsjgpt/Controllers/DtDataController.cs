using System;
using System.Collections;
using System.Collections.Generic;
using System.Data.Entity.Core.Objects;
using System.Data.Entity.SqlServer;
using System.Dynamic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using cgsjgpt.Controllers.Filters;
using cgsjgpt.Models;
using cgsjgpt.userclass.data;
using cgsjgpt.userclass.method;
using Newtonsoft.Json;

namespace cgsjgpt.Controllers
{
    [CustomAuthAttribute(false)]
    [WebApiExceptionFilter]
    public class DtDataController : ApiController
    {
        private Entities db = new Entities();
        private EntitiesDtgl db2 = new EntitiesDtgl();
        [HttpGet]
        public string GetYwlxGroup(string dwno)
        {
            DateTime now = DateTime.Now;
             var data = from p in db2.PDXX
                        where p.DWNO == dwno
                         && p.QHSJ.Value.Year == now.Year && p.QHSJ.Value.Month == now.Month && p.QHSJ.Value.Day == now.Day
                        group p by new { p.YWLXCODE, p.YWLXMC } into g
                        select new { code = g.Key.YWLXCODE, lxmc = g.Key.YWLXMC, count1 = g.Count(x => x.ZT == "等待叫号"), count2 = g.Count() };
                        
            IQueryable<CODEYWLX> lxs = (from p in db.CODEYWLX orderby p.CODE select p).Take(6);
            List<string> ret = new List<string>();
            foreach(CODEYWLX lx in lxs)
            {
                dynamic obj= new ExpandoObject();
                obj.code = lx.CODE;
                obj.name = lx.NAME;
                bool exit= (from p in data where p.code == lx.CODE select p).Count()>0?true:false; 
                obj.count1 =exit ? (from p in data where p.code == lx.CODE select p).First().count1:0;
                obj.count2 =exit ? (from p in data where p.code == lx.CODE select p).First().count2 : 0;
                ret.Add(JsonConvert.SerializeObject(obj));
            }
            return JsonConvert.SerializeObject(ret);
        }
        [HttpGet]
        public int GetWaitCount(string dwno)
        {
            DateTime? day = DateTime.Now;
             return (from p in db2.PDXX where p.DWNO == dwno && p.ZT == "等待叫号"&&p.QHSJ.Value.Year==day.Value.Year&&p.QHSJ.Value.Month==day.Value.Month&& p.QHSJ.Value.Day==day.Value.Day select p).Count();
        }
        [HttpGet]
        public ResultToEchart WaitAndProcCount(string dwno)
        {

            CONFIGBM conf = (from p in db.CONFIGBM where p.DWNO == dwno && p.KEYWORD == "PHSJD" select p).First();
            DateTime now = DateTime.Now;
            string kssjstr =conf.V1;
            string jssjstr = conf.V2;
            DateTime kssj = Convert.ToDateTime(DateTime.Now.ToString("yyyy-MM-dd") + " " + kssjstr.Substring(0, 2) + ":00:00").AddHours(-1);
            DateTime jssj = Convert.ToDateTime(DateTime.Now.ToString("yyyy-MM-dd") + " " + jssjstr.Substring(0, 2) + ":00:00").AddHours(1);
    
            ResultToEchart ret = new ResultToEchart();
            DateTime start = kssj;
            ret.xAxis = new List<string>();
            ret.series = new List<ResultToEchart_Series>();
            ResultToEchart_Series lb1 = new ResultToEchart_Series();
            lb1.data = new List<float?>();
            ResultToEchart_Series lb2 = new ResultToEchart_Series();
            lb2.data = new List<float?>();
            while (start.CompareTo(kssj) >= 0 & start.CompareTo(jssj) <= 0)
            {
                ret.xAxis.Add(start.Hour.ToString());

                var waitcount = (start.Hour - now.Hour)>0&&(kssj.Hour != start.Hour) ? 0 : (from p in db2.PDXX
                                                                   where p.DWNO == dwno
                                                                      && p.QHSJ.Value.Year == start.Year && p.QHSJ.Value.Month == start.Month && p.QHSJ.Value.Day == start.Day
                                                                      && (((p.STARTTIME == null && (p.QHSJ.Value.Hour- start.Hour) <= 0) || (p.STARTTIME != null && (p.QHSJ.Value.Hour - start.Hour) <= 0 && (p.STARTTIME.Value.Hour - start.Hour) > 0)))
                                                                   select new { qhsj = p.QHSJ, start = start, day = EntityFunctions.DiffDays(p.QHSJ, start), hour = EntityFunctions.DiffHours(p.QHSJ, start) }
                                ).Count();


                if ((start.Hour - now.Hour) > 0) { lb1.data.Add(null);} else lb1.data.Add(waitcount);

                var proccount = (start.Hour - now.Hour) > 0 && (kssj.Hour != start.Hour) ? 0 : (from p in db2.PDXX
                                                                   where p.DWNO == dwno
                                                                      && p.QHSJ.Value.Year == start.Year && p.QHSJ.Value.Month == start.Month && p.QHSJ.Value.Day == start.Day
                                                                      && (((p.STARTTIME != null && (p.STARTTIME.Value.Hour== start.Hour))))
                                                                   select new { qhsj = p.QHSJ, start = start, day = EntityFunctions.DiffDays(p.QHSJ, start), hour = EntityFunctions.DiffHours(p.QHSJ, start) }
                                ).Count();
                if ((start.Hour - now.Hour) > 0) lb2.data.Add(null); else lb2.data.Add(proccount);

               
                start = start.AddHours(1);
            }
            ret.series.Add(lb1);
            ret.series.Add(lb2);
            return ret;
        }
        [HttpGet]
        public ResultToEchart CkProcCount(string dwno)
        {
            ResultToEchart ret = new ResultToEchart();
            ret.xAxis = new List<string>();
            ret.series = new List<ResultToEchart_Series>();
            ResultToEchart_Series rs = new ResultToEchart_Series();
            rs.name = "处理量";
            rs.type = "bar";
            rs.data = new List<float?>();

            DateTime now = DateTime.Now;
            IQueryable<CKSET> cks = from p in db.CKSET where p.BMNO == dwno orderby p.ID select p;
            foreach(CKSET ck in cks)
            {
                ret.xAxis.Add(ck.CKMC);
                int count = (from p in db2.PDXX
                             where p.DWNO == dwno && p.CK == ck.CKMC
                             && p.STARTTIME.Value.Year == now.Year && p.STARTTIME.Value.Month == now.Month && p.STARTTIME.Value.Day == now.Day
                             select p
                           ).Count();
                rs.data.Add(count);
            }
            ret.series.Add(rs);
            return ret;
        }
        [HttpGet]
        public Result<string,PDXX> GetListDataToDefault(string dwno)
        {
            Result<string, PDXX> ret = new Result<string, PDXX>();
            ret.Data = (from p in db2.PDXX where p.ZT == "正在办理"&&p.DWNO==dwno orderby p.STARTTIME descending select p).Take(8).ToList();
            foreach(PDXX p in ret.Data)
            {
                p.SECOND = PubMethod.ConvertDateTimeInt(DateTime.Now) - PubMethod.ConvertDateTimeInt((DateTime) p.STARTTIME);
            }
            List<PDXX> add = new List<PDXX>();
            if (ret.Data.Count < 8)
            {
                add= (from p in db2.PDXX where p.ZT == "办结" && p.DWNO == dwno orderby p.ENDTITIME descending select p).Take(8-ret.Data.Count).ToList();
            }
            ret.Data = ret.Data.Concat(add).ToList();

            return ret;
        }
        [HttpGet]
        public Result<string,WARNEVENT> CheckWarn(string dwno)
        {
            Result<string, WARNEVENT> ret = new Result<string, WARNEVENT>();
            IQueryable<WARNEVENT> sourec = (from p in db2.WARNEVENT orderby p.ID descending select p).Take(4);
            ret.Data = (from p in sourec orderby p.ID select p).ToList();
            return ret;
        }
        [HttpGet]
        public Result<string, PDXX> CheckWarn_bak(string dwno)
        {
            Result<string, PDXX> ret = new Result<string, PDXX>();
            DateTime now = DateTime.Now;
            IQueryable<CONFIGBM> conf = from p in db.CONFIGBM where p.DWNO == dwno select p;
            int blsj = conf.Where(p => p.KEYWORD == "PJYWBLSJBZXZ").First().V1 == null ? 0 : int.Parse(conf.Where(p => p.KEYWORD == "PJYWBLSJBZXZ").First().V1) * 60;
            int dhsj = conf.Where(p => p.KEYWORD == "QZPJDHSJBZXZ").First().V1 == null ? 0 : int.Parse(conf.Where(p => p.KEYWORD == "QZPJDHSJBZXZ").First().V1) * 60;
           IQueryable<PDXX> px= (from p in db2.PDXX
                             where p.DWNO == dwno
                            // && p.QHSJ.Value.Year == now.Year && p.QHSJ.Value.Month == now.Month && p.QHSJ.Value.Day == now.Day
                              && ((p.ZT == "等待叫号" && EntityFunctions.DiffSeconds(p.QHSJ, now) > dhsj) || (p.ZT == "正在办理" && EntityFunctions.DiffSeconds(p.STARTTIME, now) > blsj))
                               orderby p.QHSJ,p.STARTTIME
                             select p).Take(9);
            foreach(PDXX p in px)
            {
                if (p.ZT == "等待叫号")
                {
                    p.WAITSECOND = PubMethod.ConvertDateTimeInt(now) - PubMethod.ConvertDateTimeInt(Convert.ToDateTime(p.QHSJ));
                }
                if (p.ZT == "正在办理")
                {
                    p.SECOND = PubMethod.ConvertDateTimeInt(now) - PubMethod.ConvertDateTimeInt(Convert.ToDateTime(p.STARTTIME));
                }

            }
            ret.Data = px.ToList();
            return ret;
        }
        [HttpGet]
        public Hashtable ywblTj1(string dwno)
        {

            string rq = DateTime.Now.ToString("yyyy-MM-dd");
            Hashtable ret = new Hashtable();

            var group = (from p in db2.PDXX
                         where p.DWNO == dwno && p.QHRQ == rq && p.ZT != "等待叫号" && p.ZT != "正在办理" && p.ZT != "空号"
                         group p by new { p.JBR,p.CK } into g
                         select new { ry = g.Key.JBR,ck=g.Key.CK, zs = g.Count(), pjdhsj = (int)g.Average(x => (int)x.WAITSECOND), dhcsrs = g.Count(p => p.DHYJ == "1"), pjblsj = (int)g.Average(p => (int)p.SECOND), blcsrs = g.Count(p => p.BLYJ == "1") }).OrderByDescending(p => p.zs);
            ret["data"] = group;

            return ret;
        }
    }
}
