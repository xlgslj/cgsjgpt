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
using System.Collections;

namespace cgsjgpt.Controllers
{
    [CustomAuthAttribute(true)]
    [WebApiExceptionFilter]
    public class SysQxBmController : ApiController
    {
        private Entities db = new Entities();
        [HttpGet]
        public Result<string, BMDB> BmGet()
        {
            Result<string, BMDB> ret = new Result<string, BMDB>();
            ret.Data = (from p in db.BMDB select p).ToList();
            return ret;
        }
        [HttpGet]
        public Hashtable GetSingBm(string id)
        {
            Hashtable res = new Hashtable();
            res["Data"] = (from p in db.BMDB where p.ID == id select p).First();
            return res;
        }
        [HttpPost]
        public Result<string,string,string,string,string> BmAdd(dynamic obj)
        {
            Result<string, string, string, string, string> ret = new Result<string, string, string, string, string>();
            BMDB bm = new BMDB();
            bm.ID = PubMethod.maxid();
            bm.PID=Convert.ToString(obj.pid);
            bm.PNAME=Convert.ToString(obj.pname);
            bm.BMNO=Convert.ToString(obj.bmno);
            bm.NAME=Convert.ToString(obj.bmmc);
            bm.BAJGNO=Convert.ToString(obj.bajgno);
            bm.BAJGNAME=Convert.ToString(obj.bajgmc);
            bm.BMJB=Convert.ToString(obj.bmjb);
            bm.LXR=Convert.ToString(obj.lxr);
            bm.LXDH=Convert.ToString(obj.lxdh);
            bm.FZJG=Convert.ToString(obj.fzjg);
            //bm.fConvert.ToString(obj.fax);
            bm.LXDZ=Convert.ToString(obj.lxdz);
            bm.ISJG = Convert.ToString(obj.sfjg);
            bm.MEMO=Convert.ToString(obj.memo);

            db.BMDB.Add(bm);
            db.SaveChanges();
            ret.memo1 = bm.ID;
            return ret;
        }
        [HttpPost]
        public void BmDel(dynamic obj)
        {
            string id = Convert.ToString(obj.id);
            BMDB bm = (from p in db.BMDB where p.ID == id select p).First();
            db.BMDB.Remove(bm);
            //var p_dwno=   new Oracle.ManagedDataAccess.Client.OracleParameter("@dwno", id);
            //int rcount = db.Database.ExecuteSqlCommand("delete from configbm where dwno=@dwno", p_dwno);
            int rcount = db.Database.ExecuteSqlCommand("delete from configbm where dwno='"+id+"'");
            //Task<int> rcount2 = db.Database.ExecuteSqlCommandAsync("delete from configbm where dwno=@dwno", p_dwno);
            db.SaveChanges();
        }
        [HttpPost]
        public void BmEdit(dynamic obj)
        {
            string id = Convert.ToString(obj.ID);
            BMDB bm = (from p in db.BMDB where p.ID == id select p).First();
            bm.PID = Convert.ToString(obj.PID);
            bm.PNAME = Convert.ToString(obj.PNAME);
            bm.BMNO = Convert.ToString(obj.BMNO);
            bm.NAME = Convert.ToString(obj.NAME);
            bm.BAJGNO = Convert.ToString(obj.BAJGNO);
            bm.BAJGNAME = Convert.ToString(obj.BAJGNAME);
            bm.BMJB = Convert.ToString(obj.BMJB);
            bm.LXR = Convert.ToString(obj.LXR);
            bm.LXDH = Convert.ToString(obj.LXDH);
            bm.FZJG = Convert.ToString(obj.FZJG);
            bm.LXDZ = Convert.ToString(obj.LXDZ);
            bm.ISJG = Convert.ToString(obj.ISJG);
            bm.MEMO = Convert.ToString(obj.MEMO);
            db.SaveChanges();




        }
    }
}
