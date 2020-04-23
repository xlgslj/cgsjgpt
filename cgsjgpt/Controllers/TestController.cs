using cgsjgpt.Models;
using cgsjgpt.userclass.method;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Reflection;
using System.Web.Http;
using Newtonsoft.Json;
using cgsjgpt.Controllers.Filters;
using System.Collections;
using System.Text;

namespace cgsjgpt.Controllers
{
   // [WebApiExceptionFilter]
    public class TestController : ApiController
    {
        [HttpGet]
        public string objCopy()
        {

            string ret = "";

            using (EntitiesTrff db = new EntitiesTrff())
            using (EntitiesSys1 db1 = new EntitiesSys1())
            {
                List<VEH_FLOW> vfs = db.Database.SqlQuery<VEH_FLOW>("select * from VEH_FLOW where lsh='3190904353305'").ToList();

                foreach (VEH_FLOW v in vfs)
                {

                    VVEH_FLOW1 newo = PubMethod.Mapper<VVEH_FLOW1, VEH_FLOW>(v);
                    newo.HDBJ = "0";
                    db1.VVEH_FLOW1.Add(newo);
                    db1.SaveChanges();
                    PubMethod.wrlog("objCopy", "5");


                }
            }
            return ret;
        }
        [HttpGet]
        public Hashtable m1()
        {
            Hashtable ret = new Hashtable();
            ret["name"] = "nochar";
            ret["age"] = 20;
            EntitiesHmd en = new EntitiesHmd();
            ret["hmd"] = (from p in en.RBLIST select p).First();
            return ret;
        }
        [HttpGet]
        public Hashtable m2(string name,int age)
        {
            Hashtable ret = new Hashtable();
            ret["name"] = "s-"+name;
            ret["age"] = age*10;
            EntitiesHmd en = new EntitiesHmd();
            ret["hmd"] = (from p in en.RBLIST select p).First();
            return ret;
        }
        [HttpPost]
        public Hashtable m3(dynamic obj)
        {
            Hashtable ret = new Hashtable();
            ret["pzh"] = "s-" + Convert.ToString(obj.name);
            EntitiesHmd en = new EntitiesHmd();
            ret["hmd"] = (from p in en.RBLIST select p).First();
            return ret;
        }

        [HttpGet]
        public string m4()
        {
            byte[] IvBytes = { 0x01, 0x23, 0x45, 0x67, 0x89, 0xAB, 0xCD, 0xEF };
            //return ByteToHexStr(IvBytes);
            PubMethod.wrlog("uftp", System.Text.Encoding.UTF8.GetString(IvBytes));
           return System.Text.Encoding.UTF8.GetString(IvBytes);
        }
        [HttpGet]
        public string m5()
        {
            string str1 = "pzhsjjzd";
            byte[] b = System.Text.Encoding.UTF8.GetBytes(str1);//按照指定编码将string编程字节数组
            string result = string.Empty;
            for (int i = 0; i < b.Length; i++)//逐字节变为16进制字符
            {
                result += Convert.ToString(b[i], 16);
            }
            return result;
            
        }
        /// <summary>
        /// byte[]转为16进制字符串
        /// </summary>
        /// <param name="bytes"></param>
        /// <returns></returns>
        public static string ByteToHexStr(byte[] bytes)
        {
            string returnStr = "";
            if (bytes != null)
            {
                for (int i = 0; i < bytes.Length; i++)
                {
                    returnStr += bytes[i].ToString("X2");
                }
            }
            return returnStr;
        }
        [HttpGet]
        public Hashtable doWebservice1()
        {
            Hashtable ret = new Hashtable();
            Dictionary<string, string> openWith = new Dictionary<string, string>();
            openWith.Add("Query", "select * from redlist");
            var result = HttpHelper.HttpPostWebService("http://10.68.173.25/Service.asmx", "SQ_exe", openWith);
            ret["data"] = result ;
            return ret;
        }
        public class hpzl
        {
            public string hpzlno { get; set; }
            public string hpname { get; set; }
        }
        [HttpGet]
        public Hashtable gethpzl()
        {
            Hashtable ret = new Hashtable();
            Entities db = new Entities();
            List<hpzl> obj = new List<hpzl>();

            obj = db.Database.SqlQuery<hpzl>("select * from wztc.hpzl_t").ToList();

            ret["data"] = (from p in db.BMDB select p).ToList();

            return ret;
        }
        [HttpGet]
        public string sleep()
        {
            System.Threading.Thread.Sleep(20000);
            return "1";
        }
    }
}
