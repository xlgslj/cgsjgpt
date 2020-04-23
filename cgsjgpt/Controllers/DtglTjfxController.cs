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
using System.Threading.Tasks;
using System.Dynamic;
using System.Collections;

namespace cgsjgpt.Controllers
{
    [CustomAuthAttribute(true)]
    [WebApiExceptionFilter]
    public class DtglTjfxController : ApiController
    {
        private Entities db = new Entities();
        private EntitiesDtgl db2 = new EntitiesDtgl();
        [HttpGet]
        public string SlrygzltjHeards()
        {
            List<List<dynamic>> heads = new List<List<dynamic>>();

            List<dynamic> row1 = new List<dynamic>();
            dynamic h = new ExpandoObject();

            h.type = "numbers";
            h.title = "排名";
            h.align = "center";
            h.rowspan = 2;
            row1.Add(h);

            h = new ExpandoObject();
            h.field = "name";
            h.title = "姓名";
            h.align = "center";
            h.totalRowText = "合计";
            h.rowspan = 2;
            row1.Add(h);

            h = new ExpandoObject();
            h.field = "zyws";
            h.title = "总业务数";
            h.align = "center";
            h.@event= "总业务数";
            h.totalRow = true;
            h.rowspan = 2;
            row1.Add(h);

            /*----第二行表头-----*/
            List<dynamic> row2 = new List<dynamic>();
            IQueryable<CODEYWLX> ywlx = from p in db.CODEYWLX orderby p.CODE select p;
            foreach(CODEYWLX r in ywlx)
            {
                h = new ExpandoObject();
                h.field = "data"+r.CODE;
                h.title = r.NAME;
                h.align = "center";
                h.@event = r.CODE;
                h.totalRow = true;
                row2.Add(h);
            }
            /*---------*/

            h = new ExpandoObject();
            h.title = "业务分类";
            h.align = "center";
            h.totalRow = true;
            h.colspan = row2.Count;
           row1.Add(h);

            h = new ExpandoObject();
            h.field = "khs";
            h.title = "空号数";
            h.align = "center";
            h.@event = "空号数";
            h.totalRow = true;
            h.rowspan = 2;
            row1.Add(h);

            h = new ExpandoObject();
            h.field = "sjyws";
            h.title = "实际业务数";
            h.align = "center";
            h.@event = "实际业务数";
            h.totalRow = true;
            h.rowspan = 2;
            row1.Add(h);

            heads.Add(row1);
            heads.Add(row2);

            return JsonConvert.SerializeObject(heads);
        }
        [HttpGet]
        public ResultToLay<string> SlrygzltjDatas(string page,int limit,string rq1,string rq2,string dwno,string sortlx)
        {
            ResultToLay<string> ret = new ResultToLay<string>();

            List<dynamic> ds = new List<dynamic>();
            dynamic d = new ExpandoObject();
            
            var g = sortlx == "总业务数" ?
                from p in db2.PDXX where p.QHRQ.CompareTo(rq1) >= 0 && p.QHRQ.CompareTo(rq2) <= 0 && p.DWNO == dwno group p by new {JBR=p.JBR,JBRID=p.JBRID } into g1 select new { count = g1.Key.JBR == null ? 0 : g1.Count(), JBR = g1.Key.JBR,JBRID=g1.Key.JBRID }
                : from p in db2.PDXX where p.QHRQ.CompareTo(rq1) >= 0 && p.QHRQ.CompareTo(rq2) <= 0 && p.DWNO == dwno && p.ZT == "办结" group p by new { JBR = p.JBR, JBRID = p.JBRID } into g1 select new { count = g1.Key.JBR == null ? 0 : g1.Count(), JBR = g1.Key.JBR,JBRID=g1.Key.JBRID };
           

            var rys = from p in g orderby p.count descending select new { JBR=p.JBR,JBRID=p.JBRID };
            PubMethod.wrlog("rys", JsonConvert.SerializeObject(rys));
            foreach (var r in rys)
            {
                d = new ExpandoObject();
                d.id = r.JBRID;
                d.name =r.JBR==null?"待办业务": r.JBR;

                IQueryable<PDXX> source = from p in db2.PDXX where p.JBR == r.JBR && p.QHRQ.CompareTo(rq1) >= 0 && p.QHRQ.CompareTo(rq2) <= 0 && p.DWNO == dwno select p;
                d.zyws = source.Count();

                IQueryable<CODEYWLX> ywlx = from p in db.CODEYWLX orderby p.CODE select p;
                foreach (CODEYWLX yw in ywlx)
                {
                    var dic = (IDictionary<string, object>)d;
                    IQueryable<PDXX> s1 = r.JBR == null ? from p in source where p.YWLXCODE == yw.CODE select p: from p in source where p.YWLXCODE == yw.CODE&&p.ZT== "办结" select p;
                    dic["data" + yw.CODE] = s1.Count();
                }
                d.khs = (from p in source where p.ZT == "空号" select p).Count();
                d.sjyws= (from p in source where (p.ZT == "办结"||p.ZT=="退办") select p).Count();
                ds.Add(d);
            }


            ret.code = 0;
            ret.count = ds.Count;
            ret.data = new List<string>();
            ret.data.Add(JsonConvert.SerializeObject(ds));
            return ret;
        }
        [HttpGet]
        public ResultToLay<PDXX> SlrygzltjDatasMore(string jbrid,string rq1,string rq2,string lx)
        {
            string lx1 = Uri.UnescapeDataString(lx);
             ResultToLay<PDXX> ret = new ResultToLay<PDXX>();
            IQueryable<PDXX> d = from p in db2.PDXX
                                 where (jbrid=="null"?p.JBRID==null : p.JBRID==jbrid)& p.QHRQ.CompareTo(rq1) >= 0 && p.QHRQ.CompareTo(rq2) <= 0
                                 &(lx1=="总业务数"?true:(lx1== "空号数"?p.ZT== "空号" : (lx1 == "实际业务数" ? p.ZT== "办结" : (p.YWLXCODE==lx1&&(jbrid == "null"?true: p.ZT == "办结")))))
                                 select p;
            foreach(PDXX p in d)
            {
                p.BRNAME = p.BLLX == "本人业务" ? p.BRNAME : p.DLRNAME;
                p.BRZJHM = p.BLLX == "本人业务" ? p.BRZJHM : p.DLRZJHM;
                p.WAITSECOND = jbrid == "null"?0:(p.WAITSECOND==null?0:(decimal?) Math.Round((double) p.WAITSECOND / 60,1));
                p.SECOND = jbrid == "null" ? 0 : (p.SECOND==null?0:(decimal?)Math.Round((double)p.SECOND / 60,1));
            }
            ret.data = d.ToList();
            ret.code = 0;
            ret.count = ret.data.Count;
            return ret;
        }
        [HttpGet]
        public ResultToLay<string> zrjggzltjDatas(string page, int limit, string rq1, string rq2, string dwno)
        {
            ResultToLay<string> ret = new ResultToLay<string>();
            var g = (from p in db2.PDXX
                    where p.QHRQ.CompareTo(rq1) >= 0 && p.QHRQ.CompareTo(rq2) <= 0 && p.DWNO == dwno
                    group p by new { dwno = p.DWNO, dwmc = p.DWMC, dbrid = p.DBRID, dbrname = p.DBR, ywlx = p.YWLXMC } into g1
                    select new { bmno = g1.Key.dwno, bmmc = g1.Key.dwmc, czryid = g1.Key.dbrid, czry = g1.Key.dbrname, ywlx = g1.Key.ywlx, blsl = g1.Count() }).OrderBy(p=>p.bmmc).ThenBy(p=>p.czry);


            ret.code = 0;
            ret.count = g.Count();
            ret.data = new List<string>();
            ret.data.Add(JsonConvert.SerializeObject(g));
            return ret;
        }
        [HttpGet]
        public ResultToLay<PDXX> ZrjggzltjDatasMore( string dbrid, string rq1, string rq2, string ywlx)
        {
            string lx = Uri.UnescapeDataString(ywlx);
            ResultToLay<PDXX> ret = new ResultToLay<PDXX>();
            IQueryable<PDXX> d = from p in db2.PDXX
                                 where p.QHRQ.CompareTo(rq1) >= 0 && p.QHRQ.CompareTo(rq2) <= 0
                                 & p.DBRID == dbrid && p.YWLXMC == lx
                                 select p;

            ret.data = d.ToList();
            ret.code = 0;
            ret.count = ret.data.Count;
            return ret;
        }
        [HttpGet]
        public ResultToLay<string> ywblyjtjDatas(string page, int limit, string rq1, string rq2, string dwno, string lx)
        {
            ResultToLay<string> ret = new ResultToLay<string>();
            DateTime ksrq = Convert.ToDateTime(rq1 + " 00:00:00");
            DateTime jsrq = Convert.ToDateTime(rq2 + " 23:59:59");
            ret.data = new List<string>();
            if (lx == "日期")
            {
                
                var group = (from p in db2.PDXX
                            where p.DWNO == dwno && p.QHSJ >= ksrq && p.QHSJ <= jsrq && p.ZT != "等待叫号" && p.ZT != "正在办理" && p.ZT != "空号"
                            group p by p.QHRQ into g
                            select new {rq=g.Key, zs = g.Count(), pjdhsj = (int)g.Average(x => (int)x.WAITSECOND), dhcsrs = g.Count(p => p.DHYJ == "1"), pjblsj = (int)g.Average(p => (int)p.SECOND), blcsrs = g.Count(p => p.BLYJ == "1") }).OrderBy(p=>p.rq);
                foreach (var g in group)
                {
                    dynamic obj = new ExpandoObject();
                    obj.rq = g.rq;
                    obj.zs = g.zs;
                    obj.pjdhsj = Convert.ToInt32(g.pjdhsj / 60).ToString() + "分钟";
                    obj.dhcsrs = g.dhcsrs;
                    obj.pjblsj = Convert.ToInt32(g.pjblsj / 60).ToString() + "分钟";
                    obj.blcsrs = g.blcsrs;
                    ret.data.Add(JsonConvert.SerializeObject(obj));
                }
                ret.code = 0;
                ret.count = group.Count();


            }
            else
            {
                var group = (from p in db2.PDXX
                             where p.DWNO == dwno && p.QHSJ >= ksrq && p.QHSJ <= jsrq && p.ZT != "等待叫号" && p.ZT != "正在办理" && p.ZT != "空号"
                             group p by p.JBR into g
                             select new { rq = g.Key, zs = g.Count(), pjdhsj = (int)g.Average(x => (int)x.WAITSECOND), dhcsrs = g.Count(p => p.DHYJ == "1"), pjblsj = (int)g.Average(p => (int)p.SECOND), blcsrs = g.Count(p => p.BLYJ == "1") }).OrderBy(p => p.rq);
                             
                  foreach (var g in group)
                {
                    dynamic obj = new ExpandoObject();
                   obj.rq = g.rq;
                    obj.zs = g.zs;
                    obj.pjdhsj = Convert.ToInt32(g.pjdhsj / 60).ToString()+"分钟";
                    obj.dhcsrs = g.dhcsrs;
                    obj.pjblsj = Convert.ToInt32(g.pjblsj / 60).ToString() + "分钟";
                    obj.blcsrs = g.blcsrs;
                    ret.data.Add(JsonConvert.SerializeObject(obj));
                }
                ret.code = 0;
                ret.count = group.Count();
            }

            return ret;
        }

        [HttpGet]
        public ResultToLay<PDXX> ywblyjtjDatasMore(int page, int limit,string key, string rq1, string rq2, string dwno, string lx,string col)
        {
            PubMethod.wrlog(rq1, dwno);
            string tjlx = Uri.UnescapeDataString(lx);
            string keyword = Uri.UnescapeDataString(key);

            ResultToLay<PDXX> ret = new ResultToLay<PDXX>();
            IQueryable<PDXX> source = from p in db2.PDXX
                                 where p.QHRQ.CompareTo(rq1) >= 0 && p.QHRQ.CompareTo(rq2) <= 0&p.DWNO==dwno && p.ZT != "等待叫号" && p.ZT != "正在办理" && p.ZT != "空号"
                                 orderby p.XH
                                      select p;
            IQueryable<PDXX> source1 = tjlx == "日期" ? source.Where(p => p.QHRQ == keyword) : source.Where(p=>p.JBR==keyword);
            IQueryable<PDXX> source2= col == "dhcsrs" ? source1.Where(p => p.DHYJ == "1") : col == "blcsrs" ? source1.Where(p => p.BLYJ == "1") : source1;
            IQueryable<PDXX> d = source2.Skip((page - 1) * limit).Take(limit);
            ret.data = d.ToList();
            ret.code = 0;
            ret.count = source2.Count();
            return ret;
        }

    }
}
