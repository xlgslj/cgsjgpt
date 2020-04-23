using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using cgsjgpt.Models;
using cgsjgpt.userclass.method;

namespace cgsjgpt.userclass.warn
{
    public class DtywDefault
    {
        public static void Kh(string userid)
        {
            using (Entities db = new Entities())
            using(EntitiesDtgl db1=new EntitiesDtgl())
            {
                try
                {
                    CONFIGBASE FGJYWZDHC = (from p in MvcApplication.SysConfigs where p.KEYWORD == "FGJYWZDHC" select p).First();
                    DateTime kssj = Convert.ToDateTime(DateTime.Now.ToString("yyyy-MM-dd") + " 00:00:00").AddHours(-1);
                    DateTime jssj = Convert.ToDateTime(DateTime.Now.ToString("yyyy-MM-dd") + " 23:59:59").AddHours(1);
                    USERDB ud = (from p in db.USERDB where p.ID == userid select p).First();
                    var DRZDKHS =int.Parse( (from p in db.CONFIGBM where p.DWNO == ud.DWNO && p.KEYWORD == "DRZDKHS" select p).First().V1);
                    int khs = (from p in db1.PDXX where p.DWNO == ud.DWNO && p.ENDTITIME >= kssj && p.ENDTITIME <= jssj && p.JBRID == userid && p.ZT == "空号" select p).Count();
                    if (khs > DRZDKHS)
                    {
                        try
                        {
                            WARNLOG wn = (from p in db1.WARNLOG where p.OPERID == userid && p.WARNLX == "大厅业务" && p.WARNLX1 == "窗口异常"&&p.OPLX== "单人单日办理业务空号数超过最大限值" && p.CREATETIME >= kssj && p.CREATETIME <= jssj select p).First();
                        }
                        catch
                        {
                            //未经本系统就办理了业务，预警
                            WARNLOG nw = new WARNLOG();
                            nw.ID = PubMethod.maxid();
                            nw.DWNO = ud.DWNO;
                            nw.DWMC = ud.DWNAME;
                            nw.XTLB = "";
                            nw.YWLX = "";
                            nw.WARNLX = "大厅业务";
                            nw.WARNLX1 = "窗口异常";
                            nw.OPLX = "单人单日办理业务空号数超过最大限值";

                            nw.OPERID = userid;
                            nw.OPERNAME = ud.NAME;
                            nw.ZT = "0";
                            nw.HCZT = FGJYWZDHC.V1;
                            nw.CREATETIME = DateTime.Now;
                            db1.WARNLOG.Add(nw);
                            db1.SaveChanges();
                            foreach (var host in MvcApplication.SocketHosts.ToList())
                            {
                                host.socket.Send("Warning@" + DateTime.Now.ToShortTimeString() + "  " + nw.WARNLX + "-" + nw.WARNLX1 + "-" + nw.OPLX);

                            }
                        }
                    }
                }
                catch
                {

                }
            }

        }
        public static void Tb(string userid)
        {
            using (Entities db = new Entities())
            using (EntitiesDtgl db1 = new EntitiesDtgl())
            {
                try
                {
                    DateTime kssj = Convert.ToDateTime(DateTime.Now.ToString("yyyy-MM-dd") + " 00:00:00").AddHours(-1);
                    DateTime jssj = Convert.ToDateTime(DateTime.Now.ToString("yyyy-MM-dd") + " 23:59:59").AddHours(1);
                    USERDB ud = (from p in db.USERDB where p.ID == userid select p).First();
                    var DRZDTBS = int.Parse((from p in db.CONFIGBM where p.DWNO == ud.DWNO && p.KEYWORD == "DRZDTBS" select p).First().V1);
                    int khs = (from p in db1.PDXX where p.DWNO == ud.DWNO && p.ENDTITIME >= kssj && p.ENDTITIME <= jssj && p.JBRID == userid && p.ZT == "退办" select p).Count();
                    if (khs > DRZDTBS)
                    {
                        try
                        {
                            WARNLOG wn = (from p in db1.WARNLOG where p.OPERID == userid && p.WARNLX == "大厅业务" && p.WARNLX1 == "窗口异常" && p.OPLX == "单人单日办理业务退办数超过最大限值" && p.CREATETIME >= kssj && p.CREATETIME <= jssj select p).First();
                        }
                        catch
                        {
                            //未经本系统就办理了业务，预警
                            WARNLOG nw = new WARNLOG();
                            nw.ID = PubMethod.maxid();
                            nw.DWNO = ud.DWNO;
                            nw.DWMC = ud.DWNAME;
                            nw.XTLB = "";
                            nw.YWLX = "";
                            nw.WARNLX = "大厅业务";
                            nw.WARNLX1 = "窗口异常";
                            nw.OPLX = "单人单日办理业务退办数超过最大限值";

                            nw.OPERID = userid;
                            nw.OPERNAME = ud.NAME;
                            nw.ZT = "0";
                            nw.HCZT = "0";
                            nw.CREATETIME = DateTime.Now;
                            db1.WARNLOG.Add(nw);
                            db1.SaveChanges();
                            foreach (var host in MvcApplication.SocketHosts.ToList())
                            {
                                host.socket.Send("Warning@" + DateTime.Now.ToShortTimeString() + "  " + nw.WARNLX + "-" + nw.WARNLX1 + "-" + nw.OPLX);

                            }
                        }
                    }
                }
                catch
                {

                }
            }

        }
    }
}