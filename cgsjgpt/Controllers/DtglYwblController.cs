using System;
using System.Collections;
using System.Collections.Generic;
using System.Dynamic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using cgsjgpt.Controllers.Filters;
using cgsjgpt.Models;
using cgsjgpt.userclass.data;
using cgsjgpt.userclass.method;
using Newtonsoft.Json;
using cgsjgpt.userclass.warn;
using System.Reflection;

namespace cgsjgpt.Controllers
{
    [CustomAuthAttribute(true)]
    [WebApiExceptionFilter]
    public class DtglYwblController : ApiController
    {
        private Entities db = new Entities();
        private EntitiesDtgl db2 = new EntitiesDtgl();
        private EntitiesHmd db3 = new EntitiesHmd();
        private static readonly object _lock = new object();
        /// <summary>
        /// 获取排队信息,为取号用
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public async Task<ResultToEchart> GetPdInfo()
        {
            string Authorization = Request.Headers.Authorization.ToString();
            USERDB user = HttpRuntimeCache.Get(Authorization) as USERDB;
            string today = DateTime.Now.ToString("yyyy-MM-dd");
            string cachekey = "pdinfo-" + user.DWNO + "-" + today;

            Task taskA = new Task(()=>GetPdInfoTask(user.DWNO,today));
            taskA.Start();
            ResultToEchart ret = new ResultToEchart();
            if (HttpRuntimeCache.Exists(cachekey))
            {
                await Task.WhenAll(taskA);
                ret = HttpRuntimeCache.Get(cachekey) as ResultToEchart;
            }
            else
            {
                await Task.WhenAll(taskA);
                ret = HttpRuntimeCache.Get(cachekey) as ResultToEchart;
            }
            return ret;
        }
        private void GetPdInfoTask(string dwno,string today)
        {
            ResultToEchart ret = new ResultToEchart();
            ret.legend = new List<string>();
            ret.series = new List<ResultToEchart_Series>();
            IQueryable<CODEYWLX> rows = (from p in db.CODEYWLX orderby p.CODE select p);
            foreach (var row in rows)
            {
                ret.legend.Add(row.NAME);
                ResultToEchart_Series rs = new ResultToEchart_Series();
                rs.name = row.NAME;
                rs.type = "bar";
                rs.data = new List<float?>();
                rs.data.Add((from p in db2.PDXX where p.YWLXCODE == row.CODE && p.ZT == "等待叫号"&&p.QHRQ==today&&p.DWNO==dwno select p).Count());
                ret.series.Add(rs);
            }
            HttpRuntimeCache.Set("pdinfo-"+dwno+"-"+today,ret);
        }
        [HttpGet]
        public Hashtable GetWaitInfo()
        {
            Hashtable ret = new Hashtable();
            string qhrq= System.DateTime.Now.ToString("yyyy-MM-dd");
            var g = from p in db2.PDXX where p.QHRQ == qhrq && p.ZT == "等待叫号" group p by new { ywmc = p.YWLXMC } into g1 select new { ywmc = g1.Key.ywmc, count = g1.Count() };
            ret["data"] = g;    
            return ret;
        }
        /// <summary>
        /// 获取排队信息,为排队信息查询用
        /// </summary>
        /// <param name="page"></param>
        /// <param name="limit"></param>
        /// <param name="first"></param>
        /// <returns></returns>
        [HttpGet]
        public ResultToLay<PDXX> GetPdxx(int page, int limit, Boolean first,string pdhm,string zjhm,string name,string rq1,string rq2,string zt)
        {
            ResultToLay<PDXX> ret = new ResultToLay<PDXX>();
            if (!first)
            {
                /*  IQueryable<PDXX> rows = from p in db2.PDXX orderby p.QHSJ select p;
              if (pdhm!=null)
                {
                    rows = from p in rows where p.PDHM.Contains(pdhm.ToUpper()) select p;
                }
                if (zjhm != null)
                {
                    rows = from p in rows where p.BRZJHM.Contains(zjhm)||p.DLRZJHM.Contains(zjhm) select p;
                }
                if (zt != null)
                {
                    rows = from p in rows where p.ZT.Contains(zt) select p;
                }*/
                IQueryable<PDXX>  rows = from p in db2.PDXX where p.QHRQ.CompareTo(rq1) >= 0 && p.QHRQ.CompareTo(rq2) <= 0
                       && (pdhm == null || p.PDHM.Contains(pdhm.ToUpper())) && (zjhm == null || p.BRZJHM.Contains(zjhm) || p.DLRZJHM.Contains(zjhm))
                       && (name == null || p.BRNAME.Contains(name) || p.DLRNAME.Contains(name))&&(zt==null||p.ZT==zt) orderby p.QHSJ select p;
                ret.code = 0;
                ret.count = rows.Count();
                ret.data = rows.Skip((page - 1) * limit).Take(limit).ToList();
            }
            else
            {
                ret.code = 0;
                ret.count = 0;
                ret.data = new List<PDXX>();
            }
            return ret;
        }
        [HttpGet]
        public Hashtable GetSignPdxx(string xh)
        {
            Hashtable ret = new Hashtable();
            ret["pdxx"] = (from p in db2.PDXX where p.XH == xh select p).First();
            return ret;
        }
        [HttpGet]
        public Result<string,CODEYWLX> GetYwlx()
        {
            Result<string,CODEYWLX> ret = new Result<string,CODEYWLX>();
            ret.Data = (from p in db.CODEYWLX orderby p.CODE select p).ToList();
            return ret;
        }
        [HttpPost]
        public Hashtable Qh(dynamic obj)
        {
            Hashtable ret = new Hashtable();
            string Authorization = Request.Headers.Authorization.ToString();
            USERDB user = HttpRuntimeCache.Get(Authorization) as USERDB;
            PDXX row = new PDXX();
            row.XH = PubMethod.maxid();
            row.DWNO = user.DWNO;
            row.DWMC = user.DWNAME;
            row.YWLXCODE = Convert.ToString(obj.code);
            row.YWLXMC = Convert.ToString(obj.ywlx);
            row.DBRID = user.ID;
            row.DBR = user.NAME;
            row.PDHM = "";
            row.QHRQ = System.DateTime.Now.ToString("yyyy-MM-dd");
            row.QHSJ = System.DateTime.Now;
            row.CK = "";
            row.JBR = "";
            row.BLLX= Convert.ToString(obj.bllx);
            row.BRNAME = Convert.ToString(obj.name);
            row.BRZJLX = Convert.ToString(obj.zjlx);
            row.BRZJHM = Convert.ToString(obj.zjhm);
            row.DLRNAME = Convert.ToString(obj.name1);
            row.DLRZJLX = Convert.ToString(obj.zjlx1);
            row.DLRZJHM = Convert.ToString(obj.zjhm1);
            row.LSHHCZT = "0";
            row.ISHMD = "00";
            row.DHYJ = "0";
            row.BLYJ = "0";
            row.TBYJ = "0";
            row.JHCS = 0;
            row.JHSJ = Convert.ToDateTime("2000-01-01 00:00:00");

            row.LSHISNULL = Convert.ToString(obj.lshisnull);

            row.QUERYZT = "待查";
            row.ZT = "等待叫号";

            int max = (from p in db2.PDXX where p.YWLXCODE == row.YWLXCODE && p.QHRQ == row.QHRQ&&p.DWNO==user.DWNO select p).Count()+1;
            row.PDHM = max < 10 ? (row.YWLXCODE + "00" + max.ToString()) : (max < 100 ? (row.YWLXCODE + "0" + max.ToString()) : (row.YWLXCODE + max.ToString()));

            db2.PDXX.Add(row);
            db2.SaveChanges();
            Task taskA = new Task(() => ForAhQueryDrvAndVeh(row.XH));
            taskA.Start();
            foreach (var host in MvcApplication.SocketHosts.ToList())
            {
                 host.socket.Send("DataUpdate");
            }
            ret["qhsj"] = ((DateTime)(row.QHSJ)).ToString("yyyy-MM-dd HH:mm:ss");
            ret["pdxx"] = row;
            ret["waits"] = (from p in db2.PDXX where p.QHRQ == row.QHRQ  && p.ZT == "等待叫号" select p).Count() - 1;
            return ret;
        }
        public void ForAhQueryDrvAndVeh(string xh)
        {
            //这里设置你的web地址，可以随便指向你的任意一个aspx页面甚至不存在的页面，目的是要激发Application_Start  
            string url = "http://127.0.0.1/api/SysPublicMethod/QueryVehicleAndDriverForPdjh?xh=" + xh;
            HttpWebRequest myHttpWebRequest = (HttpWebRequest)WebRequest.Create(url);
            HttpWebResponse myHttpWebResponse = (HttpWebResponse)myHttpWebRequest.GetResponse();
            Stream receiveStream = myHttpWebResponse.GetResponseStream();//得到回写的字节流  
        }
        [HttpPost]
        public void ReLed(string id)
        {
            PDXX px = (from p in db2.PDXX where p.XH == id select p).First();
            px.JHCS = 0;
            px.JHSJ = Convert.ToDateTime("2000-01-01 00:00:00");
            db2.SaveChanges();
        }
        [HttpPost]
        public void StopLed(string id)
        {
            string Authorization = Request.Headers.Authorization.ToString();
            USERDB user = HttpRuntimeCache.Get(Authorization) as USERDB;
            int JHBFYYCS = int.Parse((from p in db.CONFIGBM where p.DWNO == user.DWNO && p.KEYWORD == "JHBFYYCS" select p).First().V1);
            PDXX px = (from p in db2.PDXX where p.XH == id select p).First();
            px.JHCS = JHBFYYCS;
            px.JHSJ = Convert.ToDateTime("2000-01-01 00:00:00");
            db2.SaveChanges();
        }
        [HttpPost]
        public Hashtable Jh(dynamic obj)
        {
            Hashtable ret = new Hashtable();

            string Authorization = Request.Headers.Authorization.ToString();
            USERDB user = HttpRuntimeCache.Get(Authorization) as USERDB;
            lock (_lock)
            {
                using (EntitiesDtgl db2 = new EntitiesDtgl())
                {
                    string xh = Convert.ToString(obj.xh);
                    PDXX row = (from p in db2.PDXX where p.XH == xh select p).First();
                    PubMethod.wrlog(user.NAME, row.ZT);
                    if (row.ZT == "等待叫号")
                    {
                        row.WAITSECOND = PubMethod.ConvertDateTimeInt(DateTime.Now) - PubMethod.ConvertDateTimeInt((DateTime)row.QHSJ);
                        row.JBRID = user.ID;
                        row.JBR = user.NAME;
                        row.STARTTIME = DateTime.Now;
                        row.CK = Convert.ToString(obj.ckmc);
                        row.ZT = "正在办理";

                        OPLOG op = new OPLOG();
                        op.ID = PubMethod.maxid();
                        op.DWNO = user.DWNO;
                        op.DWMC = user.DWNAME;
                        op.OPLX = "窗口业务";
                        op.OPLX1 = row.YWLXMC;
                        op.KEY1 = row.XH;
                        op.OPERID = user.ID;
                        op.OPERNAME = user.NAME;
                        op.STARTTIME = DateTime.Now;
                        op.OPSZT = "正在办理";
                        op.MEMO1 = row.PDHM;
                        op.ZT = "0";

                        //解除等候超时报警
                        try
                        {
                            WARNLOG wlog = (from p in db2.WARNLOG where p.WARNLX == "等待超时预警" && p.KEY1 == row.XH select p).First();
                            wlog.ENDTIME = DateTime.Now;
                            wlog.ZT = "1";
                        }
                        catch
                        {

                        }



                        List<pdxx_jhqk> jhqk;
                        pdxx_jhqk pj = new pdxx_jhqk();
                        try
                        {
                            jhqk = JsonConvert.DeserializeObject<List<pdxx_jhqk>>(row.JHQK);
                            pj.xh = jhqk.Count + 1;
                        }
                        catch
                        {
                            jhqk = new List<pdxx_jhqk>();
                            pj.xh = 1;
                        }
                        pj.oplogid = op.ID;
                        pj.ck = Convert.ToString(obj.ckmc);
                        pj.operid = user.ID;
                        pj.opername = user.NAME;
                        pj.stime = (DateTime)row.STARTTIME;
                        pj.szt = "正在办理";
                        jhqk.Add(pj);
                        row.JHQK = JsonConvert.SerializeObject(jhqk);
                        row.OPLOGID = op.ID;

                        op.KEY2 = pj.xh.ToString();
                        db2.OPLOG.Add(op);

                        db2.SaveChanges();

                        ret["Msg"] = op.ID;
                        ret["memo1"] = pj.xh.ToString();
                        ret["lshisnull"] = row.LSHISNULL;
                        

                    }
                    else
                    {
                        ret["Msg"] = "0";
                    }
                    foreach (var host in MvcApplication.SocketHosts.ToList())
                    {
                        host.socket.Send("DataUpdate");

                    }
                   // System.Threading.Thread.Sleep(1000);
                }
            }
            return ret;
        }
        [HttpPost]
        public Hashtable Th(dynamic obj)
        {
            string Authorization = Request.Headers.Authorization.ToString();
            USERDB user = HttpRuntimeCache.Get(Authorization) as USERDB;
            Hashtable ret = new Hashtable();
            ret["msg"] = "0";
            string pdhm = Convert.ToString(obj.pdhm);
            pdhm = pdhm.ToUpper();
            string ckmc = Convert.ToString(obj.ckmc);
            string today= System.DateTime.Now.ToString("yyyy-MM-dd");
            PDXX row=null;
            try
            {
                row = (from p in db2.PDXX where p.QHRQ == today && p.PDHM == pdhm select p).First();
            }
            catch { }
            if (row == null)
            {
                ret["msg"] = "号码不存在";
                return ret;
            }
            if (row.ZT != "空号")
            {
                ret["msg"] = "此号不能特呼";
                return ret;
            }

            CKSET ck = (from p in db.CKSET where p.CKMC == ckmc select p).First();
            List<CkYwlx> ywlxs = JsonConvert.DeserializeObject<List<CkYwlx>>(ck.YWLXS);
            string A = pdhm.Substring(0, 1).ToUpper();
            bool b = false;
            foreach(CkYwlx v in ywlxs)
            {
                if (v.CODE == A)
                {
                    b = true;
                }
            }
            if (!b)
            {
                ret["msg"] = "窗口不能处理此号段";
                return ret;
            }

            /*************/

            int JHBFYYCS = int.Parse((from p in db.CONFIGBM where p.DWNO == user.DWNO && p.KEYWORD == "JHBFYYCS" select p).First().V1);
            row.WAITSECOND = PubMethod.ConvertDateTimeInt(DateTime.Now) - PubMethod.ConvertDateTimeInt((DateTime)row.QHSJ);
            row.JHCS = row.JHCS == null ? 1 : row.JHCS + 1;
            row.JBRID = user.ID;
            row.JBR = user.NAME;
            row.STARTTIME = DateTime.Now;
            row.CK = Convert.ToString(obj.ckmc);
            row.ZT = "正在办理";
            row.JHCS = JHBFYYCS;

            OPLOG op = new OPLOG();
            op.ID = PubMethod.maxid();
            op.DWNO = user.DWNO;
            op.DWMC = user.DWNAME;
            op.OPLX = "窗口业务";
            op.OPLX1 = row.YWLXMC;
            op.KEY1 = row.XH;
            op.OPERID = user.ID;
            op.OPERNAME = user.NAME;
            op.STARTTIME = DateTime.Now;
            op.OPSZT = "正在办理";
            op.MEMO1 = row.PDHM;
            op.ZT = "0";

            //解除等候超时报警
            try
            {
                WARNLOG wlog = (from p in db2.WARNLOG where p.WARNLX == "等待超时预警" && p.KEY1 == row.XH select p).First();
                wlog.ENDTIME = DateTime.Now;
                wlog.ZT = "1";
            }
            catch
            {

            }
            List<pdxx_jhqk> jhqk;
            pdxx_jhqk pj = new pdxx_jhqk();
            try
            {
                jhqk = JsonConvert.DeserializeObject<List<pdxx_jhqk>>(row.JHQK);
                pj.xh = jhqk.Count + 1;
            }
            catch
            {
                jhqk = new List<pdxx_jhqk>();
                pj.xh = 1;
            }
            pj.oplogid = op.ID;
            pj.ck = Convert.ToString(obj.ckmc);
            pj.operid = user.ID;
            pj.opername = user.NAME;
            pj.stime = (DateTime)row.STARTTIME;
            pj.szt = "正在办理";
            jhqk.Add(pj);
            row.JHQK = JsonConvert.SerializeObject(jhqk);
            row.OPLOGID = op.ID;

            op.KEY2 = pj.xh.ToString();
            db2.OPLOG.Add(op);

            db2.SaveChanges();

            ret["no"] = row.PDHM;
            ret["xh"] = row.XH;
            ret["opid"] = op.ID;
            ret["jhxh"] = pj.xh.ToString();
            ret["lshisnull"] = row.LSHISNULL;
            return ret;
        }
        [HttpPost]
        public async Task<Result> End(dynamic obj)
        {
            Result ret = new Result();
            ret.Msg = "0";
            string xh = Convert.ToString(obj.xh);
            string opid = Convert.ToString(obj.opid);
            int jhqkxh = Convert.ToInt16(obj.jhqkxh);
            string pdxxzt = Convert.ToString(obj.pdxxzt);
            string opzt = Convert.ToString(obj.opzt);
            string memo = Convert.ToString(obj.memo);
            int second = Convert.ToInt32(obj.second);
            string zzpz = Convert.ToString(obj.zzpz);

            PDXX pdxx = (from p in db2.PDXX where p.XH == xh select p).Single();
            pdxx.ENDTITIME = DateTime.Now;
            pdxx.SECOND = PubMethod.ConvertDateTimeInt(DateTime.Now)-PubMethod.ConvertDateTimeInt((DateTime)pdxx.STARTTIME);
            pdxx.YWLSH = memo;
            pdxx.ZT = pdxxzt;
            List<pdxx_jhqk> jhqk = JsonConvert.DeserializeObject<List<pdxx_jhqk>>(pdxx.JHQK);
            jhqk[jhqkxh - 1].etime = DateTime.Now;
            jhqk[jhqkxh - 1].second = second;
            jhqk[jhqkxh - 1].ezt = opzt;
            pdxx.JHQK = JsonConvert.SerializeObject(jhqk);

            OPLOG op = (from p in db2.OPLOG where p.ID == opid select p).Single();
            op.ENDTIME = DateTime.Now;
            op.SECOND = second;
            op.OPEZT = opzt;
            op.ZT = "1";

            if (pdxxzt == "办结")
            {
                //解除办理超时报警
                try
                {
                    WARNLOG wlog = (from p in db2.WARNLOG where p.WARNLX == "办理超时预警" && p.KEY1 == xh select p).First();
                    wlog.ENDTIME = DateTime.Now;
                    wlog.ZT = "1";
                }
                catch
                {

                }
            }
            db2.SaveChanges();

            if (pdxxzt == "办结")
            {
                Task taskA = new Task(() => AgentAndHmdTask(pdxx, op.OPERNAME, op.DWNO, op.DWMC));
                taskA.Start();
                Task taskB = new Task(() => userclass.warn.hmd.run(xh));
                taskB.Start();
 
                Task taskC = new Task(() => userclass.warn.ywlsh.run(xh));
                taskC.Start();
                if (zzpz == "是")
                {
                    Task taskD = new Task(() => PzzzTask(xh));
                    taskD.Start();
                }
            }
            else if (pdxxzt == "空号")
            {
                Task taskA = new Task(() => userclass.warn.DtywDefault.Kh(pdxx.JBRID));
                taskA.Start();
            }
            else if (pdxxzt == "退办")
            {
                Task taskA = new Task(() => userclass.warn.DtywDefault.Tb(pdxx.JBRID));
                taskA.Start();
            }
            ret.Msg = "1";
            foreach (var host in MvcApplication.SocketHosts.ToList())
            {
                host.socket.Send("DataUpdate");

            }
            return ret;
        }
        //牌证制作
        public void PzzzTask(string xh)
        {
            PDXX px = (from p in db2.PDXX where p.XH == xh select p).First();
            LICENSE lc = new LICENSE();
            lc.ID = PubMethod.maxid();
            lc.DWNO = px.DWNO;
            lc.DWMC = px.DWMC;
            lc.BLLX = px.BLLX;
            lc.PID = px.XH;
            lc.NAME = px.BRNAME;
            lc.ZJLX = px.BRZJLX;
            lc.ZJHM = px.BRZJHM;
            lc.DLRNAME = px.DLRNAME;
            lc.DLRZJLX = px.DLRZJLX;
            lc.DLRZJHM = px.DLRZJHM;
            lc.OPER = px.JBR;
            lc.OPTIME = px.ENDTITIME;
            lc.ZT = "0";
            px.ZZPZ = "是";
            px.PZID = lc.ID;
            db2.LICENSE.Add(lc);
            db2.SaveChanges();
      
            
        }
        public void AgentAndHmdTask(PDXX pdxx,string oper,string dwno,string dwmc)
        {
            if (pdxx.BLLX == "本人业务") return;
            AGENT ag = new AGENT();
            ag.ID = PubMethod.maxid();
            ag.DWNO = dwno;
            ag.DWMC = dwmc;
            ag.YWZL = "大厅业务";
            ag.PID = pdxx.XH;
            ag.YWLX = pdxx.YWLXMC;
            ag.BRNAME = pdxx.BRNAME;
            ag.BRZJLX = pdxx.BRZJLX;
            ag.BRZJHM = pdxx.BRZJHM;
            ag.DLRNAME = pdxx.DLRNAME;
            ag.DLRZJLX = pdxx.DLRZJLX;
            ag.DLRZJHM = pdxx.DLRZJHM;
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
        [HttpGet]
        public Result<string,string> NoCompleteTask()
        {
            Result<string, string> ret = new Result<string, string>();
            string Authorization = Request.Headers.Authorization.ToString();
            USERDB user = HttpRuntimeCache.Get(Authorization) as USERDB;

            ret.Msg = "0";
            ret.Data = new List<string>();
            try
            {
                OPLOG op = (from p in db2.OPLOG where p.OPERID == user.ID && p.OPLX == "窗口业务" && p.ZT == "0" select p).First();
                ret.Data.Add(op.MEMO1);
                ret.Data.Add(op.KEY1);
                ret.Data.Add(op.ID);
                ret.Data.Add(op.KEY2);
                ret.Data.Add((PubMethod.ConvertDateTimeInt(DateTime.Now) - PubMethod.ConvertDateTimeInt((DateTime)op.STARTTIME)).ToString());
                PDXX px = (from p in db2.PDXX where p.XH == op.KEY1 select p).First();
                ret.Data.Add(px.JHCS.ToString());
                ret.Data.Add(px.LSHISNULL);
                ret.Msg = "1";
            }
            catch
            {

            }
           
            return ret;
        }

        /// <summary>
        /// 获取最新叫号
        /// </summary>
        /// <param name="code"></param>
        /// <returns></returns>
        [HttpGet]
        public async Task<string> GetNewNo(string arrstr)
        {
            string Authorization = Request.Headers.Authorization.ToString();
            USERDB user = HttpRuntimeCache.Get(Authorization) as USERDB;
            string today = DateTime.Now.ToString("yyyy-MM-dd");
            string cachekey = "NewNo-" + user.DWNO + "-" + today;

            PdhmAndXh ret = new PdhmAndXh();
            Task taskA = new Task(() =>GetNewNoTask(user.DWNO,today));
            taskA.Start();
            string[] codes = arrstr.Split(',');
            if (HttpRuntimeCache.Exists(cachekey))
            {
                await Task.WhenAll(taskA);
                Dictionary<string, PdhmAndXh> dic = ((Dictionary<string, PdhmAndXh>) HttpRuntimeCache.Get(cachekey));
                foreach(string code in codes)
                {
                    if (dic.ContainsKey(code))
                    {
                        ret = dic[code];
                    }
                    else
                    {

                        await Task.WhenAll(taskA);
                        dic = ((Dictionary<string, PdhmAndXh>)HttpRuntimeCache.Get(cachekey));
                        ret = dic[code];
                    }
                    if (ret.pdhm != "无业务")
                    {
                        break;
                    }
                }

            }
            else
            {
                await Task.WhenAll(taskA);
                Dictionary<string, PdhmAndXh> dic = ((Dictionary<string, PdhmAndXh>)HttpRuntimeCache.Get(cachekey));
                PubMethod.wrlog(cachekey, JsonConvert.SerializeObject(dic));
                foreach (string code in codes)
                {
                    ret = dic[code];
                    if (ret.pdhm != "无业务")
                    {
                        break;
                    }
                }
                
            }
            return JsonConvert.SerializeObject(ret);
        }
        private class PdhmAndXh
        {
            public string pdhm { set; get; }
            public string xh { set; get; }
        }

        private void GetNewNoTask(string dwno,string today)
        {
            Dictionary<string, PdhmAndXh> dic = new Dictionary<string, PdhmAndXh>();
            IQueryable<CODEYWLX> rows = from p in db.CODEYWLX orderby p.CODE select p;
            foreach (CODEYWLX row in rows)
            {
                  try
                {
                    PDXX max = (from p in db2.PDXX where p.YWLXCODE == row.CODE&&p.ZT== "等待叫号"&&p.QHRQ==today&&p.DWNO==dwno orderby p.PDHM  select p).First();
                    PdhmAndXh o = new PdhmAndXh();
                    o.pdhm = max.PDHM;
                    o.xh = max.XH;
                    dic.Add(row.CODE, o);
                }
                catch
                {
                    PdhmAndXh o = new PdhmAndXh();
                    o.pdhm = "无业务";
                    o.xh = "无业务";
                    dic.Add(row.CODE,o);
                }
            }
            HttpRuntimeCache.Set("NewNo-" + dwno + "-" + today, dic);
        }
        [HttpGet]
        public Result<string,PDXX,CODE,CODE,CODE> PdjhJdcywGzs(string xh)
        {
            Result<string, PDXX, CODE, CODE, CODE> ret = new Result<string, PDXX, CODE, CODE, CODE>();
            ret.memo2= (from p in db2.PDXX where p.XH == xh select p).First();
            ret.Data = (from p in db.CODE where p.PTLB== "综合平台业务" && p.XTLB== "机动车" && p.LB== "业务类型" orderby p.CODE1 select p).ToList();
            ret.Data1 = (from p in db.CODE where p.LB== "号牌种类" orderby p.CODE1 select p).ToList();
            ret.Data2 = (from p in db.CODE where p.PTLB == "综合平台业务" && p.XTLB == "机动车" && p.LB == "业务告知书资料" orderby p.ID select p).ToList();
            return ret;
        }
        [HttpGet]
        public Result<string, PDXX, CODE, CODE, CODE> PdjhJszywGzs(string xh)
        {
            Result<string, PDXX, CODE, CODE, CODE> ret = new Result<string, PDXX, CODE, CODE, CODE>();
            ret.memo2 = (from p in db2.PDXX where p.XH == xh select p).First();
            ret.Data = (from p in db.CODE where p.PTLB == "综合平台业务" && p.XTLB == "驾驶人" && p.LB == "业务类型" orderby p.CODE1 select p).ToList();
            ret.Data1 = (from p in db.CODE where p.PTLB == "综合平台业务" && p.XTLB == "驾驶人" && p.LB == "业务告知书资料" orderby p.ID select p).ToList();
            return ret;
        }
        [HttpPost]
        public Result<NOTICE> NoticeAdd(dynamic obj)
        {
            string Authorization = Request.Headers.Authorization.ToString();
            USERDB user = HttpRuntimeCache.Get(Authorization) as USERDB;

            CONFIGBM conf = (from p in db.CONFIGBM where p.DWNO == user.DWNO && p.KEYWORD == "LXFS" select p).First();

            string today = DateTime.Now.ToString("yyyy-MM-dd");
            int count = (from p in db2.NOTICE where p.GZRQ == today select p).Count() + 1;

            Result<NOTICE> ret = new Result<NOTICE>();
            PDXX pdxx = JsonConvert.DeserializeObject<PDXX>(Convert.ToString(obj.pdxx));

            NOTICE nt = new NOTICE();
            nt.ID = PubMethod.maxid();
            nt.DWNO = user.DWNO;
            nt.DWMC = user.DWNAME;
            nt.BH = DateTime.Now.ToString("yyyyMMdd") + (count < 10 ? "00" + count.ToString() : "0" + count.ToString());
            nt.LB = Convert.ToString(obj.lb);
            nt.PID = pdxx.XH;
            nt.PDHM = pdxx.PDHM;
            nt.QHRQ = pdxx.QHRQ;
            nt.NAME = pdxx.BLLX == "本人业务" ? pdxx.BRNAME : pdxx.BRNAME + "/(代理人:" + pdxx.DLRNAME + ")";
            nt.SFZMHM = pdxx.BRZJHM;
            nt.DABH = nt.LB == "机动车驾驶证业务告知书" ? Convert.ToString(obj.dabh) : null;
            nt.ZJCX = nt.LB == "机动车驾驶证业务告知书" ? Convert.ToString(obj.zjcx) : null;
            nt.KEY1 = conf.V1;
            nt.KEY2 = conf.V2;
            nt.YWLXNO = Convert.ToString(obj.ywlxno);
            nt.YWLX = Convert.ToString(obj.ywlx);
            nt.HPZLNO = nt.LB == "机动车登记/业务告知书" ? Convert.ToString(obj.hpzlno) : null;
            nt.HPZL = nt.LB == "机动车登记/业务告知书" ? Convert.ToString(obj.hpzl) : null;
            nt.HPHM = nt.LB == "机动车登记/业务告知书" ? Convert.ToString(obj.hphm) : null;
            nt.CLSBHM = nt.LB == "机动车登记/业务告知书" ? Convert.ToString(obj.clsbhm) : null;
            nt.FILES = Convert.ToString(obj.files);
            nt.JBR = user.NAME;
            nt.GZRQ = today;
            nt.GZSJ = DateTime.Now;
            nt.TBLX = Convert.ToString(obj.tblx);
            db2.NOTICE.Add(nt);

            PDXX source = (from p in db2.PDXX where p.XH == pdxx.XH select p).First();
            source.GZSID = nt.ID;
            source.TBLX = Convert.ToString(obj.tblx);
            source.TBZL = nt.LB == "机动车登记/业务告知书" ? "机动车" : "驾驶证";

            db2.SaveChanges();
            ret.memo1 = nt;
            return ret;
        }
        [HttpPost]
        public void NoticeEdit(NOTICE obj)
        {
            PubMethod.wrlog("noticeid", JsonConvert.SerializeObject(obj));
            string id = obj.ID;
            obj.MEMO = "";
            NOTICE o = (from p in db2.NOTICE where p.ID == id select p).First();
            o.MEMO = "";
            var Types = o.GetType();//获得类型  
            object newv, oldv;
            Hashtable oplog = new Hashtable();
            foreach (PropertyInfo sp in Types.GetProperties())//获得类型的属性字段  
            {

                newv = sp.GetValue(obj, null);
                oldv = sp.GetValue(o, null);
                if (oldv != null && newv != null)
                {
                    if (!oldv.Equals(newv))
                    {
                        if(sp.Name!="FILES")  oplog[sp.Name] = oldv + "->" + newv;
                        sp.SetValue(o, newv, null);//获得s对象属性的值复制给d对象的属性  

                    }
                }
                else if (oldv != null || newv != null)
                {
                    if (sp.Name != "FILES") oplog[sp.Name] = oldv + "->" + newv;
                    sp.SetValue(o, newv, null);//获得s对象属性的值复制给d对象的属性  
                }

            }
            o.MEMO = JsonConvert.SerializeObject(oplog);
         
            db2.SaveChanges();
        }
        [HttpGet]
        public Hashtable GetNotice(string id)
        {
            Hashtable ret = new Hashtable();
            ret["memo1"] = (from p in db2.NOTICE where p.ID == id select p).First();
            ret["jdcywlx"] = (from p in db.CODE where p.PTLB == "综合平台业务" && p.XTLB == "机动车" && p.LB == "业务类型" orderby p.CODE1 select p).ToList();
            ret["jszywlx"] = (from p in db.CODE where p.PTLB == "综合平台业务" && p.XTLB == "驾驶人" && p.LB == "业务类型" orderby p.CODE1 select p).ToList();
            ret["hpzl"] = (from p in db.CODE where p.LB == "号牌种类" orderby p.CODE1 select p).ToList();
            return ret;
        }
        [HttpGet]
        public ResultToLay<NOTICE> QueryJdcywGzs(int page, int limit, string rq1, string rq2, string dwno, string sqr,string hpzlno,string hphm,string ywlxno,string tblx,string jbr)
        {

            ResultToLay<NOTICE> ret = new ResultToLay<NOTICE>();
            IQueryable<NOTICE> source = from p in db2.NOTICE
                                        where p.GZRQ.CompareTo(rq1) >= 0 && p.GZRQ.CompareTo(rq2) <= 0 && (dwno==null||p.DWNO == dwno)&&p.LB== "机动车登记/业务告知书"
                   && (p.NAME.Contains(sqr) || sqr == null) && (p.HPHM.Contains(hphm) || hphm == null)&&(tblx==null||p.TBLX==tblx)
                   && (p.HPZLNO == hpzlno || hpzlno == null) && (ywlxno == null || p.YWLXNO == ywlxno)&&(jbr==null||p.JBR.Contains(jbr))
                                        orderby p.ID descending
                                        select p;
            ret.code = 0;
            ret.count = source.Count();
            ret.data = source.Skip((page - 1) * limit).Take(limit).ToList();


            return ret;
        }
        [HttpGet]
        public ResultToLay<NOTICE> QueryJszywGzs(int page, int limit, string rq1, string rq2, string dwno, string sqr, string sfzhm, string ywlxno,string tblx, string jbr)
        {

            ResultToLay<NOTICE> ret = new ResultToLay<NOTICE>();
            IQueryable<NOTICE> source = from p in db2.NOTICE
                                        where p.GZRQ.CompareTo(rq1) >= 0 && p.GZRQ.CompareTo(rq2) <= 0 &&( p.DWNO == dwno||dwno==null)&&p.LB== "机动车驾驶证业务告知书"
                   && (p.NAME.Contains(sqr) || sqr == null) && (p.SFZMHM.Contains(sfzhm) || sfzhm == null) && (tblx == null || p.TBLX == tblx)
                    && (ywlxno == null || p.YWLXNO == ywlxno) && (jbr == null || p.JBR.Contains(jbr))
                                        orderby p.ID descending
                                        select p;
            ret.code = 0;
            ret.count = source.Count();
            ret.data = source.Skip((page - 1) * limit).Take(limit).ToList();


            return ret;
        }












        public string task1()
        {
            System.Threading.Thread.Sleep(3000);
            return "xlgslj1";
        }
        public string task2()
        {
            System.Threading.Thread.Sleep(2000);
            return "xlgslj2";
        }
        [HttpGet]
        public Result<BMDB> test()
        {
            task1();
            task2();
            Result<BMDB> ret = new Result<BMDB>();
            ret.Msg = "test";
            ret.memo1 = new BMDB();
            ret.memo1.NAME = "test";
            return ret;
        }
        [HttpGet]
        public async Task<Result<BMDB>> test1()
        {
            Task<string> taskA =new Task<string>(() => task1());
            taskA.Start();
            var taskB = Task.Run(() => { task2(); });
            await Task.WhenAll(taskA, taskB);
            Result<BMDB> ret = new Result<BMDB>();
            ret.Msg = taskA.Result;
            ret.memo1 = new BMDB();
            ret.memo1.NAME = "test1";
            return ret;
        }
        [HttpGet]
        public async Task<Result<BMDB>> test2()
        {
            var taskA = Task.Run(() => { task1(); });
            var taskB = Task.Run(() => { task2(); });
            await Task.WhenAll(taskA);
            Result<BMDB> ret = new Result<BMDB>();
            ret.Msg = "test2";
            ret.memo1 = new BMDB();
            ret.memo1.NAME = "test2";
            return ret;
        }
        [HttpGet]
        public async Task<Result<BMDB>> test3()
        {
            var taskA = Task.Run(() => { task1(); });
            var taskB = Task.Run(() => { task2(); });
            Result<BMDB> ret = new Result<BMDB>();
            ret.Msg = "test2";
            ret.memo1 = new BMDB();
            ret.memo1.NAME = "test2";
            return ret;
        }

        [HttpGet]
        public ResultToLay<string> test4()
        {
            ResultToLay<string> ret = new ResultToLay<string>();
            ret.code = 0;
            ret.count = 1;
            dynamic mo = new ExpandoObject();
            mo.name = "pzlj";
            mo.age = 1216;
            List<dynamic> objs = new List<dynamic>();
            objs.Add(mo); objs.Add(mo); objs.Add(mo); objs.Add(mo); objs.Add(mo); objs.Add(mo); objs.Add(mo);
            ret.data = new List<string>();
            ret.data.Add( JsonConvert.SerializeObject(objs));

            return ret;

        }
        [HttpGet]
        public Hashtable test5()
        {
            EntitiesXfyw db5 = new EntitiesXfyw();
            string[] xhs = new string[]{
                "0000002705","0000002703","0000002704"
                };
            Hashtable ret = new Hashtable();
                var k = from p in xhs
                        join p1 in db5.BUSINESSBASE
                        on p equals p1.ID into des
                        from p3 in des.DefaultIfEmpty()
                        select new
                        {
                           id=p,
                            p3


                        };
            ret["count"] = k.Count();
                ret["r1"] = JsonConvert.SerializeObject(k);
            return ret;
        }
    }
}
