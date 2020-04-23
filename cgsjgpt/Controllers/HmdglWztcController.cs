using cgsjgpt.Controllers.Filters;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Web;
using System.Web.Http;
using System.Xml;
using Newtonsoft.Json;
using cgsjgpt.userclass.method;
using cgsjgpt.Models;
using cgsjgpt.userclass.data;

namespace cgsjgpt.Controllers
{
    [CustomAuthAttribute(true)]
    [WebApiExceptionFilter]
    public class HmdglWztcController : ApiController
    {
        public static string HttpPostWebService(string url, string method, Dictionary<string, string> paras)
        {
            string result = string.Empty;
            string param = string.Empty;
            byte[] bytes = null;

            Stream writer = null;
            HttpWebRequest request = null;
            HttpWebResponse response = null;
            foreach (KeyValuePair<string, string> p in paras)
            {

                param += HttpUtility.UrlEncode(p.Key) + "=" + HttpUtility.UrlEncode(p.Value) + "&";
            }
            param = param == string.Empty ? param : param.Substring(0, param.Length - 1);
            // PubMethod.wrlog("cs", param);
            //param = HttpUtility.UrlEncode("hpzl") + "=" + HttpUtility.UrlEncode(hpzl) + "&" + HttpUtility.UrlEncode("hphm1") + "=" + HttpUtility.UrlEncode(hphm);

            bytes = Encoding.UTF8.GetBytes(param);

            request = (HttpWebRequest)WebRequest.Create(url + "/" + method);
            request.Method = "POST";
            request.ContentType = "application/x-www-form-urlencoded";
            request.ContentLength = bytes.Length;

            try
            {
                writer = request.GetRequestStream();        //获取用于写入请求数据的Stream对象
            }
            catch (Exception ex)
            {
                return "";
            }

            writer.Write(bytes, 0, bytes.Length);       //把参数数据写入请求数据流
            writer.Close();
            try
            {
                response = (HttpWebResponse)request.GetResponse();      //获得响应
            }
            catch (WebException ex)
            {
                return "";
            }

            #region 这种方式读取到的是一个Xml格式的字符串
            StreamReader reader = new StreamReader(response.GetResponseStream(), Encoding.UTF8);
            result = reader.ReadToEnd();
            #endregion 

            response.Dispose();
            response.Close();

            reader.Close();
            reader.Dispose();
            return result;
        }

        [HttpGet]
        public Hashtable test()
        {
            Hashtable ret = new Hashtable();

            try
            {
                Dictionary<string, string> openWith = new Dictionary<string, string>();
                openWith.Add("Query", "select rownum as xh,t.* from redlist t");
                string result = HttpPostWebService("http://10.68.173.25/Service.asmx", "SQ_exe_xml", openWith);
                XmlDocument xd = new XmlDocument();
                xd.LoadXml(result);
                DataSet ds = new DataSet();
                ds.ReadXml(new XmlNodeReader(xd));
                //ret["json"] =JsonConvert.SerializeObject( ds.Tables[0]);
                //ret["data"] = JsonConvert.SerializeXmlNode(xd.SelectSingleNode("NewDataSet"));
                ret["xml"] = result;
                ret["state"] = 1;
            }
            catch (Exception err)
            {
                ret["state"] = 0;
                ret["msg"] = err.Message;
            }

            return ret;
        }
        [HttpGet]
        public Hashtable GetInfo(int page, int limit, string hphm, string gxr)
        {
            Hashtable ret = new Hashtable();
            try
            {
                int start = (page - 1) * limit + 1;
                int end = page * limit;
                string where = " where lb='X' and hphm like '%"+hphm + "%'";
                where += (gxr == "" || gxr==null) ? "" : "and gxr like '%" + gxr + "%'";
         
                string sql = " select t.*,"
                    +"nvl2(jssj,to_char(jssj,'yyyy-mm-dd'),'9999-12-31') as JSSJ1,"
                    +"nvl2(jdcsyr,jdcsyr,'未知') as jdcsyr1,"
                    +"nvl2(gxr,gxr,'无') as gxr1,"
                    + "nvl2(memo,memo,'无') as memo1 from redlist t" + where + " order by id";
                Dictionary<string, string> openWith = new Dictionary<string, string>();
                openWith.Add("Query", sql);
                string result = HttpPostWebService("http://10.68.173.25/Service1.asmx", "SQ_exe_xml", openWith);
                XmlDocument xd = new XmlDocument();
                xd.LoadXml(result);

                try
                {
                    DataSet ds = new DataSet();
                    ds.ReadXml(new XmlNodeReader(xd));

                    ret["data"] = (from p in ds.Tables[0].AsEnumerable()
                                   select new
                                   {
                                       //XH =p.Field<string>("XH"),
                                       ID = p.Field<string>("ID"),
                                       HPHM = p.Field<string>("HPHM"),
                                       HPZL = p.Field<string>("HPZL"),
                                       HPZLNAME = p.Field<string>("HPZLNAME"),
                                       DW = p.Field<string>("DW"),
                                       JDCSYR = p.Field<string>("JDCSYR1"),
                                       GXR = p.Field<string>("GXR1"),
                                       KSSJ = p.Field<string>("KSSJ"),
                                       JSSJ = p.Field<string>("JSSJ1"),
                                       MEMO = p.Field<string>("MEMO1")

                                   }).Skip((page - 1) * limit).Take(limit).ToList();

                    ret["count"] = ds.Tables[0].Rows.Count;
                    ret["code"] = 0;
                    ret["start"] = start;
                }
                catch(Exception e)
                {
                    ret["count"] = 0;
                    ret["code"] = 1;
                    ret["data"] = e.Message;
                }

            }
            catch (Exception err)
            {
                ret["code"] = 1;
                ret["msg"] = err.InnerException.Message;
            }
            return ret;
        }
        [HttpGet]
        public Hashtable getsingle(string id)
        {
            Hashtable ret = new Hashtable();
            try
            {
                string where = " where lb='X' and id='"+id+"'";
                string sql = " select t.*,"
                    + "nvl2(jssj,to_char(jssj,'yyyy-mm-dd'),'9999-12-31') as JSSJ1,"
                    + "nvl2(jdcsyr,jdcsyr,'未知') as jdcsyr1,"
                    + "nvl2(gxr,gxr,'无') as gxr1,"
                    + "nvl2(memo,memo,'无') as memo1 from redlist t" + where;
                Dictionary<string, string> openWith = new Dictionary<string, string>();
                openWith.Add("Query", sql);
                string result = HttpPostWebService("http://10.68.173.25/Service1.asmx", "SQ_exe_xml", openWith);
                XmlDocument xd = new XmlDocument();
                xd.LoadXml(result);

                try
                {
                    DataSet ds = new DataSet();
                    ds.ReadXml(new XmlNodeReader(xd));

                    ret["data"] = (from p in ds.Tables[0].AsEnumerable()
                                   select new
                                   {
                                       //XH =p.Field<string>("XH"),
                                       ID = p.Field<string>("ID"),
                                       HPHM = p.Field<string>("HPHM"),
                                       HPZL = p.Field<string>("HPZL"),
                                       HPZLNAME = p.Field<string>("HPZLNAME"),
                                       DW = p.Field<string>("DW"),
                                       JDCSYR = p.Field<string>("JDCSYR1"),
                                       GXR = p.Field<string>("GXR1"),
                                       KSSJ = p.Field<string>("KSSJ"),
                                       JSSJ = p.Field<string>("JSSJ1"),
                                       MEMO = p.Field<string>("MEMO1")

                                   }).ToList();

                    ret["state"] = 1;
                }
                catch (Exception e)
                {
                    ret["state"] = 0;
                    ret["msg"] = e.Message;
                }

            }
            catch (Exception err)
            {
                ret["state"] = 0;
                ret["msg"] = err.InnerException.Message;
            }
            return ret;
        }
        [HttpPost]
        public string Add(dynamic obj)
        {
            Dictionary<string, string> openWith = new Dictionary<string, string>();
            openWith.Add("hphm", Convert.ToString(obj.hphm));
            openWith.Add("hpzl", Convert.ToString(obj.hpzlno));
            openWith.Add("hpzlname", Convert.ToString(obj.hpzlname));
            openWith.Add("dw", "编号:X0009");
            openWith.Add("jssj", Convert.ToString(obj.jssj));
            openWith.Add("lb", "X");
            openWith.Add("jdcsyr", Convert.ToString(obj.jdcsyr));
            openWith.Add("gxr", Convert.ToString(obj.gxr));
            openWith.Add("memo", Convert.ToString(obj.memo));
            string result = HttpPostWebService("http://10.68.173.25/Service1.asmx", "add", openWith);
            XmlDocument xd = new XmlDocument();
            xd.LoadXml(result);
            XmlNode node = xd.SelectSingleNode("root/result");
            string state = node.Attributes["state"].Value;
            if (state == "0")
            {
                string id= node.Attributes["id"].Value;

                using (Entities_wztc db=new Entities_wztc())
                {
                    SPECIATABLE sp = new SPECIATABLE();
                    sp.ID = id;
                    sp.HPHM = Convert.ToString(obj.hphm);
                    sp.HPZL = Convert.ToString(obj.hpzlno);
                    sp.DW = "编号:X0009";
                    sp.HPZLNAME = Convert.ToString(obj.hpzlname);
                    sp.KSSJ = DateTime.Now;
                    sp.JSSJ = Convert.ToString(obj.jssj)==""?null: Convert.ToDateTime(Convert.ToString(obj.jssj) + " 00:00:00");
                    sp.LB = "X";
                    sp.JDCSYR = Convert.ToString(obj.jdcsyr);
                    sp.MEMO = Convert.ToString(obj.memo);
                    sp.GXR = Convert.ToString(obj.gxr);
                    db.SPECIATABLE.Add(sp);
                    db.SaveChanges();
                }
            }
            return state;
        }
        [HttpPost]
        public string Edit(dynamic obj)
        {
            Dictionary<string, string> openWith = new Dictionary<string, string>();
            openWith.Add("id", Convert.ToString(obj.id));
            openWith.Add("hphm", Convert.ToString(obj.hphm));
            openWith.Add("hpzl", Convert.ToString(obj.hpzlno));
            openWith.Add("hpzlname", Convert.ToString(obj.hpzlname));
            openWith.Add("jssj", Convert.ToString(obj.jssj));
            openWith.Add("jdcsyr", Convert.ToString(obj.jdcsyr));
            openWith.Add("gxr", Convert.ToString(obj.gxr));
            openWith.Add("memo", Convert.ToString(obj.memo));
            string result = HttpPostWebService("http://10.68.173.25/Service1.asmx", "edit", openWith);
            XmlDocument xd = new XmlDocument();
            xd.LoadXml(result);
            XmlNode node = xd.SelectSingleNode("root/result");
            string state = node.Attributes["state"].Value;
            if (state == "0")
            {
                using (Entities_wztc db = new Entities_wztc())
                {
                    string id = Convert.ToString(obj.id);
                    SPECIATABLE sp = (from p in db.SPECIATABLE where p.ID == id select p).First();
                    sp.HPHM = Convert.ToString(obj.hphm);
                    sp.HPZL = Convert.ToString(obj.hpzlno);
                    sp.HPZLNAME = Convert.ToString(obj.hpzlname);
                    sp.JSSJ = Convert.ToString(obj.jssj) == "" ? null : Convert.ToDateTime(Convert.ToString(obj.jssj) + " 00:00:00");
                    sp.JDCSYR = Convert.ToString(obj.jdcsyr);
                    sp.MEMO = Convert.ToString(obj.memo);
                    sp.GXR = Convert.ToString(obj.gxr);
                    db.SaveChanges();
                }
            }
            return state;
        }
        [HttpPost]
        public string Del(dynamic obj)
        {
            Dictionary<string, string> openWith = new Dictionary<string, string>();
            openWith.Add("id", Convert.ToString(obj.id));
            string result = HttpPostWebService("http://10.68.173.25/Service1.asmx", "del", openWith);
            XmlDocument xd = new XmlDocument();
            xd.LoadXml(result);
            XmlNode node = xd.SelectSingleNode("root/result");
            string state = node.Attributes["state"].Value;
            if (state == "0")
            {
                using (Entities_wztc db = new Entities_wztc())
                {
                    string id = Convert.ToString(obj.id);
                    SPECIATABLE sp = (from p in db.SPECIATABLE where p.ID == id select p).First();
                    db.SPECIATABLE.Remove(sp);
                    db.SaveChanges();
                }
            }
            return state;
        }
        [HttpGet]
        public Hashtable gethpzl()
        {
            Hashtable ret = new Hashtable();
            using (Entities db = new Entities())
            {
                ret["data"] = db.Database.SqlQuery<hpzl>("select * from wztc.hpzl_t").ToList();
            }
            return ret;
        }
        [HttpGet]
        public Hashtable getjdcxx(string hpzlno,string hphm)
        {
            Hashtable ret = new Hashtable();
            Dictionary<string, string> openWith = new Dictionary<string, string>();
            openWith.Add("hpzl", hpzlno);
            openWith.Add("hphm1", hphm);
            string result =HttpHelper.HttpPostWebService("http://10.68.173.25/Service.asmx", "jdcxx", openWith);
            string[] jdcxx = result.Split(new char[] { '&' });
            ret["data"] = jdcxx[0];
            return ret;
        }
    }
}
