using cgsjgpt.Controllers.Filters;
using cgsjgpt.Models;
using cgsjgpt.userclass.data;
using cgsjgpt.userclass.method;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using Newtonsoft.Json;
using System.Web;
using System.Collections;

namespace cgsjgpt.Controllers
{
    [CustomAuthAttribute(true)]
    [WebApiExceptionFilter]
    public class SysCsCksetController : ApiController
    {
        private Entities db = new Entities();
        private EntitiesDtgl db2 = new EntitiesDtgl();
        /// <summary>
        /// 获取排队信息,为排队信息查询用
        /// </summary>
        /// <param name="page"></param>
        /// <param name="limit"></param>
        /// <param name="first"></param>
        /// <returns></returns>
        [HttpGet]
        public ResultToLay<CKSET> GetCkSet(int page, int limit, Boolean first, string ckmc, string bmmc)
        {
            ResultToLay<CKSET> ret = new ResultToLay<CKSET>();
            if (!first)
            {
                IQueryable<CKSET> rows = from p in db.CKSET orderby p.ID select p;
                if (ckmc != null)
                {
                    rows = from p in rows where p.CKMC.Contains(ckmc) select p;
                }
                if (bmmc != null)
                {
                    rows = from p in rows where p.BMMC.Contains(bmmc) select p;
                }
                ret.code = 0;
                ret.count = rows.Count();
                ret.data = rows.Skip((page - 1) * limit).Take(limit).ToList();
            }
            else
            {
                ret.code = 0;
                ret.count = 0;
                ret.data = new List<CKSET>();
            }
            return ret;
        }
        [HttpPost]
        public void CkAdd(dynamic obj)
        {
            CKSET row = new CKSET();
            row.ID = PubMethod.maxid();
            row.BMNO = Convert.ToString(obj.bmno);
            row.BMMC = Convert.ToString(obj.bmmc);
            row.CKMC = Convert.ToString(obj.ckmc);
            row.IP = Convert.ToString(obj.ip);
            row.KZKDZ = Convert.ToString(obj.kzkdz);
            row.WDBH = Convert.ToString(obj.wdbh);
            row.ZCCKH = Convert.ToString(obj.zcckh);
            row.PJCOM = Convert.ToString(obj.pjcom);
            row.YWLXS = Convert.ToString(obj.yxywlxs);
            row.CZRY = Convert.ToString(obj.czry);
            db.CKSET.Add(row);
            db.SaveChanges();
        }
        [HttpGet]
        public Hashtable GetCk(string id)
        {
            Hashtable ret = new Hashtable();
            ret["ckset"] = (from p in db.CKSET where p.ID == id select p).First();
            ret["ywlxs"] = (from p in db.CODEYWLX orderby p.CODE select p).ToList();
            return ret;
        }
        [HttpPost]
        public void CkEdit(dynamic obj)
        {
            string id = Convert.ToString(obj.id);
            CKSET row = (from p in db.CKSET where p.ID == id select p).First();
            row.BMNO = Convert.ToString(obj.bmno);
            row.BMMC = Convert.ToString(obj.bmmc);
            row.CKMC = Convert.ToString(obj.ckmc);
            row.IP = Convert.ToString(obj.ip);
            row.KZKDZ = Convert.ToString(obj.kzkdz);
            row.WDBH = Convert.ToString(obj.wdbh);
            row.ZCCKH = Convert.ToString(obj.zcckh);
            row.PJCOM = Convert.ToString(obj.pjcom);
            row.YWLXS = Convert.ToString(obj.yxywlxs);
            row.CZRY = Convert.ToString(obj.czry);
            db.SaveChanges();
        }
        [HttpGet]
        public async Task<Result<CKSET, ResultToEchart>> IsCk1(string ip)
        {
            Result<CKSET, ResultToEchart> ret = new Result<CKSET, ResultToEchart>();
            ret.Msg = "0";
            DtglYwblController obj = new DtglYwblController();
            Task<ResultToEchart> taskA = new Task<ResultToEchart>(()=>(obj.GetPdInfo().Result));
            taskA.Start();

            try
            {
               
                ret.memo1 = (from p in db.CKSET where p.IP == ip select p).Single();
                ret.Data = new List<ResultToEchart>();
                await Task.WhenAll(taskA);
                ret.Data = new List<ResultToEchart>();
                ret.Data.Add(taskA.Result);
                ret.Msg = "1";
            }
            catch
            {

            }
            return ret;
        }
        [HttpGet]
        public Result<CKSET, ResultToEchart> IsCk(string ip)
        {
            string Authorization = Request.Headers.Authorization.ToString();
            Dictionary<string, string> headers = new Dictionary<string, string>();
            headers.Add("Authorization", Authorization);
            Result<CKSET, ResultToEchart> ret = new Result<CKSET, ResultToEchart>();
            ret.Msg = "0";
            ret.Data = new List<ResultToEchart>();
            string str1 = HttpHelper.HttpGet("http://127.0.0.1/api/DtglYwbl/GetPdInfo",null,headers);
            ret.Data.Add(JsonConvert.DeserializeObject<ResultToEchart>(str1));
            try
            {

                ret.memo1 = (from p in db.CKSET where p.IP == ip select p).Single();
                List<CkYwlx> ywlxs = JsonConvert.DeserializeObject<List<CkYwlx>>(ret.memo1.YWLXS);
                List<CkYwlx> ywlxs1 = (from p in ywlxs orderby p.sort select p).ToList();
                List<string> parm = new List<string>();
                foreach (CkYwlx row in ywlxs1)
                {
                    parm.Add(row.CODE);

                }
                if (parm.Count == 0)
                {
                    ret.Msg = "未分配业务";
                }
                else
                {
                   // PubMethod.wrlog("attr", string.Join(",", parm));
                    string newno= HttpHelper.HttpGet("http://127.0.0.1/api/DtglYwbl/GetNewNo?arrstr=" + string.Join(",", parm), null, headers);
                    ret.Msg =JsonConvert.DeserializeObject<string>( newno);
                }


                /* ret.Msg = "1";*/
            }
            catch
            {

            }
            return ret;
        }
        [HttpGet]
        public Result<CKSET, ResultToEchart> IsCkToIe(string ip)
        {
            string Authorization = Request.Headers.Authorization.ToString();
            Dictionary<string, string> headers = new Dictionary<string, string>();
            headers.Add("Authorization", Authorization);
            Result<CKSET, ResultToEchart> ret = new Result<CKSET, ResultToEchart>();
            ret.Msg = "0";
            ret.Data = new List<ResultToEchart>();
            string str1 = HttpHelper.HttpGet("http://127.0.0.1/api/DtglYwbl/GetPdInfo", null, headers);
            ret.Data.Add(JsonConvert.DeserializeObject<ResultToEchart>(str1));
            // ip = ((System.Web.HttpContextWrapper)Request.Properties["MS_HttpContext"]).Request.UserHostAddress;
            ip = GetIPAddress();
            PubMethod.wrlog("ip", ip);
            try
            {

                ret.memo1 = (from p in db.CKSET where p.IP == ip select p).Single();
                List<CkYwlx> ywlxs = JsonConvert.DeserializeObject<List<CkYwlx>>(ret.memo1.YWLXS);
                List<CkYwlx> ywlxs1 = (from p in ywlxs orderby p.sort select p).ToList();
                List<string> parm = new List<string>();
                foreach (CkYwlx row in ywlxs1)
                {
                    parm.Add(row.CODE);

                }
                if (parm.Count == 0)
                {
                    ret.Msg = "未分配业务";
                }
                else
                {
                    string newno = HttpHelper.HttpGet("http://127.0.0.1/api/DtglYwbl/GetNewNo?arrstr=" + string.Join(",", parm), null, headers);
                    ret.Msg = JsonConvert.DeserializeObject<string>(newno);
                }
            }
            catch
            {

            }
            return ret;
        }


        public string GetIPAddress()
        {

            string user_IP = string.Empty;
            if (System.Web.HttpContext.Current.Request.ServerVariables["HTTP_VIA"] != null)
            {
                if (System.Web.HttpContext.Current.Request.ServerVariables["HTTP_X_FORWARDED_FOR"] != null)
                {
                    user_IP = System.Web.HttpContext.Current.Request.ServerVariables["HTTP_X_FORWARDED_FOR"].ToString();
                }
                else
                {
                    user_IP = System.Web.HttpContext.Current.Request.UserHostAddress;
                }
            }
            else
            {
                user_IP = System.Web.HttpContext.Current.Request.ServerVariables["REMOTE_ADDR"].ToString();
            }
            return user_IP;
        }


        [HttpGet]
        public string test()
        {
            // return HttpHelper.HttpGet("http://127.0.0.1/api/DtglYwbl/GetNewNo?arrstr=A,B");
            return HttpHelper.HttpGet("http://127.0.0.1/api/DtglYwbl/GetPdInfo");
        }

    }
}
