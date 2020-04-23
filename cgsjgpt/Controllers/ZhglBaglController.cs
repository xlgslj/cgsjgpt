using System;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Reflection;
using System.Web;
using System.Web.Http;
using cgsjgpt.Controllers.Filters;
using cgsjgpt.Models;
using cgsjgpt.userclass.method;
using Newtonsoft.Json;

namespace cgsjgpt.Controllers
{
    [WebApiExceptionFilter]
    [CustomAuthAttribute(true)]
    public class ZhglBaglController : ApiController
    {
        private EntitiesHmd db = new EntitiesHmd();
        [HttpGet]
        public Hashtable getExample()
        {
            Hashtable ret = new Hashtable();
            DWBADB db = new DWBADB();
            ret["data"] = db;
            return ret;
        }
        [HttpGet]
        public Hashtable getSignDwba(string id)
        {
            Hashtable ret = new Hashtable();
            DWBADB d = (from p in db.DWBADB where p.ID == id select p).First();
            ret["data"] = d;
            return ret;
        }
        [HttpGet]
        public Hashtable getSignDwbaFromZzjgdm(string zzjgdm)
        {
            Hashtable ret = new Hashtable();
            try
            {
                DWBADB d = (from p in db.DWBADB where p.ZZJGDM == zzjgdm select p).First();
                ret["data"] = d;
            }
            catch
            {
                ret["data"] =null;
            }
            return ret;
        }
        [HttpPost]
        public void addDwbaDb(DWBADB s)
        {
            string Authorization = Request.Headers.Authorization.ToString();
            USERDB user = HttpRuntimeCache.Get(Authorization) as USERDB;

            String dirImgPath = HttpContext.Current.Server.MapPath("/upfiles/images");
            String dirTempPath = HttpContext.Current.Server.MapPath("/upfiles/temp");

            string filename = string.Empty;

            DWBADB d = new DWBADB();
            d=PubMethod.Mapper<DWBADB, DWBADB>(s);
            d.ID = PubMethod.maxid();
            try
            {
                filename = d.URL1.Split(new char[] { '/' })[3];
                File.Move(dirTempPath + "/" + filename, dirImgPath + "/" + filename);
                d.URL1 = d.URL1.Replace("temp", "images");
            }
            catch
            {

            }
            try
            {
                filename = d.URL2.Split(new char[] { '/' })[3];
                File.Move(dirTempPath + "/" + filename, dirImgPath + "/" + filename);
                d.URL2 = d.URL2.Replace("temp", "images");
            }
            catch
            {
            }
            if (d.URL3 != "")
            {
                try
                {
                    filename = d.URL3.Split(new char[] { '/' })[3];
                    File.Move(dirTempPath + "/" + filename, dirImgPath + "/" + filename);
                    d.URL3 = d.URL3.Replace("temp", "images");
                }
                catch
                {
                }
            }
            if (d.URL4 != "")
            {
                try
                {
                    filename = d.URL4.Split(new char[] { '/' })[3];
                    File.Move(dirTempPath + "/" + filename, dirImgPath + "/" + filename);
                    d.URL4 = d.URL4.Replace("temp", "images");
                }
                catch
                {
                }
            }
            if (d.URL5 != "")
            {
                try
                {
                    filename = d.URL5.Split(new char[] { '/' })[3];
                    File.Move(dirTempPath + "/" + filename, dirImgPath + "/" + filename);
                    d.URL5 = d.URL5.Replace("temp", "images");
                }
                catch
                {
                }
            }
            if (d.URL6 != "")
            {
                try
                {
                    filename = d.URL6.Split(new char[] { '/' })[3];
                    File.Move(dirTempPath + "/" + filename, dirImgPath + "/" + filename);
                    d.URL6 = d.URL6.Replace("temp", "images");
                }
                catch
                {
                }
            }
            d.OPER = user.NAME;
            d.OPTIME = DateTime.Now;
            db.DWBADB.Add(d);
            db.SaveChanges();
        }
        [HttpPost]
        public void editDwbaDb(DWBADB s)
        {
            string Authorization = Request.Headers.Authorization.ToString();
            USERDB user = HttpRuntimeCache.Get(Authorization) as USERDB;

            String dirImgPath = HttpContext.Current.Server.MapPath("/upfiles/images");
            String dirTempPath = HttpContext.Current.Server.MapPath("/upfiles/temp");

            string id = s.ID;

            string filename = string.Empty;

            DWBADB d =(from p in db.DWBADB where p.ID==id select p).First();
            d.MEMO1 = "";
            s.MEMO1 = "";
            var Types = d.GetType();//获得类型  
            object newv, oldv;
            Hashtable oplog = new Hashtable();
            foreach (PropertyInfo sp in Types.GetProperties())//获得类型的属性字段  
            {

                newv = sp.GetValue(s, null);
                oldv = sp.GetValue(d, null);
                if (oldv != null && newv != null)
                {
                    if (!oldv.Equals(newv))
                    {

                        oplog[sp.Name] = oldv + "->" + newv;
                        sp.SetValue(d, newv, null);//获得s对象属性的值复制给d对象的属性  

                    }
                }
                else if (oldv != null || newv != null)
                {
                    oplog[sp.Name] = oldv + "->" + newv;
                    sp.SetValue(d, newv, null);//获得s对象属性的值复制给d对象的属性  
                }

            }

            try
            {
                filename = d.URL1.Split(new char[] { '/' })[3];
                File.Move(dirTempPath + "/" + filename, dirImgPath + "/" + filename);
                d.URL1 = d.URL1.Replace("temp", "images");
            }
            catch
            {

            }
            try
            {
                filename = d.URL2.Split(new char[] { '/' })[3];
                File.Move(dirTempPath + "/" + filename, dirImgPath + "/" + filename);
                d.URL2 = d.URL2.Replace("temp", "images");
            }
            catch
            {
            }
            if (d.URL3 != "")
            {
                try
                {
                    filename = d.URL3.Split(new char[] { '/' })[3];
                    File.Move(dirTempPath + "/" + filename, dirImgPath + "/" + filename);
                    d.URL3 = d.URL3.Replace("temp", "images");
                }
                catch
                {
                }
            }
            if (d.URL4 != "")
            {
                try
                {
                    filename = d.URL4.Split(new char[] { '/' })[3];
                    File.Move(dirTempPath + "/" + filename, dirImgPath + "/" + filename);
                    d.URL4 = d.URL4.Replace("temp", "images");
                }
                catch
                {
                }
            }
            if (d.URL5 != "")
            {
                try
                {
                    filename = d.URL5.Split(new char[] { '/' })[3];
                    File.Move(dirTempPath + "/" + filename, dirImgPath + "/" + filename);
                    d.URL5 = d.URL5.Replace("temp", "images");
                }
                catch
                {
                }
            }
            if (d.URL6 != "")
            {
                try
                {
                    filename = d.URL6.Split(new char[] { '/' })[3];
                    File.Move(dirTempPath + "/" + filename, dirImgPath + "/" + filename);
                    d.URL6 = d.URL6.Replace("temp", "images");
                }
                catch
                {
                }
            }
            d.OPER = user.NAME;
            d.OPTIME = DateTime.Now;
            d.MEMO1 = JsonConvert.SerializeObject(oplog);
            db.SaveChanges();
        }
        [HttpPost]
        public void delDwbaDb(dynamic obj)
        {
            string id = Convert.ToString(obj.id);
            DWBADB u = (from p in db.DWBADB where p.ID == id select p).First();
            db.DWBADB.Remove(u);
            db.SaveChanges();
        }
        [HttpGet]
        public Hashtable queryBaxx(int page, int limit,string balx,string dwmc,string zzjgdm)
        {
            Hashtable ret = new Hashtable();

            IQueryable<DWBADB> source = from p in db.DWBADB
                                         where (balx == null || p.BALX.Contains(balx)) && (dwmc == null || p.DWMC.Contains(dwmc))
                                            &&(zzjgdm==null||p.ZZJGDM.Contains(zzjgdm))
                                         orderby p.ID descending
                                         select p;
            ret["code"] = 0;
            ret["count"] = source.Count();
            ret["data"] = source.Skip((page - 1) * limit).Take(limit).ToList();
            return ret;
        }
    }
}
