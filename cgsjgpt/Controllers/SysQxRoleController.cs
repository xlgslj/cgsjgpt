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
    public class SysQxRoleController : ApiController
    {
        private Entities db = new Entities();
        [HttpPost]
        public void RoleAdd(ROLES r)
        {
            r.ID = PubMethod.maxid();
            db.ROLES.Add(r);
            db.SaveChanges();
        }
        [HttpGet]
        public  Hashtable GetRoles(int page, int limit)
        {
            Hashtable ret = new Hashtable();
            IQueryable<ROLES> source = from p in db.ROLES orderby p.ID select p;
            ret["code"] = 0;
            ret["count"] = source.Count();
            ret["data"] = source.Skip((page - 1) * limit).Take(limit).ToList();
            return ret;
        }
        [HttpPost]
        public void RoleDel(dynamic obj)
        {
            string id = Convert.ToString(obj.id);
            int count = (from p in db.USERDB where p.QXLX == "角色权限" && p.QXS.Contains(id) select p).Count();
            if (count > 0)
            {
                throw new Exception("角色使用中,不能删除!");
                return;
            }

            ROLES r = (from p in db.ROLES where p.ID == id select p).First();
            db.ROLES.Remove(r);
            db.SaveChanges();
        }
        [HttpGet]
        public Hashtable RolesEditIndex(string id)
        {
            Hashtable ret = new Hashtable();
            ret["role"] = (from p in db.ROLES where p.ID == id select p).First();
            ret["menus"]= (from p in db.MENUDB where p.ADMIN=="0" orderby p.SORT select p).ToList();
            return ret;
        }
        [HttpPost]
        public void RoleEdit(ROLES r)
        {
            ROLES role = (from p in db.ROLES where p.ID == r.ID select p).First();
            db.ROLES.Remove(role);
            db.ROLES.Add(r);
            
            db.SaveChanges();
        }
    }
}