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
using System.Web;
using System.IO;
using System.Threading.Tasks;
using System.Reflection;

namespace cgsjgpt.Controllers
{
    [CustomAuthAttribute(true)]
    [WebApiExceptionFilter]
    public class HmdglRyhmdController : ApiController
    {
        private static Entities sdb = new Entities();
        private static EntitiesHmd sdb3 = new EntitiesHmd();
        private  Entities db = new Entities();
        private  EntitiesHmd db3 = new EntitiesHmd();

        [HttpGet]
        public ResultToLay<AGENT> QueryAgent(int page, int limit, string rq1, string rq2, string dlrname, string dlrzjhm)
        {
            ResultToLay<AGENT> ret = new ResultToLay<AGENT>();
            IQueryable<AGENT> source = from p in db3.AGENT
                                       where p.ADDDAY.CompareTo(rq1) >= 0 && p.ADDDAY.CompareTo(rq2) <= 0
                                       && (dlrname == null || p.DLRNAME.Contains(dlrname)) && (dlrzjhm == null || p.DLRZJHM.Contains(dlrzjhm))
                                       orderby p.ID
                                       select p;
            ret.code = 0;
            ret.count = source.Count();
            ret.data = source.Skip((page - 1) * limit).Take(limit).ToList();
            return ret;
        }
        [HttpPost]
        public void DelAgent(dynamic obj)
        {
            string id = Convert.ToString(obj.id);
            AGENT ag = (from p in db3.AGENT where p.ID == id select p).First();
            db3.AGENT.Remove(ag);
            db3.SaveChanges();
        }
        [HttpGet]
        public Hashtable GetAgentsAndIsHmd(string sfzhm)
        {
            Hashtable ret = new Hashtable();
            ret["hmd"] = null;
            ret["Data"] = (from p in db3.AGENT where p.DLRZJHM == sfzhm select p).ToList();
            string zjhm1 = "";
            try
            {
                zjhm1 = sfzhm.Substring(0, 6) + sfzhm.Substring(8, 9);
            }
            catch
            {
                zjhm1 = sfzhm;
            }
            try
            {
                ret["hmd"] = (from p in db3.RBLIST where  (p.SFZHM == sfzhm || p.SFZHM == zjhm1) && p.ZT == "有效" select p).First();
            }
            catch
            {

            }
            return ret;
        }
        [HttpPost]
        public void AddAgent(dynamic obj)
        {
            string Authorization = Request.Headers.Authorization.ToString();
            USERDB user = HttpRuntimeCache.Get(Authorization) as USERDB;
            AGENT ag = new AGENT();
            ag.ID = PubMethod.maxid();
            ag.DWNO = user.DWNO;
            ag.DWMC = user.DWNAME;
            ag.PID = "no";
            ag.YWLX = Convert.ToString(obj.ywlx);
            ag.BRNAME = Convert.ToString(obj.brname);
            ag.BRZJLX = Convert.ToString(obj.zjlx);
            ag.BRZJHM = Convert.ToString(obj.brsfzhm);
            ag.DLRNAME = Convert.ToString(obj.dlrname);
            ag.DLRZJLX = "居民身份证";
            ag.DLRZJHM = Convert.ToString(obj.dlrsfzhm);
            ag.ADDLX = "人工加入";
            ag.ADDRY =user.NAME;
            ag.ADDDAY = DateTime.Now.ToString("yyyy-MM-dd");
            ag.ADDTIME = DateTime.Now;
            ag.ADDTIMESECONDS = PubMethod.ConvertDateTimeInt(DateTime.Now);
            ag.ZT = "0";
            db3.AGENT.Add(ag);
            db3.SaveChanges();
            AgentAddRblist(ag);
        }
        [HttpGet]
        public Hashtable GetPersonAgents(string zjhm)
        {
            Hashtable ret = new Hashtable();
            DateTime now = DateTime.Now;
            ret["data"] = (from p in db3.AGENT where p.DLRZJHM == zjhm&&p.ADDTIME.Value.Year==now.Year select p).Count();
            return ret;
        }
        [HttpPost]
        public void RBlistAdd(dynamic obj)
        {
            String dirImgPath = HttpContext.Current.Server.MapPath("/upfiles/images");
            String dirTempPath = HttpContext.Current.Server.MapPath("/upfiles/temp");
            string Authorization = Request.Headers.Authorization.ToString();
            USERDB user = HttpRuntimeCache.Get(Authorization) as USERDB;
            RBLIST rb = new RBLIST();
            rb.ID = PubMethod.maxid();
            rb.DWNO = user.DWNO;
            rb.DWMC = user.DWNAME;
            rb.LX = Convert.ToString(obj.mdlx);
            rb.DLFW = Convert.ToString(obj.dlfw);
            rb.NAME = Convert.ToString(obj.sqrname);
            rb.SFZHM = Convert.ToString(obj.sqrsfzmhm);
            rb.TEL = Convert.ToString(obj.tel);

            rb.DWNAME= Convert.ToString(obj.dwname);
            rb.ZZJGDM = Convert.ToString(obj.zzjgdm);

            rb.OPER =user.NAME;
            rb.OPERLX = "新增";
            rb.LRDAY = DateTime.Now.ToString("yyyy-MM-dd");
            rb.LRSJ = DateTime.Now;
            rb.LRSECOND = PubMethod.ConvertDateTimeInt(DateTime.Now);
            
            rb.ADDLX = "人工申请";
            rb.CAUSE = Convert.ToString(obj.content);
            rb.MEMO = Convert.ToString(obj.memo);
            rb.ZT = "待审核";

            string sqsurl = Convert.ToString(obj.sqs);
            string zzjgdmz = Convert.ToString(obj.zzjgdmz);
            string filename = sqsurl.Split(new char[] { '/' })[3];
            rb.IMG1=rb.LX== "黑名单" ? "":sqsurl.Replace("temp", "images");
            rb.IMG2= rb.LX == "黑名单" ? "" : zzjgdmz.Replace("temp", "images"); 
            db3.RBLIST.Add(rb);
            db3.SaveChanges();
            if (rb.LX == "红名单")
            {
                File.Move(dirTempPath + "/" + filename, dirImgPath + "/" + filename);
                filename = zzjgdmz.Split(new char[] { '/' })[3];
                File.Move(dirTempPath + "/" + filename, dirImgPath + "/" + filename);
            }
        }
        [HttpPost]
        public void RbEdit(RBLIST obj)
        {
            string Authorization = Request.Headers.Authorization.ToString();
            USERDB user = HttpRuntimeCache.Get(Authorization) as USERDB;
            string id = obj.ID;
            obj.OPLOG = "";
            RBLIST o = (from p in db3.RBLIST where p.ID == id select p).First();

            o.OPLOG="";
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

                        oplog[sp.Name] = oldv + "->" + newv;
                        sp.SetValue(o, newv, null);//获得s对象属性的值复制给d对象的属性  

                    }
                }
                else if (oldv != null || newv != null)
                {
                    oplog[sp.Name] = oldv + "->" + newv;
                    sp.SetValue(o, newv, null);//获得s对象属性的值复制给d对象的属性  
                }

            }

            o.IMG1 = o.LX == "黑名单" ? "" : (o.IMG1==null?"":o.IMG1.Replace("temp", "images"));
            o.IMG2 = o.LX == "黑名单" ? "" : (o.IMG2==null?"":o.IMG2.Replace("temp", "images"));
            o.OPLOG = JsonConvert.SerializeObject(oplog);
            o.OPER = user.NAME;
            o.LRDAY = DateTime.Now.ToString("yyyy-MM-dd");
            o.LRSJ = DateTime.Now;
            o.ZT = "待审核";
            db3.SaveChanges();
            if (o.LX == "红名单")
            {
                try
                {
                    string filename = o.IMG1.Split(new char[] { '/' })[3];
                    String dirImgPath = HttpContext.Current.Server.MapPath("/upfiles/images");
                    String dirTempPath = HttpContext.Current.Server.MapPath("/upfiles/temp");
                    File.Move(dirTempPath + "/" + filename, dirImgPath + "/" + filename);
                    filename = o.IMG2.Split(new char[] { '/' })[3];
                    File.Move(dirTempPath + "/" + filename, dirImgPath + "/" + filename);
                }
                catch
                {

                }
            }
        }
        [HttpPost]
        public void RbSp(dynamic obj)
        {
            string Authorization = Request.Headers.Authorization.ToString();
            USERDB user = HttpRuntimeCache.Get(Authorization) as USERDB;
            int years = int.Parse((from p in MvcApplication.SysConfigs where p.LX == "系统" && p.KEYWORD == "ZDJRHMDQX" select p).First().V1);
            string id = Convert.ToString(obj.id);
            RBLIST rb = (from p in db3.RBLIST where p.ID == id select p).First();
            string zt = Convert.ToString(obj.zt);
            string oplx = rb.OPERLX;
            if (zt == "有效" && oplx == "删除")
            {  
                if(rb.LX == "黑名单")
                {
                    DateTime now = DateTime.Now;
                    List<AGENT> ags = (from p in db3.AGENT where p.DLRZJHM == rb.SFZHM && p.ADDTIME.Value.Year == now.Year select p).ToList();
                    foreach(AGENT ag in ags)
                    {
                        db3.AGENT.Remove(ag);
                    }
                }

                db3.RBLIST.Remove(rb);
            }
            else
            {
                rb.SPER = user.NAME;
                rb.SPDAY = DateTime.Now.ToString("yyyy-MM-dd");
                rb.SPSJ = DateTime.Now;
                rb.SPSECOND = PubMethod.ConvertDateTimeInt(DateTime.Now);
                DateTime jssj = DateTime.Now.AddYears(years);
                rb.JSDAY = jssj.ToString("yyyy-MM-dd");
                rb.JSSJ = jssj;
                rb.JSSECOND = PubMethod.ConvertDateTimeInt(jssj);
                rb.ZT = zt;
            }
            db3.SaveChanges();
        }

        //private static IQueryable<CONFIGBM> conf = from p in sdb.CONFIGBM select p;
        public static void AgentAddRblist(AGENT ag)
        {
            DateTime day = DateTime.Now;
            int dbcs = int.Parse((from p in MvcApplication.SysConfigs where p.LX == "系统" && p.KEYWORD == "JRHMDDBCSXZ" select p).First().V1);
            int years = int.Parse((from p in MvcApplication.SysConfigs where p.LX == "系统" && p.KEYWORD == "ZDJRHMDQX" select p).First().V1);
            int count = (from p in sdb3.AGENT where  p.DLRZJHM == ag.DLRZJHM&&p.ADDTIME.Value.Year==day.Year select p).Count();
           
            if (count >= dbcs)
            {
                try
                {
                    using (EntitiesHmd db4 = new EntitiesHmd())
                    {
                        RBLIST rb = new RBLIST();
                        rb.ID = PubMethod.maxid();
                        rb.DWNO = ag.DWNO;
                        rb.DWMC = ag.DWMC;
                        rb.LX = "黑名单";
                        rb.NAME = ag.DLRNAME;
                        rb.SFZHM = ag.DLRZJHM;
                        rb.OPER = "系统";
                        rb.LRDAY = DateTime.Now.ToString("yyyy-MM-dd");
                        rb.LRSJ = DateTime.Now;
                        rb.LRSECOND = PubMethod.ConvertDateTimeInt(DateTime.Now);
                        rb.SPER = "系统";
                        rb.SPDAY = DateTime.Now.ToString("yyyy-MM-dd");
                        rb.SPSJ = DateTime.Now;
                        rb.SPSECOND = PubMethod.ConvertDateTimeInt(DateTime.Now);
                        DateTime jssj = DateTime.Now.AddYears(years);
                        rb.JSDAY = jssj.ToString("yyyy-MM-dd");
                        rb.JSSJ = jssj;
                        rb.JSSECOND = PubMethod.ConvertDateTimeInt(jssj);
                        rb.ADDLX = "自动加入";
                        rb.CAUSE = "代办次数超出限制次数（" + dbcs.ToString() + "）";
                        rb.MEMO = "代办次数超出限制次数（" + dbcs.ToString() + "）";
                        rb.ZT = "有效";
                        db4.RBLIST.Add(rb);
                        db4.SaveChanges();
                    }
                   
                }
                catch(Exception e)
                {

                    try
                    {
                        using (EntitiesHmd db4 = new EntitiesHmd())
                        {
                            RBLIST rb1 = (from p in db4.RBLIST where p.SFZHM == ag.DLRZJHM select p).First();
                            rb1.ZT =rb1.LX=="黑名单"? "有效":rb1.ZT;//红名单不管，黑明单改状态为有效
                            db4.SaveChanges();
                        }
                    }
                    catch(Exception e1)
                    {
                        PubMethod.wrlog("e1", e1.InnerException.InnerException.Message);
                    }
                }
            }

            //代办预警检测
            Task taskB = new Task(() => userclass.warn.hmd.MaxAgentCountYj(ag.ID));
            taskB.Start();
        }
        [HttpGet]
        public Result<RBLIST> GetSingleRb(string id)
        {
            Result<RBLIST> ret = new Result<RBLIST>();
            ret.memo1 = (from p in db3.RBLIST where p.ID == id select p).First();
            return ret;
        }
        [HttpGet]
        public ResultToLay<RBLIST> QueryRBlist(int page, int limit, string rq1, string rq2, string name, string sfzhm, string sper, string lx)
        {
            string Authorization = Request.Headers.Authorization.ToString();
            USERDB user = HttpRuntimeCache.Get(Authorization) as USERDB;
            ResultToLay<RBLIST> ret = new ResultToLay<RBLIST>();
            IQueryable<RBLIST> source = from p in db3.RBLIST
                                        where p.DWNO==user.DWNO&& p.LRDAY.CompareTo(rq1) >= 0 && p.LRDAY.CompareTo(rq2) <= 0
                                        && (name == null || p.NAME.Contains(name)) && (sfzhm == null || p.SFZHM.Contains(sfzhm))
                                        && (sper == null || p.SPER.Contains(sper)) && (lx == null || p.LX.Contains(lx))
                                        orderby p.ID
                                        select p;
            ret.code = 0;
            ret.count = source.Count();
            ret.data = source.Skip((page - 1) * limit).Take(limit).ToList();
            return ret;
        }
        [HttpGet]
        public ResultToLay<RBLIST> QueryDshRBlist(int page, int limit)
        {
            string Authorization = Request.Headers.Authorization.ToString();
            USERDB user = HttpRuntimeCache.Get(Authorization) as USERDB;
            ResultToLay<RBLIST> ret = new ResultToLay<RBLIST>();
            IQueryable<RBLIST> source = from p in db3.RBLIST
                                        where p.DWNO == user.DWNO && p.ZT== "待审核"
                                        orderby p.ID
                                        select p;
            ret.code = 0;
            ret.count = source.Count();
            ret.data = source.Skip((page - 1) * limit).Take(limit).ToList();
            return ret;
        }

    }

}
