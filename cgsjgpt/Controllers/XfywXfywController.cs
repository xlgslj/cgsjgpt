using cgsjgpt.Controllers.Filters;
using cgsjgpt.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using cgsjgpt.userclass.method;
using Newtonsoft.Json;
using System.Collections;
using cgsjgpt.userclass.data;
using System.Web;
using System.IO;
using System.Threading.Tasks;

namespace cgsjgpt.Controllers
{
    [CustomAuthAttribute(true)]
    [WebApiExceptionFilter]
    public class XfywXfywController : ApiController
    {
        private Entities db = new Entities();
        private EntitiesXfyw db5 = new EntitiesXfyw();
        private EntitiesSys1 db3 = new EntitiesSys1();
        [HttpPost]
        public void BusinessFlowAdd(dynamic obj)
        {
            string Authorization = Request.Headers.Authorization.ToString();
            USERDB user = HttpRuntimeCache.Get(Authorization) as USERDB;
            BUSINESS_FLOW b = new BUSINESS_FLOW();
            b.ID = PubMethod.maxid();
            b.DWNO = user.DWNO;
            b.DWMC = user.DWNAME;
            b.BID = Convert.ToString(obj.bid);
            b.PTLB = Convert.ToString(obj.ptlb);
            b.XTLB = Convert.ToString(obj.xtlb);
            b.YWLX = Convert.ToString(obj.ywlx);
            b.YWYY = Convert.ToString(obj.ywyy);
            b.SHMS = Convert.ToString(obj.shms);
            b.BLMS = Convert.ToString(obj.blms);
            b.HPZLNO = Convert.ToString(obj.hpzlno);
            b.HPZL = Convert.ToString(obj.hpzl);
            b.HPHM = Convert.ToString(obj.hphm);
            b.HPHM1 = Convert.ToString(obj.yhphm);
            b.CLSBDH = Convert.ToString(obj.clsbdh);
            b.CYLSH = Convert.ToString(obj.cylsh);
            b.BRZJLX = Convert.ToString(obj.brzjlx);
            b.BRZJHM = Convert.ToString(obj.brzjhm);
            b.BRNAME = Convert.ToString(obj.brname);
            b.BRTEL = Convert.ToString(obj.brtel);
            b.DLRZJLX = Convert.ToString(obj.dlrzjlx);
            b.DLRZJHM = Convert.ToString(obj.dlrzjhm);
            b.DLRNAME = Convert.ToString(obj.dlrname);
            b.DLRTEL = Convert.ToString(obj.dlrtel);
            b.DWDM = Convert.ToString(obj.dwdm);
            b.BLDWMC = Convert.ToString(obj.dwmc);
            b.BRZLS = Convert.ToString(obj.brzls);
            b.DLRZLS = Convert.ToString(obj.dlrzls);
            b.DWZLS = Convert.ToString(obj.dwzls);
            b.OPERID = user.ID;
            b.OPER = user.NAME;
            b.OPERTIME = DateTime.Now.ToString("yyyy-MM-dd");
            b.OPERTIME1 = DateTime.Now; ;
            b.OPERTIME2 = PubMethod.ConvertDateTimeInt(DateTime.Now);
            b.LSHHCZT = "0";
            b.ZT = b.SHMS == "需要审核" ? "00" : "10";
            b.WARNZT = "0-0-0-0-0";
            b.QUERYZT = "待查";
            List<OXfywBlzl> zls = null;
            zls = b.BLMS == "本人办理" ? JsonConvert.DeserializeObject<List<OXfywBlzl>>(b.BRZLS) : (b.BLMS == "代理个人业务" ? JsonConvert.DeserializeObject<List<OXfywBlzl>>(b.DLRZLS) : JsonConvert.DeserializeObject<List<OXfywBlzl>>(b.DWZLS));
            String dirImgPath = HttpContext.Current.Server.MapPath("/upfiles/images");
            String dirTempPath = HttpContext.Current.Server.MapPath("/upfiles/temp");
            foreach (OXfywBlzl zl in zls)
            {
                try
                {
                    string filename = zl.SRC.Split(new char[] { '/' })[3];
                    File.Move(dirTempPath + "/" + filename, dirImgPath + "/" + filename);
                }
                catch
                {

                }
            }
            b.BRZLS = b.BRZLS.Replace("temp", "images");
            b.DLRZLS = b.DLRZLS.Replace("temp", "images");
            b.DWZLS = b.DWZLS.Replace("temp", "images");

            db5.BUSINESS_FLOW.Add(b);
            db5.SaveChanges();

            //检查是否黑名单
            //Task taskB = new Task(() => SysPublicMethodController.QueryVehicleAndDriverForXfyw(b.ID));
            //taskB.Start();
            HttpHelper.HttpGet("http://127.0.0.1/api/SysPublicMethod/QueryVehicleAndDriverForXfyw?id=" + b.ID, null, null);
        }
        public void AgentAndHmdTask(BUSINESS_FLOW b, string oper, string dwno, string dwmc)
        {
            if (b.BLMS == "代理个人业务"||b.BLMS== "代理单位业务")
            {
                using (EntitiesHmd db3 = new EntitiesHmd())
                {
                    AGENT ag = new AGENT();
                    ag.ID = PubMethod.maxid();
                    ag.DWNO = dwno;
                    ag.DWMC = dwmc;
                    ag.PID = b.ID;
                    ag.YWZL = "下放业务";
                    ag.YWLX = b.YWLX;
                    ag.BRNAME = b.BLMS == "代理个人业务"?b.BRNAME:b.BLDWMC;
                    ag.BRZJLX = b.BLMS == "代理个人业务"?b.BRZJLX: "组织机构代码证书";
                    ag.BRZJHM = b.BLMS == "代理个人业务"?b.BRZJHM:b.DWDM;
                    ag.DLRNAME = b.DLRNAME;
                    ag.DLRZJLX = b.DLRZJLX;
                    ag.DLRZJHM = b.DLRZJHM;
                    ag.ADDLX = "系统写入";
                    ag.ADDRY = oper;
                    ag.ADDDAY = DateTime.Now.ToString("yyyy-MM-dd");
                    ag.ADDTIME = DateTime.Now;
                    ag.ADDTIMESECONDS = PubMethod.ConvertDateTimeInt(DateTime.Now);
                    ag.ZT = "0";
                    db3.AGENT.Add(ag);
                    db3.SaveChanges();
                    HmdglRyhmdController.AgentAddRblist(ag);
                }
            }
        }
        [HttpGet]
        public Hashtable QueryDshList(int page, int limit)
        {
            string Authorization = Request.Headers.Authorization.ToString();
            USERDB user = HttpRuntimeCache.Get(Authorization) as USERDB;
            USERDB u = (from p in db.USERDB where p.ID == user.ID select p).First();
            List<string> jgbms = JsonConvert.DeserializeObject<List<string>>(u.JGDWS);
            Hashtable ret = new Hashtable();
            var source = (from p in db5.BUSINESS_FLOW where p.ZT == "00"&&jgbms.Contains(p.DWNO) orderby p.OPERTIME1 select p).ToList();
            ret["code"] = "0";
            ret["count"] = source.Count;
            ret["data"] = source;
            return ret;
        }
        [HttpGet]
        public Hashtable GetSingleBusiness(string id)
        {
            Hashtable ret = new Hashtable();
            var bussiness= (from p in db5.BUSINESS_FLOW where p.ID == id select p).First();
            ret["data"] = bussiness;
            ret["flow"] = null;
            try
            {
                ret["flow"] = (from p in db3.DDRV_FLOW where p.LSH == bussiness.CJGLSH select p).First();
            }
            catch
            {
                try
                {
                    ret["flow"] = (from p in db3.VVEH_FLOW where p.LSH == bussiness.CJGLSH select p).First();
                }
                catch
                {

                }
            }
            return ret;
        }
        [HttpPost]
        public void BusinessSp(dynamic obj)
        {
            string Authorization = Request.Headers.Authorization.ToString();
            USERDB user = HttpRuntimeCache.Get(Authorization) as USERDB;
            string id = Convert.ToString(obj.id);
            string zt = Convert.ToString(obj.zt);
            string spcontent = Convert.ToString(obj.spcontent);
            BUSINESS_FLOW b = (from p in db5.BUSINESS_FLOW where p.ID == id select p).First();
            b.SPER = user.NAME;
            b.SPTIME = DateTime.Now.ToString("yyyy-MM-dd");
            b.SPTIME1 = DateTime.Now; ;
            b.SPTIME2 = PubMethod.ConvertDateTimeInt(DateTime.Now);
            b.SPCONTENT = spcontent ;
            b.ZT = zt == "0" ? "01" : (zt=="1"?"11":"41");
            db5.SaveChanges();
        }
        [HttpGet]
        public Hashtable QuerySpjg(int page, int limit)
        {
            string Authorization = Request.Headers.Authorization.ToString();
            USERDB user = HttpRuntimeCache.Get(Authorization) as USERDB;
            Hashtable ret = new Hashtable();
            var source = (from p in db5.BUSINESS_FLOW where p.DWNO==user.DWNO&( p.ZT.Substring(0,1) == "0"||p.ZT.Substring(0,1)=="1")&&p.ZT!="10" orderby p.OPERTIME1 select p).ToList();
            ret["code"] = "0";
            ret["count"] = source.Count;
            ret["data"] = source;
            return ret;
        }
        [HttpGet]
        public Hashtable GetBusiness_flow(string id)
        {
            Hashtable ret = new Hashtable();
            BUSINESS_FLOW bf= (from p in db5.BUSINESS_FLOW where p.ID == id select p).First();
            ret["data"] = bf;
            ret["base"] = (from p in db5.BUSINESSBASE where p.ID == bf.BID select p).First();
            return ret;
        }
        [HttpPost]
        public void BusinessFlowEdit(BUSINESS_FLOW s)
        {

            string id = s.ID;
            BUSINESS_FLOW d = (from p in db5.BUSINESS_FLOW where p.ID == id select p).First();
            BUSINESS_FLOW nobj=PubMethod.Mapper<BUSINESS_FLOW, BUSINESS_FLOW>(s);

            List<OXfywBlzl> zls = null;
            zls = nobj.BLMS == "本人办理" ? JsonConvert.DeserializeObject<List<OXfywBlzl>>(nobj.BRZLS) : (nobj.BLMS == "代理个人业务" ? JsonConvert.DeserializeObject<List<OXfywBlzl>>(nobj.DLRZLS) : JsonConvert.DeserializeObject<List<OXfywBlzl>>(nobj.DWZLS));
            String dirImgPath = HttpContext.Current.Server.MapPath("/upfiles/images");
            String dirTempPath = HttpContext.Current.Server.MapPath("/upfiles/temp");
            foreach (OXfywBlzl zl in zls)
            {
                try
                {
                    string filename = zl.SRC.Split(new char[] { '/' })[3];
                    File.Move(dirTempPath + "/" + filename, dirImgPath + "/" + filename);
                }
                catch
                {

                }
            }
            nobj.BRZLS = nobj.BRZLS.Replace("temp", "images");
            nobj.DLRZLS = nobj.DLRZLS.Replace("temp", "images");
            nobj.DWZLS = nobj.DWZLS.Replace("temp", "images");

            nobj.ZT = "00";
            db5.BUSINESS_FLOW.Remove(d);
            db5.BUSINESS_FLOW.Add(nobj);
            db5.SaveChanges();
        }
        [HttpGet]
        public Hashtable QueryDblList(int page, int limit)
        {
            string Authorization = Request.Headers.Authorization.ToString();
            USERDB user = HttpRuntimeCache.Get(Authorization) as USERDB;
            Hashtable ret = new Hashtable();
            var source = (from p in db5.BUSINESS_FLOW where (p.ZT == "00" || p.ZT == "01"||p.ZT == "10" || p.ZT == "11")&&p.OPERID==user.ID orderby p.OPERTIME1 select p).ToList();
            ret["code"] = "0";
            ret["count"] = source.Count;
            ret["data"] = source;
            return ret;
        }
        [HttpPost]
        public void BusinessXxbl(dynamic obj)
        {
            string Authorization = Request.Headers.Authorization.ToString();
            USERDB user = HttpRuntimeCache.Get(Authorization) as USERDB;
            string id = Convert.ToString(obj.id);
            string cjglsh = Convert.ToString(obj.cjglsh);
            string cylsh = Convert.ToString(obj.cylsh);
            BUSINESS_FLOW b = (from p in db5.BUSINESS_FLOW where p.ID == id select p).First();
            b.CJGLSH = cjglsh;
            b.CYLSH = cylsh == null ? "" : cylsh;
            b.OPER1 = user.NAME;
            b.OPER1TIME = DateTime.Now.ToString("yyyy-MM-dd");
            b.OPER1TIME1 = DateTime.Now; ;
            b.OPER1TIME2 = PubMethod.ConvertDateTimeInt(DateTime.Now);
            b.ZT = "20";
            db5.SaveChanges();
            //添加代办纪录
            Task taskA = new Task(() => AgentAndHmdTask(b, user.NAME, user.DWNO, user.DWNAME));
            taskA.Start();
            Task taskB = new Task(() => cgsjgpt.userclass.warn.ywlsh.Xfywywlshyj(id));
            taskB.Start();
        }
        [HttpGet]
        public Hashtable QueryBusiness(int page, int limit, string ptlb, string xtlb, string ywlx, string ywyy, string blms,string shms,string hphm,string brzjhm,string rq1,string rq2, string bmno, string include)
        {
            Hashtable ret = new Hashtable();
            string Authorization = Request.Headers.Authorization.ToString();
            USERDB user = HttpRuntimeCache.Get(Authorization) as USERDB;
            List<string> bms = new List<string>();
            if (bmno == null)
            {

                bms = PubMethod.GetAllDw(user.DWNO);
            }
            else
            {
                if (include == "false")
                {
                    bms.Add(bmno);
                }
                else
                {
                    bms = PubMethod.GetAllDw(bmno);
                }
            }
            List<string> dwnos = GetAllDw(user.DWNO);
            IQueryable<BUSINESS_FLOW> source = from p in db5.BUSINESS_FLOW
                                               where bms.Contains(p.DWNO)
                                               && (ptlb == null || p.PTLB.Contains(ptlb)) && (xtlb == null || p.XTLB.Contains(xtlb))
                                              && (ywlx == null || p.YWLX.Contains(ywlx)) && (ywyy == null || p.YWYY.Contains(ywyy))
                                              && (blms == null || p.BLMS.Contains(blms)) && (shms == null || p.SHMS.Contains(shms))
                                              && (hphm == null || p.HPHM.Contains(hphm)) && (brzjhm == null || p.BRZJHM.Contains(brzjhm))
                                              &&p.OPERTIME.CompareTo(rq1) >= 0 && p.OPERTIME.CompareTo(rq2) <= 0
                                              &&dwnos.Contains(p.DWNO)
                                               orderby p.ID
                                              select p;
            ret["code"] = 0;
            ret["count"] = source.Count();
            ret["data"] = source.Skip((page - 1) * limit).Take(limit).ToList();
            return ret;
        }
        /// <summary>
        /// 递归获取当前单位i及子单位
        /// </summary>
        /// <param name="dwno"></param>
        /// <returns></returns>
        public List<string> GetAllDw(string dwno)
        {
            List<string> dwnos = new List<string>();
            dwnos.Add(dwno);
            IQueryable<BMDB> source = from p in db.BMDB where p.PID == dwno select p;
            foreach (BMDB b in source)
            {
                dwnos.AddRange(GetAllDw(b.ID));
               // GetAllDw(b.ID);
            }

            return dwnos;
        }
    }
}
