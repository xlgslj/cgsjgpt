using cgsjgpt.Controllers.Filters;
using cgsjgpt.Models;
using cgsjgpt.userclass.data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using cgsjgpt.userclass.method;
using System.Collections;

namespace cgsjgpt.Controllers
{
    [CustomAuthAttribute(true)]
    [WebApiExceptionFilter]
    public class SysCsYwlxController : ApiController
    {
        private Entities db = new Entities();
        [HttpGet]
        public ResultToLay<CODEYWLX> GetCodeYwlx(int page, int limit, Boolean first)
        {
            ResultToLay<CODEYWLX> ret = new ResultToLay<CODEYWLX>();
            if (!first)
            {
                IQueryable<CODEYWLX> bms = from p in db.CODEYWLX orderby p.CODE select p;
                ret.code = 0;
                ret.count = bms.Count();
                ret.data = bms.Skip((page - 1) * limit).Take(limit).ToList();
            }
            else
            {
                ret.code=0;
                ret.count = 0;
                ret.data = new List<CODEYWLX>();
            }
            return ret;
        }
        [HttpGet]
        public Result<string,CODEYWLX> GetCodeYwlx()
        {
            Result<string, CODEYWLX> ret =new Result<string, CODEYWLX>();
            ret.Data = (from p in db.CODEYWLX orderby p.CODE select p).ToList();
            return ret;
        }
        [HttpPost]
        public void AddCodeYwlx(dynamic obj)
        {
            CODEYWLX rd = new CODEYWLX();
            rd.ID = PubMethod.maxid();
            rd.NAME = Convert.ToString(obj.name);
            rd.CODE = Convert.ToString(obj.code).ToUpper();
            rd.LSHISNULL = Convert.ToString(obj.lshisnull);
            rd.MEMO = Convert.ToString(obj.memo);
            db.CODEYWLX.Add(rd);
            db.SaveChanges();
        }
        [HttpPost]
        public void DelCodeYwlx(dynamic obj)
        {
            string id = Convert.ToString(obj.id);
            int count = (from p in db.CKSET where p.YWLXS.Contains(id) select p).Count();
            if (count > 0)
            {
                throw new Exception("配置正在使用中");
                return;
            }
            CODEYWLX row = (from p in db.CODEYWLX where p.ID == id select p).Single();
            db.CODEYWLX.Remove(row);
            db.SaveChanges();
        }
        [HttpPost]
        public void EditCodeYwlx(dynamic obj)
        {
            string id = Convert.ToString(obj.ID);
            CODEYWLX row = (from p in db.CODEYWLX where p.ID == id select p).Single();
            row.NAME = Convert.ToString(obj.NAME);
            row.CODE = Convert.ToString(obj.CODE);
            row.LSHISNULL = Convert.ToString(obj.LSHISNULL);
            db.SaveChanges();
        }
        [HttpGet]
        public Hashtable GetYwlx(string id)
        {
            Hashtable ret = new Hashtable();
            CODEYWLX d = (from p in db.CODEYWLX where p.ID == id select p).First();
            ret["count"] = (from p in db.CKSET where p.YWLXS.Contains(d.ID) select p).Count();
            ret["data"] = d;
            return ret;
        }
    }
}
