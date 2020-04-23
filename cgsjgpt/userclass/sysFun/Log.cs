using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using cgsjgpt.Models;
using cgsjgpt.userclass.method;
namespace cgsjgpt.userclass.sysFun
{
    public class Log
    {
        public static void CreateLog(string lb, int level, string source, string sourceid, string lx, string conn, string operid, string oper, string ip, string k1, string k2, string k3, string memo)
        {
            Task task = new Task(() => CreateLogTask(lb,level,source, sourceid, lx, conn, operid, oper,ip, k1, k2, k3, memo));
            task.Start();
        }
        public static void CreateLogTask(string lb,int level,string source,string sourceid,string lx,string conn,string operid,string oper,string ip,string k1,string k2,string k3,string memo)
        {
            using(Entities db=new Entities())
            {
                try
                {
                    LOG log = new LOG();
                    log.ID = PubMethod.maxid();
                    log.LB = lb;
                    log.LOGLEVEL = level;
                    log.SOURCE = source;
                    log.SOURCEID = source;
                    log.LX = lx;
                    log.CONN = conn;
                    log.OPERID = operid;
                    log.OPER = oper;
                    log.IP = ip;
                    log.K1 = k1;
                    log.K2 = k2;
                    log.K3 = k3;
                    log.MEMO = memo;
                    log.CREATETIME = DateTime.Now;
                    db.LOG.Add(log);
                    db.SaveChanges();
                }
                catch
                {

                }
            }
        }
    }
}