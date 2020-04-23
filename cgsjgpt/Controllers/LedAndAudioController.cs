using System;
using System.Collections;
using System.Collections.Generic;
using System.Data.Entity.Core.Objects;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Web.Http;
using cgsjgpt.Models;
using Newtonsoft.Json;
using cgsjgpt.userclass.method;
namespace cgsjgpt.Controllers
{
    public class LedAndAudioController : ApiController
    {

        public class Led1
        {
            public string ID { get; set; }
            public string BMBH { get; set; }
            public DateTime? JHSJ { get; set; }
            public decimal ZT { get; set; }
            public string JHHM { get; set; }
            public decimal ADDRESS { get; set; }
            public decimal LEDSHOW { get; set; }

        }
        public class Led2
        {
            public string ID { get; set; }
            public string JHHM { get; set; }
            public decimal ADDRESS { get; set; }
            public decimal LEDSHOW { get; set; }

        }
        private EntitiesDtgl db = new EntitiesDtgl();
        private Entities db1 = new Entities();
        [HttpGet]
        public HttpResponseMessage GetLedList1(string dwno)
        {
            Hashtable ret = new Hashtable();
            DateTime day = DateTime.Now;
            int JHBFYYCS = int.Parse((from p in db1.CONFIGBM where p.DWNO == dwno && p.KEYWORD == "JHBFYYCS" select p).First().V1);
            int YYJHZXJGSJ = int.Parse((from p in db1.CONFIGBM where p.DWNO == dwno && p.KEYWORD == "YYJHZXJGSJ" select p).First().V1);

            var source = from p in db.PDXX where p.DWNO==dwno&& p.ZT == "正在办理" &&p.JHCS< JHBFYYCS && EntityFunctions.DiffSeconds(p.JHSJ, day)>= YYJHZXJGSJ orderby p.JHSJ descending select p;

             List<Led1> data = new List<Led1>();
             foreach(PDXX px in source)
             {
                 Led1 led = new Led1();
                led.ID = px.XH;// Convert.ToDecimal( px.XH);
                 led.BMBH = px.DWNO;
                 led.JHSJ = px.STARTTIME;
                 led.ZT = 1;
                 led.JHHM = px.PDHM;
                decimal win;
                try
                {
                    win = Convert.ToDecimal(px.CK.Substring(0, 2));
                }
                catch
                {
                   win= Convert.ToDecimal(px.CK.Substring(0, 1));
                }
                led.ADDRESS = win;
                led.LEDSHOW = px.JHCS >= JHBFYYCS - 1 ? 2 : 0;
                data.Add(led);
             }
             if (data.Count > 0)
             {
                 ret["list"] =  data;
             }
            else
             {
                 ret["list"] = "";
             }
            ret["success"] = source.Count()>0?1:0;
            string str = JsonConvert.SerializeObject(ret);
            HttpResponseMessage result = new HttpResponseMessage { Content = new StringContent(str, Encoding.GetEncoding("UTF-8"), "application/json") };
            return result;
        }
        [HttpGet]
        public HttpResponseMessage GetLedList2(string dwno)
        {
            Hashtable ret = new Hashtable();
            DateTime day = DateTime.Now;
            int JHBFYYCS = int.Parse((from p in db1.CONFIGBM where p.DWNO == dwno && p.KEYWORD == "JHBFYYCS" select p).First().V1);
            int YYJHZXJGSJ = int.Parse((from p in db1.CONFIGBM where p.DWNO == dwno && p.KEYWORD == "YYJHZXJGSJ" select p).First().V1);

            var source = from p in db.PDXX where p.DWNO == dwno && p.ZT == "正在办理" && p.JHCS < JHBFYYCS && EntityFunctions.DiffSeconds(p.JHSJ, day) >= YYJHZXJGSJ orderby p.JHSJ descending select p;

            List<Led2> data = new List<Led2>();
            foreach (PDXX px in source)
            {
                Led2 led = new Led2();
                led.ID = px.XH; //Convert.ToDecimal(px.XH);
                led.JHHM = px.PDHM;
                decimal win;
                try
                {
                    win = Convert.ToDecimal(px.CK.Substring(0, 2));
                }
                catch
                {
                    win = Convert.ToDecimal(px.CK.Substring(0, 1));
                }
                led.ADDRESS = win;
                led.LEDSHOW = px.JHCS>= JHBFYYCS-1 ? 2 : 0;
                data.Add(led);
            }
            if (data.Count > 0)
            {
                ret["list"] = data;
            }
            else
            {
                ret["list"] = "";
            }
            ret["success"] = source.Count() > 0 ? 1 : 0;
            string str = JsonConvert.SerializeObject(ret);
            HttpResponseMessage result = new HttpResponseMessage { Content = new StringContent(str, Encoding.GetEncoding("UTF-8"), "application/json") };
            return result;
        }
        [HttpGet]
        public HttpResponseMessage GetLICENSELed1(string dwno)
        {
            Hashtable ret = new Hashtable();
            DateTime day = DateTime.Now;
            //var source = (from p in db.LICENSE where p.ZT == "0" && p.DWNO == dwno && p.OPTIME.Value.Year == day.Date.Year&&p.OPTIME.Value.Month==day.Date.Month&&p.OPTIME.Value.Day==day.Day orderby p.ID select p).ToList();
            var source = (from p in db.LICENSE where p.ZT == "0" && p.DWNO == dwno orderby p.ID select p).ToList();
            ret["list"] = source;
            ret["success"] = source.Count > 0 ? 1 : 0;
            string str = JsonConvert.SerializeObject(ret);
            HttpResponseMessage result = new HttpResponseMessage { Content = new StringContent(str, Encoding.GetEncoding("UTF-8"), "application/json") };
            return result;

        }
        [HttpGet]
        public HttpResponseMessage GetLICENSELed2(string dwno)
        {
            Hashtable ret = new Hashtable();
            DateTime day = DateTime.Now;
            //var source = (from p in db.LICENSE where p.ZT == "1" && p.DWNO == dwno && p.OPTIME.Value.Year == day.Date.Year && p.OPTIME.Value.Month == day.Date.Month && p.OPTIME.Value.Day == day.Day orderby p.ID select p).ToList();
            var source = (from p in db.LICENSE where p.ZT == "1" && p.DWNO == dwno  orderby p.ID select p).ToList();
            ret["list"] = source;
            ret["success"] = source.Count > 0 ? 1 : 0;
            string str = JsonConvert.SerializeObject(ret);
            HttpResponseMessage result = new HttpResponseMessage { Content = new StringContent(str, Encoding.GetEncoding("UTF-8"), "application/json") };
            return result;

        }
        [HttpGet]
        public void UpdateLEDSHOW(string id)
        {
            try
            {
                PDXX px = (from p in db.PDXX where p.XH == id select p).First();
                px.JHCS = px.JHCS + 1;
                px.JHSJ = DateTime.Now;
                db.SaveChanges();
                foreach (var host in MvcApplication.SocketHosts.ToList())
                {
                    host.socket.Send("Led@"+id+"@"+px.JHCS);
                    // PubMethod.wrlog("qh", "send");
                }
            }
            catch
            {

            }
        }

    }
}
