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
using System.Threading.Tasks;
using System.Dynamic;
using Newtonsoft.Json;
using System.Xml;

namespace cgsjgpt.Controllers
{
    [CustomAuthAttribute(true)]
    [WebApiExceptionFilter]
    public class HmdglYwcxController : ApiController
    {
        private EntitiesHmd db4 = new EntitiesHmd();
        private EntitiesTrff db3 = new EntitiesTrff();
        [HttpGet]
        public async Task<Result<string,RBLIST>> QueryTrffAndHmd(string lx,string sfzhm,string hpzl,string hphm,string ip)
        {
            DateTime start = DateTime.Now;
            string Authorization = Request.Headers.Authorization.ToString();
            USERDB user = HttpRuntimeCache.Get(Authorization) as USERDB;
            Result<string, RBLIST> ret = new Result<string, RBLIST>();
            string xmlstr = string.Empty;
            try
            {

                Dictionary<string, string> openWith = new Dictionary<string, string>();
                string mehod = string.Empty;
                if (lx == "驾驶人信息")
                {
                    openWith.Add("sfzhm", sfzhm);
                    mehod = "getDriver";
                    
                    ret.Data = (from p in db4.RBLIST where p.DWNO == user.DWNO && p.SFZHM == sfzhm&&p.ZT== "有效" select p).ToList();
                }
                else
                {
                    openWith.Add("hpzl", hpzl);
                    openWith.Add("hphm", hphm);
                    mehod = "jdcxx_all";

                }
                xmlstr = HttpHelper.HttpPostWebService("http://10.68.173.25/Service.asmx", mehod, openWith);
                ret.memo1 = "nodata";
                xmlstr = xmlstr.Replace("&lt;", "<").Replace("&gt;", ">");
                XmlDocument doc = new XmlDocument();
                doc.LoadXml(xmlstr);
                XmlNode node = doc.SelectSingleNode("root");
                ret.memo1 = node == null ? "nodata" : JsonConvert.SerializeXmlNode(node);
                Task taskA = new Task(() => WriteTrffLog(start, lx, sfzhm, hpzl, hphm, ip, user.NAME, ret.memo1, "成功"));
                taskA.Start();

            }
            catch(Exception e)
            {
                WriteTrffLog(start, lx, sfzhm, hpzl, hphm, ip, user.NAME,xmlstr, "<font color=red>失败</font>");
            }
            return ret;
        }
        
        private void WriteTrffLog(DateTime start, string lx, string sfzhm, string hpzl, string hphm, string ip,string oper,string ret,string zt)
        {
            TRFFLOG log = new TRFFLOG();
            log.ID = PubMethod.maxid();
            log.LX = lx;
            log.IP = ip;
            log.OPER = oper;
            log.OPDAY = DateTime.Now.ToString("yyyy-MM-dd");
            log.OPSJ = DateTime.Now;
            log.OPSECOND = PubMethod.ConvertDateTimeInt(DateTime.Now);
            dynamic keys = new ExpandoObject();
            if (lx == "机动车信息")
            {
                keys.号牌种类 = hpzl;
                keys.号牌号码 = hphm;
            }
            else
            {
                keys.身份证号码 = sfzhm;
            }
            log.KEYS = JsonConvert.SerializeObject(keys);
            log.RETS = ret;
            log.SECOND =(decimal? )(DateTime.Now-start).TotalSeconds;
            log.ZT =zt;
            db4.TRFFLOG.Add(log);
            db4.SaveChanges();
        }
        [HttpGet]
        public ResultToLay<TRFFLOG> QueryTrffLog(int page, int limit, string rq1, string rq2, string oper, string keys,string zt)
        {
            ResultToLay<TRFFLOG> ret = new ResultToLay<TRFFLOG>();
            IQueryable<TRFFLOG> source = from p in db4.TRFFLOG
                                       where p.OPDAY.CompareTo(rq1) >= 0 && p.OPDAY.CompareTo(rq2) <= 0
                                       && (oper == null || p.OPER.Contains(oper)) && (keys == null || p.KEYS.Contains(keys)) && (zt == null || p.ZT.Contains(zt))
                                         orderby p.ID descending
                                       select p;
            ret.code = 0;
            ret.count = source.Count();
            ret.data = source.Skip((page - 1) * limit).Take(limit).ToList();
            return ret;
        }
    }
}
