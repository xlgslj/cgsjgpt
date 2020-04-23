using cgsjgpt.Controllers.Filters;
using cgsjgpt.Models;
using cgsjgpt.userclass.data;
using cgsjgpt.userclass.method;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace cgsjgpt.Controllers
{
    [CustomAuthAttribute(true)]
    [WebApiExceptionFilter]
    public class SysCsMenuController : ApiController
    {
        private Entities db = new Entities();
        [HttpGet]
        public Result<string, MENUDB> MenuGet()
        {
            Result<string, MENUDB> ret = new Result<string, MENUDB>();
            ret.Data = (from p in db.MENUDB where p.ADMIN=="0" orderby p.SORT select p).ToList();
            return ret;
        }
        [HttpPost]
        public Result<MENUDB> MenuAdd(dynamic obj)
        {
            Result<MENUDB> ret = new Result<MENUDB>();
            MENUDB m = new MENUDB();
            m.ID = PubMethod.maxid();
            m.PID = Convert.ToString(obj.pid);
            m.PNAME = Convert.ToString(obj.pname);
            m.NAME = Convert.ToString(obj.name);
            m.ICON = Convert.ToString(obj.icon);
            m.OPENMODE = Convert.ToString(obj.openmode);
            m.MINWIDTH = Convert.ToInt16(obj.minwidth);
            m.WIDTH = Convert.ToInt16(obj.width);
            m.MINHEIGHT = Convert.ToInt16(obj.minheight);
            m.HEIGHT = Convert.ToInt16(obj.height);
            m.FSCREEN = Convert.ToString(obj.fscreen);
            m.URL = Convert.ToString(obj.url);
            m.SORT = Convert.ToInt16(obj.sort);
            m.MEMO = Convert.ToString(obj.memo);
            m.AUTO = Convert.ToString(obj.auto);
            m.ADMIN = "0";
            db.MENUDB.Add(m);
            db.SaveChanges();
            ret.memo1 = m;
            return ret;
        }
        [HttpPost]
        public Result<MENUDB> MenuEdit(dynamic obj)
        {
            Result<MENUDB> ret = new Result<MENUDB>();
            string id = Convert.ToString(obj.id);
            MENUDB m = (from p in db.MENUDB where p.ID == id select p).First();

            m.NAME = Convert.ToString(obj.name);
            m.ICON = Convert.ToString(obj.icon);
            m.OPENMODE = Convert.ToString(obj.openmode);
            m.MINWIDTH = Convert.ToInt16(obj.minwidth);
            m.WIDTH = Convert.ToInt16(obj.width);
            m.MINHEIGHT = Convert.ToInt16(obj.minheight);
            m.HEIGHT = Convert.ToInt16(obj.height);
            m.FSCREEN = Convert.ToString(obj.fscreen);
            m.URL = Convert.ToString(obj.url);
            m.SORT = Convert.ToInt16(obj.sort);
            m.MEMO = Convert.ToString(obj.memo);
            m.AUTO = Convert.ToString(obj.auto);
 
            db.SaveChanges();
            ret.memo1 = m;
            return ret;
        }
        [HttpPost]
        public Result<MENUDB> ReSort(dynamic obj)
        {
            Result<MENUDB> ret = new Result<MENUDB>();
            string id1 = Convert.ToString(obj.id1);
            int sort1 = Convert.ToInt16(obj.sort1);
            string id2 = Convert.ToString(obj.id2);
            int sort2 = Convert.ToInt16(obj.sort2);
            MENUDB m1 = (from p in db.MENUDB where p.ID == id1 select p).First();
            MENUDB m2= (from p in db.MENUDB where p.ID == id2 select p).First();
            m1.SORT = sort2;
            m2.SORT = sort1;
            db.SaveChanges();

            return ret;
        }
        [HttpPost]
        public void DelMenu(dynamic obj)
        {
            string id = Convert.ToString(obj.id);
            int count = (from p in db.ROLES where p.IDS.Contains(id) select p).Count();
            int count1 = (from p in db.USERDB where p.QXS.Contains(id) select p).Count();
            if (count > 0 || count1 > 0)
            {
                throw new Exception("配置正在使用中");
                return;
            }

            MENUDB row = (from p in db.MENUDB where p.ID == id select p).Single();
            int startsort =(int) row.SORT;
            string pid = row.PID;
            db.MENUDB.Remove(row);
            IQueryable<MENUDB> ms = from p in db.MENUDB where p.PID == pid && p.SORT > startsort orderby p.SORT select p;
            foreach(MENUDB m in ms)
            {
                m.SORT = startsort;
                startsort++;
            }
            db.SaveChanges();
        }
        [HttpGet]
        public Hashtable MenuGet(string id)
        {
            Hashtable ret = new Hashtable();
            ret["data"] = (from p in db.MENUDB where p.ID == id select p).First();
            return ret;
        }
    }
}
