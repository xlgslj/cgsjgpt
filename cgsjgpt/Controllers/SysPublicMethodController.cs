using cgsjgpt.Controllers.Filters;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Newtonsoft.Json;
using cgsjgpt.Models;
using cgsjgpt.userclass.data;
using cgsjgpt.userclass.method;
using System.Dynamic;
using System.Threading.Tasks;
using System.Xml;
using Newtonsoft.Json;
using System.Threading;
using System.Data.Entity;
using System.Collections;

namespace cgsjgpt.Controllers
{
    [CustomAuthAttribute(false)]
    [WebApiExceptionFilter]
    public class SysPublicMethodController : ApiController
    {
        private Entities db = new Entities();
        private EntitiesDtgl db2 = new EntitiesDtgl();
        private EntitiesHmd db4 = new EntitiesHmd();
        private EntitiesXfyw db3 = new EntitiesXfyw();

        [HttpGet]
        public Result<string, string, CODE, CODE, CODE, CODE> GetCode(string lb)
        {
            Result<string, string, CODE, CODE, CODE, CODE> ret = new Result<string, string, CODE, CODE, CODE, CODE>();
            List<string> lbs = JsonConvert.DeserializeObject<List<string>>(lb);
            int i = 0;
            foreach (string lx in lbs)
            {
                string[] fields = lx.Split(new char[] { '@' });
                string ptlb = fields[0];
                string xtlb = fields[1];
                string lb1 = fields[2];
                List<CODE> code = (from p in db.CODE where (ptlb == "ALL"||p.PTLB== ptlb) &&(xtlb == "ALL"||p.XTLB== xtlb) &&(lb1 == "ALL"||p.LB== lb1) select p).ToList();
                switch (i)
                {
                    case 0:
                        ret.Data = code;
                        break;
                    case 1:
                        ret.Data1 = code;
                        break;
                    case 2:
                        ret.Data2 = code;
                        break;
                    case 3:
                        ret.Data3 = code;
                        break;
                }
                i++;
            }
            return ret;
        }

        [HttpGet]
        public Result<DRIVINGLICENSE> QueryDriver(string sfzhm)
        {
            Result<DRIVINGLICENSE> ret = new Result<DRIVINGLICENSE>();
            using (EntitiesTrff db3 = new EntitiesTrff())
            {
                try
                {
                    ret.memo1 = (from p in db3.DRIVINGLICENSE where p.SFZMHM == sfzhm select p).First();
                }
                catch
                {

                }
            }
            return ret;
        }
        [HttpGet]
        public Result<VEHICLE> QueryVehicle(string hpzl, string hphm)
        {
            string hphm1 = hphm.Substring(1, hphm.Length - 1);
            Result<VEHICLE> ret = new Result<VEHICLE>();
            using (EntitiesTrff db3 = new EntitiesTrff())
            {
                try
                {
                    ret.memo1 = (from p in db3.VEHICLE where p.HPZL == hpzl && p.HPHM == hphm1 select p).First();
                }
                catch
                {

                }
            }
            return ret;
        }
        [HttpGet]
        public Hashtable QueryVehicleAndDriver(string zjhm,string zjlx)
        {
            Hashtable ret = new Hashtable();
            /*DRIVINGLICENSE drv = new DRIVINGLICENSE();
            List<veh> vehs = new List<veh>();
            string zjhm1="";
            if (zjlx == "居民身份证")
            {
                try
                {
                    zjhm1 = zjhm.Substring(0, 6) + zjhm.Substring(8, 9);
                }
                catch
                {
                    zjhm1 = zjhm;
                }
            }
            else if (zjlx == "组织机构代码证书")
            {
                try
                {
                    zjhm1 = zjhm.Substring(8, 8) + "-" + zjhm.Substring(16, zjhm.Length - 16 - 1);
                }
                catch
                {
                    zjhm1 = zjhm;
                }
            }
            using (EntitiesTrff db3 = new EntitiesTrff())
            {
                try
                {
                    drv = db3.Database.SqlQuery<DRIVINGLICENSE>("select * from DRIVINGLICENSE  where sfzmhm='" + zjhm + "' or sfzmhm='" + zjhm1 + "'").First();
                }
                catch(Exception e)
                {
                    PubMethod.wrlog("ee", e.Message);
                }
                try
                {
                    vehs = db3.Database.SqlQuery<veh>("select  hphm,hpzl,yxqz,zt from vehicle where instr(zt,'C')='0' and instr(zt,'E')='0'" +
    " and (instr(zt,'G')>0 or instr(zt,'Q')>0 or instr(zt,'P')>0 or instr(zt,'P')>0 or instr(zt,'M')>0 or instr(zt,'O')>0  ) and " +
    " (sfzmhm='" + zjhm + "' or sfzmhm='" + zjhm1 + "')").ToList();
                }
                catch(Exception e)
                {
                    PubMethod.wrlog("ee2", e.Message);
                }
                ret["drv"] = drv;
                ret["vehs"] = vehs;

            }*/
            if (zjlx == "居民身份证")
            {
                ret["drv"] = GetDriverFromWebservice(zjhm, zjlx);
            }
            else
            {
                ret["drv"] = null;
            }
            ret["vehs"] = GetVehFromWebservice(zjhm, zjlx);
            if (ret["drv"] != null)
            {
                drv d = ret["drv"] as drv;
                ret["key1"] = d.XM;
            }
            else
            {
                string xm = "";
                string oldhm = GetOldHm(zjhm, zjlx);
                using (EntitiesTrff db3 = new EntitiesTrff())
                {
                    List<veh> vs = db3.Database.SqlQuery<veh>("select hphm,hpzl,sfzmhm,clsbdh,sfzmhm,syxz,syr,yxqz,zt from vehicle where"
                         + " (sfzmhm='" + zjhm + "' or sfzmhm='" + oldhm + "')").ToList();
                    foreach(veh v in vs)
                    {
                        xm = v.SYR;
                        break;
                    }

                }
                ret["key1"] = xm;
            }
            return ret;
        }
        public class pdx
        {
            public string DWNO { get; set; }
            public string BLLX { get; set; }
            public string BRZJHM { get; set; }
            public string BRNAME { get; set; }
            public string DLRZJHM { get; set; }
            public string DLRNAME { get; set; }

        }

        [HttpGet]
        public PDXX QueryVehicleAndDriverForPdjh(string xh)
        {
            //PubMethod.wrlog("QueryVehicleAndDriverForPdjh", "start");
            RDV ret = new RDV();
            PDXX px = (from p in db2.PDXX where p.XH == xh select p).First();
            string brzjhm = px.BRZJHM;
            string dlrzjhm = px.DLRZJHM;
            string brzjhm1 = GetOldHm(px.BRZJHM, px.BRZJLX);
            string dlrzjhm1 = GetOldHm(px.DLRZJHM, px.DLRZJLX);

            if (px.QUERYZT == "待查")
            {

                using (EntitiesTrff db3 = new EntitiesTrff())
                {

                    //db3.Database.Log=message=>PubMethod.wrlog("sql", Thread.CurrentThread.ManagedThreadId+"-"+ DateTime.Now.ToString("yyyy/MM/dd HH:mm:ss.fff")+"-"+message.Trim());
                    bool brishmd = false;
                    bool dlrishmd = false;
                    ret.driver1 = GetDriverFromWebservice(px.BRZJHM, px.BRZJLX);
                    ret.vehicles1=GetVehFromWebservice(px.BRZJHM, px.BRZJLX);
                    try
                    {
                        ret.rblist1= (from p in db4.RBLIST where (p.SFZHM == brzjhm || p.SFZHM == brzjhm1) && p.ZT == "有效" select p).First();

                    }
                    catch {
                        ret.rblist1 = new RBLIST();
                        ret.rblist1.LX = "";
                    }

                    string[] anyof = { "暂扣", "违法未处理", "逾期未换证", "逾期未检验","扣留","注销可恢复","扣押", "锁定" };// { 'D', 'H','M','S','U','R','K','L' };
                    Boolean jsrzt = false;
                    if (ret.driver1 != null)
                    {
                        foreach (string zt in anyof)
                        {
                            if (ret.driver1.ZT.IndexOf(zt) >= 0)
                            {
                                jsrzt = true;
                            }
                        }
                    }
                    ret.rblist1.LX = ret.rblist1.LX+(jsrzt ?  "/驾驶人异常":"");
                    ret.rblist1.LX = ret.rblist1.LX +( ret.vehicles1.Count==0 ?"" : "/所属车辆异常");
                    if (ret.rblist1.LX != "")
                    {
                        ret.rblist1.ZT = "异常";
                        brishmd = true;
                    }
                    if (px.BLLX == "代理人业务")
                    {
                        try
                        {
                            ret.rblist2 = (from p in db4.RBLIST where ( p.SFZHM == dlrzjhm||p.SFZHM==dlrzjhm1) && p.ZT == "有效" select p).First();
                            dlrishmd = true;
                        }
                        catch { }

                    }
                    px.ISHMD = brishmd && dlrishmd ? "11" : (brishmd ? "10" : (dlrishmd ? "01" : "00"));
                    px.DRVANDVEHINFO = JsonConvert.SerializeObject(ret);
                    px.QUERYZT = "完毕";
                    db2.SaveChanges();
                }
            }
            //PubMethod.wrlog("QueryVehicleAndDriverForPdjh", "end");
            return px;
        }
        [HttpGet]
        public void QueryVehicleAndDriverForXfyw(string id)
        {

            RDV ret = new RDV();
            BUSINESS_FLOW bf = (from p in db3.BUSINESS_FLOW where p.ID == id select p).First();
            string brzjhm = bf.BRZJHM;
            string dlrzjhm = bf.DLRZJHM;
            string brzjhm1 = GetOldHm(bf.BRZJHM, bf.BRZJLX);
            string dlrzjhm1 = GetOldHm(bf.DLRZJHM, bf.DLRZJLX);
            if (bf.QUERYZT == "待查")
            {
                bool brishmd = false;
                bool dlrishmd = false;
                ret.driver1 = GetDriverFromWebservice(bf.BRZJHM, bf.BRZJLX);
                ret.vehicles1 = GetVehFromWebservice(bf.BRZJHM, bf.BRZJLX);
                try
                {
                    ret.rblist1 = (from p in db4.RBLIST where (p.SFZHM == brzjhm || p.SFZHM == brzjhm1) && p.ZT == "有效" select p).First();

                }
                catch
                {
                    ret.rblist1 = new RBLIST();
                    ret.rblist1.LX = "";
                }

                string[] anyof = { "暂扣", "违法未处理", "逾期未换证", "逾期未检验", "扣留", "注销可恢复", "扣押", "锁定" };// { 'D', 'H','M','S','U','R','K','L' };
                Boolean jsrzt = false;
                if (ret.driver1 != null)
                {
                    foreach (string zt in anyof)
                    {
                        if (ret.driver1.ZT.IndexOf(zt) >= 0)
                        {
                            jsrzt = true;
                        }
                    }
                }
                ret.rblist1.LX = ret.rblist1.LX + (jsrzt ? "/驾驶人异常" : "");
                ret.rblist1.LX = ret.rblist1.LX + (ret.vehicles1.Count == 0 ? "" : "/所属车辆异常");
                if (ret.rblist1.LX != "")
                {
                    ret.rblist1.ZT = "异常";
                    brishmd = true;
                }
                if (bf.BLMS == "代理个人业务" || bf.BLMS == "代理单位业务")
                {
                    try
                    {
                        ret.rblist2 = (from p in db4.RBLIST where (p.SFZHM == dlrzjhm || p.SFZHM == dlrzjhm1) && p.ZT == "有效" select p).First();
                        dlrishmd = true;
                    }
                    catch { }

                }
                bf.ISHMD = brishmd && dlrishmd ? "11" : (brishmd ? "10" : (dlrishmd ? "01" : "00"));
                bf.DRVANDVEHINFO = JsonConvert.SerializeObject(ret);
                bf.QUERYZT = "完毕";
                db3.SaveChanges();

                //黑名单预警
                Task taskA = new Task(() => cgsjgpt.userclass.warn.hmd.run2(id));
                taskA.Start();
            }

        }
        [HttpGet]
        public Hashtable QueryVehicleAndDriverForXfywHmd(string brzjlx, string brzjhm, string dlrzjlx, string dlrzjhm, string blms)
        {
            Hashtable res = new Hashtable();
            RDV ret = new RDV();
            string brzjhm1 = GetOldHm(brzjhm, brzjlx);
            string dlrzjhm1 = GetOldHm(dlrzjhm, dlrzjlx);


            bool brishmd = false;
            bool dlrishmd = false;
            ret.driver1 = GetDriverFromWebservice(brzjhm, brzjlx);
            ret.vehicles1 = GetVehFromWebservice(brzjhm, brzjlx);

            try
            {
                ret.rblist1 = (from p in db4.RBLIST where (p.SFZHM == brzjhm || p.SFZHM == brzjhm1) && p.ZT == "有效" select p).First();

            }
            catch
            {
                ret.rblist1 = new RBLIST();
                ret.rblist1.LX = "";
            }

            string[] anyof = { "暂扣", "违法未处理", "逾期未换证", "逾期未检验", "扣留", "注销可恢复", "扣押", "锁定" };// { 'D', 'H','M','S','U','R','K','L' };
            Boolean jsrzt = false;
            if (ret.driver1 != null)
            {
                foreach (string zt in anyof)
                {
                    if (ret.driver1.ZT.IndexOf(zt) >= 0)
                    {
                        jsrzt = true;
                    }
                }
            }
            ret.rblist1.LX = ret.rblist1.LX + (jsrzt ? "/驾驶人异常" : "");
            ret.rblist1.LX = ret.rblist1.LX + (ret.vehicles1.Count == 0 ? "" : "/所属车辆异常");
            if (ret.rblist1.LX != "")
            {
                ret.rblist1.ZT = "异常";
                brishmd = true;
            }
            if (blms == "代理个人业务" || blms == "代理单位业务")
            {
                try
                {
                    ret.rblist2 = (from p in db4.RBLIST where (p.SFZHM == dlrzjhm || p.SFZHM == dlrzjhm1) && p.ZT == "有效" select p).First();
                    dlrishmd = true;
                }
                catch { }

            }


            res["data"] = ret;
            return res;
        }
        private string GetDrvAndVehZt(string lb,string zt)
        {
          //PubMethod.wrlog("jdczttable", JsonConvert.SerializeObject(MvcApplication.DrvAndVehZts));

            string ret = "";
            char[] zts = zt.ToCharArray();
            if (lb == "1")
            {
                foreach(char z in zts)
                {
                    try
                    {
                        ret += (from p in MvcApplication.DrvAndVehZts where p.XTLB == "机动车" && p.CODE1 == z.ToString() select p).First().NAME+"/";
                       
                    }
                    catch
                    {

                    }
                }
            }
            else if (lb == "2")
            {
                foreach (char z in zts)
                {
                    try
                    {
                        ret += (from p in MvcApplication.DrvAndVehZts where p.XTLB == "驾驶人" && p.CODE1 == z.ToString() select p).First().NAME + "/";
                    }
                    catch
                    {

                    }
                }
            }

            return ret;
        }
/*
        [HttpGet]
        public async Task< string> QueryVehicleAndDriverForPdjh_bak(string xh)
        {
            PubMethod.wrlog("start", "start");
            string ret;
            dynamic obj = new ExpandoObject();
            var pdxx = (from p in db2.PDXX where p.XH == xh select new { BLLX=p.BLLX, BRZJHM =p.BRZJHM, BRNAME =p.BRNAME, DLRZJHM =p.DLRZJHM, DLRNAME =p.DLRNAME}).First();
            obj.pdxx = pdxx;

            // Task<Result<string, DRIVINGLICENSE, VEHICLE>> taskA = new Task<Result<string, DRIVINGLICENSE, VEHICLE>>(() => QueryVehicleAndDriverForPdjhTask(pdxx.BLLX,pdxx.DLRZJHM));
           // taskA.Start();
            obj.driver1 = null;
            using (EntitiesTrff db3 = new EntitiesTrff())
            {
                try
                {
                    obj.driver1 = (from p in db3.DRIVINGLICENSE where p.SFZMHM == pdxx.BRZJHM select new { CCLZRQ = p.CCLZRQ, YXQZ = p.YXQZ, LJJF = p.LJJF, ZT = p.ZT }).First();
                }
                catch
                {

                }
                obj.vehicles1 = from p in db3.VEHICLE where p.SFZMHM == pdxx.BRZJHM select new { HPHM = p.HPHM, HPZL = p.HPZL, YXQZ = p.YXQZ, ZT = p.ZT };

                // Result<string,DRIVINGLICENSE,VEHICLE> retfromtask =await taskA;
                obj.driver2 = null;
                obj.vehicles2 = null;
                if (pdxx.BLLX == "代理人业务")
                {
                    try
                    {
                        obj.driver2 = (from p in db3.DRIVINGLICENSE where p.SFZMHM == pdxx.DLRZJHM select new { CCLZRQ = p.CCLZRQ, YXQZ = p.YXQZ, LJJF = p.LJJF, ZT = p.ZT }).First();
                    }
                    catch
                    {

                    }
                    obj.vehicles2 = from p in db3.VEHICLE where p.SFZMHM == pdxx.DLRZJHM select new { HPHM = p.HPHM, HPZL = p.HPZL, YXQZ = p.YXQZ, ZT = p.ZT };

                }
            }
            PubMethod.wrlog("m", "m");
            PubMethod.wrlog("ret", JsonConvert.SerializeObject(obj));
            PubMethod.wrlog("end", "end");
            return JsonConvert.SerializeObject(obj);
        }

*/
        private string GetOldHm(string hm,string lx)
        {
            string old = string.Empty;
            if (lx == "居民身份证")
            {
                try
                {
                    old = hm.Substring(0, 6) + hm.Substring(8, 9);
                }
                catch
                {
                    old = hm;
                }
            }
            else if (lx == "组织机构代码证书")
            {
                try
                {
                    old = hm.Substring(8, 8) + "-" + hm.Substring(16, hm.Length - 16 - 1);
                }
                catch
                {
                    old = hm;
                }
            }
            return old;
        }


        /*
         * 通过post方法调webservice
        */
         
       /*
        //object 转 json
        string json = JsonConvert.SerializeObject(user);

        //json 转xml 
        string xml = JsonConvert.DeserializeXNode(json, "Root", true).ToString();

        //xml 转json
        XmlDocument doc = new XmlDocument();
        doc.LoadXml(xml);
        string jsontext = JsonConvert.SerializeXmlNode(doc);

        //json转object
        dynamic anotnerUser = JsonConvert.DeserializeObject<dynamic>(jsontext);
        string anotherJson = JsonConvert.SerializeObject(anotnerUser);
        */
        /// <summary>
        /// {"root":{"head":{"code":"1","message":"数据下载成功!","rownum":"1"},"body":{"veh":{"@id":"0","jyw":null,"xh":"51040016427918","hpzl":"02","hphm":"DP9812","clpp1":"宝骏牌","clxh":"LZW6465UAVY","clpp2":null,"syr":"庞冲","gcjk":"A","zzg":"156","zzjglx":null,"wxmbc":null,"ncdqsy":null,"zzcmc":"上汽通用五菱汽车股份有限公司","clsbdh":"LZWADAGBXGB693306","fdjh":"G04449541","cllx":"K31","csys":"E","syxz":"A","sfzmhm":"510824197410308371","sfzmmc":"A","zsxzqh":"510400","zsxxdz":"四川省苍溪县陵江镇高城村一组60号","yzbm1":"617068","lxdh":"13388312811","sjhm":"18090413086","zzz":"201600529","zzxzqh":"510403","zzxxdz":"四川省攀枝花市西区康家中路18号6栋2单元6楼12号","syq":"2","ccdjrq":"2016-07-25","djrq":"2018-05-24","yxqz":"2020-07-31","qzbfqz":"2099-12-31","fzjg":"川D","glbm":"510400000400","fprq":"2016-07-25","fzrq":"2016-07-25","fdjrq":"2016-07-25","fhgzrq":"2018-05-24","bxzzrq":"2018-07-14","bpcs":"0","bzcs":"0","bdjcs":"0","djzsbh":"510013584499","zdjzshs":"0","dabh":"D00020135669","xzqh":"510400","zt":"A","dybj":"0","jbr":"李皓","clly":"1","lsh":"1","fdjxh":"LJ479QNE2","rlzl":"A","pl":"1798","gl":"101","zxxs":"1","cwkc":"4620","cwkk":"1820","cwkg":"1750","hxnbcd":"0","hxnbkd":"0","hxnbgd":"0","gbthps":"0","zs":"2","zj":"2750","qlj":"1554","hlj":"1549","ltgg":"215/60R17","lts":"4","zzl":"1780","zbzl":"1410","hdzzl":"0","hdzk":"5","zqyzl":"0","qpzk":null,"hpzk":null,"hbdbqk":"GB18352.5-2013国Ⅴ","ccrq":"2016-05-11 00:00:00","hdfs":"A","llpz1":"A","pzbh1":"01825887","llpz2":null,"pzbh2":null,"xsdw":null,"xsjg":null,"xsrq":null,"jkpz":null,"jkpzhm":null,"hgzbh":"WDS09GB00132564","nszm":"1","nszmbh":"16510350589","gxrq":"2019-03-06 10:01:07","xgzl":"01,02,03,04,05,06,10","qmbh":null,"hmbh":null,"bz":null,"yzbm2":null,"zdyzt":null,"yxh":null,"cyry":null,"dphgzbh":null,"sqdm":null,"clyt":"P1","ytsx":"9","dzyx":null,"xszbh":"5140012466993","jyhgbzbh":"205104020240","dwbh":null,"syqsrq":"2016-07-25 00:00:00","yqjyqzbfqz":"2024-07-31 00:00:00","yqjyqz2":"2023-07-31 00:00:00","fdjgs":null,"sfyzhgn":null}}}}
        /// {"root":{"head":{"code":"1","message":"数据下载成功！","rownum":"0"},"body":""}}
        /// </summary>
        /// <param name="hpzl"></param>
        /// <param name="hphm"></param>
        /// <returns></returns>
        [HttpGet]
        public string GetVehFromWebservice1(string hpzl, string hphm)
        {
            Dictionary<string, string> openWith = new Dictionary<string, string>();
            openWith.Add("hpzl", hpzl);
            openWith.Add("hphm", hphm);
            string xmlstr = HttpHelper.HttpPostWebService("http://10.68.173.25/Service.asmx", "jdcxx_all", openWith);
            xmlstr = xmlstr.Replace("&lt;", "<").Replace("&gt;", ">");
            XmlDocument doc = new XmlDocument();
            doc.LoadXml(xmlstr);
            XmlNode node = doc.SelectSingleNode("root");

            return node == null ? "error" : JsonConvert.SerializeXmlNode(node);
        }
        [HttpGet]
        public List<veh> GetVehFromWebservice(string sfzhm, string lx)
        {
            string oldhm = GetOldHm(sfzhm, lx);
            Dictionary<string, string> openWith;
            string xmlstr, code;
            XmlDocument doc = new XmlDocument();
            XmlNode node;
            List<veh> newveh = new List<veh>();
            char[] pczt = { 'C', 'E' };//排出状态
            char[] bhzt = { 'Q', 'P','M' };//包含状态

            using (EntitiesTrff db3 = new EntitiesTrff())
            {
                List<veh> vs = db3.Database.SqlQuery<veh>("select hphm,hpzl,sfzmhm,clsbdh,sfzmhm,syxz,syr,yxqz,zt from vehicle where"
                     +" (sfzmhm='" + sfzhm + "' or sfzmhm='" + oldhm + "')").ToList();
                foreach(veh v in vs)
                {
                    try
                    {
                        openWith = new Dictionary<string, string>();
                        openWith.Add("hpzl", v.HPZL);
                        openWith.Add("hphm", "川" + v.HPHM);
                        xmlstr = HttpHelper.HttpPostWebService("http://10.68.173.25/Service.asmx", "jdcxx_all", openWith);
                        xmlstr = xmlstr.Replace("&lt;", "<").Replace("&gt;", ">");
                        doc.LoadXml(xmlstr);
                        node = doc.SelectSingleNode("root/head");
                        code = node["code"].InnerText;
                        if (code == "1")
                        {
                            veh obj = new veh();
                            node = doc.SelectSingleNode("root/body/veh");
                            obj.HPHM = node["hphm"].InnerText;
                            obj.HPZL = node["hpzl"].InnerText;
                            obj.SFZMHM = node["sfzmhm"].InnerText;
                            obj.CLSBDH = node["clsbdh"].InnerText;
                            obj.SYXZ = node["syxz"].InnerText;
                            obj.SYR = node["syr"].InnerText;
                            obj.YXQZ =Convert.ToDateTime( node["yxqz"].InnerText);
                            obj.SYR = node["syr"].InnerText;
                            string zt = node["zt"].InnerText;
                            if (zt.IndexOfAny(pczt) < 0 && zt.IndexOfAny(bhzt) >= 0)
                            {
                                obj.ZT = GetDrvAndVehZt("1", zt);
                                newveh.Add(obj);
                            }

                        }
                    }
                    catch
                    {
                        string zt = v.ZT;
                        if (zt.IndexOfAny(pczt) < 0 && zt.IndexOfAny(bhzt) >= 0)
                        {
                            v.ZT = GetDrvAndVehZt("1", v.ZT) + "(同)";
                            newveh.Add(v);
                        }
                    }
                }
            }
            return newveh;
        }
        /// <summary>
        /// {"root":{"head":{"code":"1","message":"数据下载成功!","rownum":"1"},"body":{"DrvPerson":{"@id":"0","sfzmhm":"510402197607265117","dabh":"510400140545","xm":"梁军","zsxxdz":"四川省攀枝花市东区新春巷12号附505号","zsxzqh":"510402","djzsxxdz":"四川省攀枝花市东区新春巷12号附505号","djzsxzqh":"510402","sjhm":"13618169966","fzjg":"川D","zjcx":"C1D","zt":"A","ljjf":"6","clrq":"2002-04-29","cclzrq":"2002-04-29","jzqx":"2","yxqs":"2014-04-29 00:00:00.0","yxqz":"2024-04-29","syrq":"2024-04-29","qfrq":"2020-04-29","glbm":"510400000400","zxbh":"5110016631466","xh":"251040002092718","xb":"1","sfzmmc":"A","lxzsxxdz":"四川省攀枝花市东区新春巷12号附505号","lxzsxzqh":"510402","lxdh":null,"csrq":"1976-07-26 00:00:00.0","gj":"156","dzyx":null,"xzqh":"510402","cfrq":null}}}}
        /// {"root":{"head":{"code":"0","message":"查无此数据!"},"body":""}}
        /// </summary>
        /// <param name="sfzhm"></param>
        /// <returns></returns>
        [HttpGet]
        public drv GetDriverFromWebservice(string sfzhm,string lx)
        {
            drv d =null;
            string oldhm = GetOldHm(sfzhm, lx);
            try
            {
                Dictionary<string, string> openWith = new Dictionary<string, string>();
                openWith.Add("sfzhm", sfzhm);
                string xmlstr = HttpHelper.HttpPostWebService("http://10.68.173.25/Service.asmx", "getDriver", openWith);
                xmlstr = xmlstr.Replace("&lt;", "<").Replace("&gt;", ">");
                XmlDocument doc = new XmlDocument();
                doc.LoadXml(xmlstr);
                XmlNode node = doc.SelectSingleNode("root/head");
                string code = node["code"].InnerText;
                if (code == "1")
                {
                    node = doc.SelectSingleNode("root/body/DrvPerson");
                    d = new drv();
                    d.XM = node["xm"].InnerText;
                    d.CCLZRQ =Convert.ToDateTime( node["cclzrq"].InnerText);
                    d.YXQZ= Convert.ToDateTime(node["yxqz"].InnerText);
                    d.LJJF = Convert.ToInt32(node["ljjf"].InnerText);
                    d.ZT = node["zt"].InnerText;
                    d.ZT = GetDrvAndVehZt("2", d.ZT);
                }
                else
                {
                    openWith.Add("sfzhm",oldhm);
                    xmlstr = HttpHelper.HttpPostWebService("http://10.68.173.25/Service.asmx", "getDriver", openWith);
                    xmlstr = xmlstr.Replace("&lt;", "<").Replace("&gt;", ">");
                     doc = new XmlDocument();
                    doc.LoadXml(xmlstr);
                    node = doc.SelectSingleNode("root/head");
                    code = node["code"].InnerText;
                    if (code == "1")
                    {
                        node = doc.SelectSingleNode("root/body/DrvPerson");
                        d = new drv();
                        d.XM = node["xm"].InnerText;
                        d.CCLZRQ = Convert.ToDateTime(node["cclzrq"].InnerText);
                        d.YXQZ = Convert.ToDateTime(node["yxqz"].InnerText);
                        d.LJJF = Convert.ToInt32(node["ljjf"].InnerText);
                        d.ZT = node["zt"].InnerText;
                        d.ZT = GetDrvAndVehZt("2", d.ZT);
                    }
                }
            }
            catch
            {
                using (EntitiesTrff db3 = new EntitiesTrff())
                {
                    try
                    {
                        d = db3.Database.SqlQuery<drv>("select xm,cclzrq,yxqz,ljjf,zt from DRIVINGLICENSE where sfzmhm='" + sfzhm + "' or sfzmhm='" + oldhm + "'").First();
                        d.ZT = GetDrvAndVehZt("2", d.ZT)+"(同)";
                    }
                    catch (Exception e)
                    {
                       
                    }
                }
            }
            return d;
        }
    }

}
