using System;
using System.Collections;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Data.Entity.Validation;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using System.Web.Http.Description;
using cgsjgpt.Controllers.Filters;
using cgsjgpt.Models;
using cgsjgpt.userclass.data;
using cgsjgpt.userclass.method;
namespace cgsjgpt.Controllers
{
    [WebApiExceptionFilter]
    [CustomAuthAttribute(true)]
    public class SysQxUserController : ApiController
    {
        private Entities db = new Entities();
        [HttpGet]
        public Hashtable UserIndex()
        {
            Hashtable ret = new Hashtable();
            ret["roles"] = (from p in db.ROLES orderby p.ID select p).ToList();
            ret["menus"] = (from p in db.MENUDB where p.ADMIN=="0" orderby p.ID select p).ToList();
            ret["dws"] = (from p in db.BMDB orderby p.ID select p).ToList();
            return ret;
        }
        [HttpGet]
        public Hashtable GetUser(string id)
        {
            Hashtable ret = new Hashtable();
            ret["roles"] = (from p in db.ROLES orderby p.ID select p).ToList();
            ret["menus"] = (from p in db.MENUDB where p.ADMIN=="0" orderby p.ID select p).ToList();
            ret["dws"] = (from p in db.BMDB orderby p.ID select p).ToList();
            ret["user"] = (from p in db.USERDB where p.ID == id select p).First();
            return ret;
        }
        [HttpGet]
        public Hashtable GetUsers(int page, int limit, string loginname, string name,string bmno,string include)
        {
            List<string> bms = new List<string>();
            if (bmno == null)
            {
                string Authorization = Request.Headers.Authorization.ToString();
                USERDB u = HttpRuntimeCache.Get(Authorization) as USERDB;
                bms = PubMethod.GetAllDw(u.DWNO);
            }
            else
            {
                if (include == "false")
                {
                    bms.Add(bmno);
                }
                else
                {
                    bms= PubMethod.GetAllDw(bmno);
                }
            }
            Hashtable ret = new Hashtable();
            IQueryable<USERDB> source = from p in db.USERDB
                                        where bms.Contains(p.DWNO)
                    && (name == null || p.NAME.Contains(name))
                    && (loginname == null || p.LOGINNAME.Contains(loginname))
                    orderby p.ID
                                        select p;
            ret["code"] = 0;
            ret["count"] = source.Count();
            ret["data"] = source.Skip((page - 1) * limit).Take(limit).ToList();
            return ret;
        }
        [HttpPost]
        public Result<string, string, USERDB, string, string> UserAdd(dynamic obj)
        {
            Result<string, string, USERDB, string, string> ret = new Result<string, string, USERDB, string, string>();
            //PubMethod.wrlog("dd", PubMethod.maxid());
            USERDB u = new USERDB();
            u.ID = PubMethod.maxid();
            u.DWNO = Convert.ToString(obj.dwno);
            u.DWNAME = Convert.ToString(obj.dwmc);
            u.LOGINNAME = Convert.ToString(obj.loginname);
            u.NAME = Convert.ToString(obj.name);
            u.PWD = SecurityHelper.DESEncrypt("888888", "pzhsjjzd");
            u.SFZHM = Convert.ToString(obj.sfzhm);
            u.SFZHM = Convert.ToString(obj.sfzhm);
            //u.MMYXQ
            u.TEL = Convert.ToString(obj.lxdh);
            u.IPXZ = Convert.ToString(obj.kqipxz);
            u.IP1 = Convert.ToString(obj.ip1);
            u.IP2 = Convert.ToString(obj.ip2);
            u.IP3 = Convert.ToString(obj.ip3);
            u.STATE = Convert.ToString(obj.zhzt);
            u.PJXTZH = Convert.ToString(obj.pjxtzh);
            u.LXDZ = Convert.ToString(obj.lxdz);
            u.QD = Convert.ToString(obj.qd);
            u.MEMO = Convert.ToString(obj.memo);
            u.BM= Convert.ToString(obj.ssks);
            u.QXLX = Convert.ToString(obj.qxlx);
            u.QXS = Convert.ToString(obj.ssqx);
            u.JGDWS = Convert.ToString(obj.jgdws);
            u.FASTMENU = "[]";
            List<USERDB> ul = new List<USERDB>();
            ul.Add(u);
            ret.Data = ul;
            db.USERDB.Add(u);
            db.SaveChanges();
            return ret;
        }
        [HttpPost]
        public void UserEdit(dynamic obj)
        {
            string id = Convert.ToString(obj.id);
            USERDB u = (from p in db.USERDB where p.ID == id select p).First();
            u.DWNO = Convert.ToString(obj.dwno);
            u.DWNAME = Convert.ToString(obj.dwmc);
            u.LOGINNAME = Convert.ToString(obj.loginname);
            u.NAME = Convert.ToString(obj.name);
            u.SFZHM = Convert.ToString(obj.sfzhm);
            u.SFZHM = Convert.ToString(obj.sfzhm);
            //u.MMYXQ
            u.TEL = Convert.ToString(obj.lxdh);
            u.IPXZ = Convert.ToString(obj.kqipxz);
            u.IP1 = Convert.ToString(obj.ip1);
            u.IP2 = Convert.ToString(obj.ip2);
            u.IP3 = Convert.ToString(obj.ip3);
            u.STATE = Convert.ToString(obj.zhzt);
            u.PJXTZH = Convert.ToString(obj.pjxtzh);
            u.LXDZ = Convert.ToString(obj.lxdz);
            u.QD = Convert.ToString(obj.qd);
            u.MEMO = Convert.ToString(obj.memo);
            u.BM = Convert.ToString(obj.ssks);
            u.QXLX = Convert.ToString(obj.qxlx);
            u.QXS = Convert.ToString(obj.ssqx);
            u.JGDWS = Convert.ToString(obj.jgdws);
            db.SaveChanges();

        }
        [HttpPost]
        public void UserDel(dynamic obj)
        {
            string id = Convert.ToString(obj.id);
            USERDB u = (from p in db.USERDB where p.ID == id select p).First();
            db.USERDB.Remove(u);
            db.SaveChanges();
        }
        [HttpPost]
        public void ResetPwd(dynamic obj)
        {
            string id = Convert.ToString(obj.id);
            USERDB u = (from p in db.USERDB where p.ID == id select p).First();
            u.PWD = SecurityHelper.DESEncrypt("888888", "pzhsjjzd");
            db.SaveChanges();
        }

        [HttpPost]
        public void EditPwd(dynamic obj)
        {
            string oldpwd = SecurityHelper.DESEncrypt(Convert.ToString(obj.oldpwd), "pzhsjjzd");
            string pwd1 = SecurityHelper.DESEncrypt(Convert.ToString(obj.pwd1), "pzhsjjzd") ;
            string Authorization = Request.Headers.Authorization.ToString();
            USERDB u = HttpRuntimeCache.Get(Authorization) as USERDB;
            USERDB user = (from p in db.USERDB where p.ID == u.ID select p).First();
            if (oldpwd != user.PWD)
            {
                throw new Exception("原密码不正确！");
                return;
            }
            user.PWD = pwd1;
            db.SaveChanges();
        }
        [CustomAuthAttribute(false)]
        [HttpGet]
        public Result<string, string, string, string, string> Login(string LoginName, string Pwd)
        {
            Result<string, string, string, string, string> ret = new Result<string, string, string, string, string>();

            ret.Msg = "0";
            ret.memo1 = System.Guid.NewGuid().ToString("D");
            
            return ret;

        }
        
    }
}