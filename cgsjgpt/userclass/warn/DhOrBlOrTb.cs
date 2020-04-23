using cgsjgpt.Models;
using cgsjgpt.userclass.method;
using System;
using System.Collections.Generic;
using System.Data.Entity.Core.Objects;
using System.Linq;
using System.Web;

namespace cgsjgpt.userclass.warn
{
    public class DhOrBlOrTb
    {
        /// <summary>
        /// 等候超时、办理超时、退办预警
        ///主表里保留相关预警状态，等候结束、办理结束更改主表的预警状态（解除）
       /// </summary>
       public static void run()
        {
         //return;
            try
            {
                using (EntitiesDtgl db2 = new EntitiesDtgl())
                using (Entities db = new Entities())
                {
                    CONFIGBASE FGJYWZDHC = (from p in MvcApplication.SysConfigs where p.KEYWORD == "FGJYWZDHC" select p).First();
                    DateTime now = DateTime.Now;
                    IQueryable<BMDB> bm = from p in db.BMDB orderby p.ID select p;
                    foreach (BMDB b in bm)
                    {

                        IQueryable<CONFIGBM> conf = from p in db.CONFIGBM where p.DWNO == b.ID select p;
                        int blsj = conf.Where(p => p.KEYWORD == "PJYWBLSJBZXZ").First().V1 == null ? 0 : int.Parse(conf.Where(p => p.KEYWORD == "PJYWBLSJBZXZ").First().V1) * 60;
                        int dhsj = conf.Where(p => p.KEYWORD == "QZPJDHSJBZXZ").First().V1 == null ? 0 : int.Parse(conf.Where(p => p.KEYWORD == "QZPJDHSJBZXZ").First().V1) * 60;
                        string DTWXSJD1 = conf.Where(p => p.KEYWORD == "DTWXSJD").First().V1;
                        string DTWXSJD2 = conf.Where(p => p.KEYWORD == "DTWXSJD").First().V2;

                        DateTime wxkssj = Convert.ToDateTime(now.ToString("yyyy-MM-dd") + " " + DTWXSJD1 + ":00");
                        DateTime wxjssj = Convert.ToDateTime(now.ToString("yyyy-MM-dd") + " " + DTWXSJD2 + ":00");
                        int wxsecond = PubMethod.ConvertDateTimeInt(wxjssj) - PubMethod.ConvertDateTimeInt(wxkssj);
                       /* List<string> ps =(from p in db2.PDXX
                                              where p.DWNO == b.ID
                                              && p.QHSJ.Value.Year == now.Year && p.QHSJ.Value.Month == now.Month && p.QHSJ.Value.Day == now.Day
                                               && ((p.ZT == "等待叫号" && EntityFunctions.DiffSeconds(p.QHSJ, now) > dhsj) || (p.ZT == "正在办理" && EntityFunctions.DiffSeconds(p.STARTTIME, now) > blsj) || (p.ZT == "退办"&&p.TBYJ=="0"))
                                              select  p.XH).ToList();*/
                        List<string> ps = (from p in db2.PDXX
                                           where p.DWNO == b.ID
                                           && p.QHSJ.Value.Year == now.Year && p.QHSJ.Value.Month == now.Month && p.QHSJ.Value.Day == now.Day
                                            && ((p.ZT == "等待叫号" && EntityFunctions.DiffSeconds(p.QHSJ, now) > (p.QHSJ<=wxjssj&&now>=wxkssj?( dhsj+(EntityFunctions.DiffSeconds(p.QHSJ, wxjssj) >=wxsecond?wxsecond: EntityFunctions.DiffSeconds(p.QHSJ, wxjssj))) :dhsj)) || (p.ZT == "正在办理" && EntityFunctions.DiffSeconds(p.STARTTIME, now) > blsj) || (p.ZT == "退办" && p.TBYJ == "0"))
                                           select p.XH).ToList();
                        foreach (string xh in ps)
                        {
                           
                            try
                            {

                                //由于运行时间过长,要实时检查最新状态,防止与预警发起后用户又改变了状态
                                PDXX px = (from p in db2.PDXX where p.XH == xh && ((p.ZT == "等待叫号" && EntityFunctions.DiffSeconds(p.QHSJ, now) > dhsj) || (p.ZT == "正在办理" && EntityFunctions.DiffSeconds(p.STARTTIME, now) > blsj) || (p.ZT == "退办" && p.TBYJ == "0")) select p).First();

                                string zt = (px.ZT == "退办" ? "退办预警" : (px.ZT == "等待叫号" ? "等待超时预警" : "办理超时预警"));
                                if (zt == "等待超时预警" && px.DHYJ == "0") { px.DHYJ = "1"; }
                                if (zt == "办理超时预警" && px.BLYJ == "0") { px.BLYJ = "1"; }
                                if (zt == "退办预警" && px.TBYJ == "0") { px.TBYJ = "1"; }

                                try
                                {
                                    var w = (from p in db2.WARNLOG where p.KEY1 == px.XH && p.WARNLX == "大厅业务" && p.WARNLX1 == "窗口异常" && p.OPLX == zt select p).First();

                                    w.SECOND = w.OPLX == "等待超时预警" ? (PubMethod.ConvertDateTimeInt(now) - PubMethod.ConvertDateTimeInt((DateTime)px.QHSJ))
                                        : (w.OPLX == "办理超时预警" ? (PubMethod.ConvertDateTimeInt(now) - PubMethod.ConvertDateTimeInt((DateTime)px.STARTTIME)) : 0);
                                }
                                catch
                                {
                                    WARNLOG nw = new WARNLOG();
                                    nw.ID = PubMethod.maxid();
                                    nw.DWNO = b.ID;
                                    nw.DWMC = b.NAME;
                                    nw.WARNLX = "大厅业务";
                                    nw.WARNLX1 = "窗口异常";
                                    nw.OPLX = px.ZT == "退办" ? "退办预警" : (px.ZT == "等待叫号" ? "等待超时预警" : "办理超时预警");
                                    nw.OPLX1 = px.YWLXMC;
                                    nw.KEY1 = px.XH;
                                    nw.KEY2 = px.PDHM;
                                    nw.KEY3 = px.ZT == "等待叫号" ? ((DateTime)px.QHSJ).ToString("yyyy-MM-dd HH:mm:ss") : ((DateTime)px.STARTTIME).ToString("yyyy-MM-dd HH:mm:ss");
                                    nw.KEY4 = px.ZT == "等待叫号" ? "" : px.CK;
                                    nw.KEY6 = px.XH;
                                    nw.OPERID = px.ZT == "等待叫号" ? px.DBRID : px.JBRID;
                                    nw.OPERNAME = px.ZT == "等待叫号" ? px.DBR : px.JBR;
                                    nw.STARTTIME = now;//报警开始时间，只在第一次写入，报警解除时间在对应逻辑里写
                                    nw.SECOND = px.ZT == "等待叫号" ? (PubMethod.ConvertDateTimeInt(now) - PubMethod.ConvertDateTimeInt((DateTime)px.QHSJ))
                                        : px.ZT == "正在办理" ? (PubMethod.ConvertDateTimeInt(now) - PubMethod.ConvertDateTimeInt((DateTime)px.STARTTIME)) : 0;
                                    nw.ZT = "0";
                                    nw.HCZT = FGJYWZDHC.V1;
                                    nw.CREATETIME = DateTime.Now;
                                    db2.WARNLOG.Add(nw);
                                    foreach (var host in MvcApplication.SocketHosts.ToList())
                                    {
                                        host.socket.Send("Warning@" + DateTime.Now.ToShortTimeString() + "  " + nw.WARNLX + "-" + nw.WARNLX1 + "-" + nw.OPLX);

                                    }
                                }
                                db2.SaveChanges();
                               
                            }
                            catch(Exception e)
                            {
                                PubMethod.wrlog("DhOrBlOrTb-run",e.Message);
                            }
                        }
                    }

                }
            }
            catch (Exception e)
            {
                PubMethod.wrlog("DhOrBlOrTb-error", e.Message);
            }
        }
    }
}