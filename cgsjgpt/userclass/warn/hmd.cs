using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using cgsjgpt.Models;
using cgsjgpt.userclass.method;
using cgsjgpt.userclass.data;
using Newtonsoft.Json;
namespace cgsjgpt.userclass.warn
{
    public class hmd
    {

        public static void run(string id)
        {
            DtHmdBlyw(id);
        }
        /// <summary>
        /// 大厅排号是黑名单依然办理业务，在业务“办结时触发”
        /// </summary>
        public static void DtHmdBlyw(string id)
        {
            using (EntitiesTrff db3 = new EntitiesTrff())
            using (EntitiesDtgl db1 = new EntitiesDtgl())
                using(EntitiesHmd db4=new EntitiesHmd())
            {
                try
                {
                    PDXX px = (from p in db1.PDXX where p.XH == id select p).First();
                   
                    if (px.ISHMD != "00"&&px.QUERYZT== "完毕")
                    {
                        RDV rdv = JsonConvert.DeserializeObject<RDV>(px.DRVANDVEHINFO);
                        char[] anyof = { 'D', 'H', 'Z', 'M', 'S', 'U', 'R' };
                        Boolean brishmd = px.ISHMD.Substring(0, 1) == "1" ? true : false;
                        Boolean dlrishmd = px.ISHMD.Substring(1, 1) == "1" ? true : false;

                        /**--------查业务流水----------**/
                        
                            Hashtable flow = ywlsh.QueryFlow(px.YWLSH);
                            string ywlx = flow["ywlx"] as string;
                             VEH_FLOW vf = null;
                        try
                        {
                            vf = flow["result"] as VEH_FLOW;
                        }
                        catch
                        {

                        }
                       
                        /**------------------**/
                        if (brishmd)
                        {
                            RBLIST rb = rdv.rblist1;
                            if (rb.LX.IndexOf("黑名单") >= 0&&1==2)//1===2是后加,目的是关掉本项预警,因为本人是黑名单也可以办理自己的业务
                            {
                                WARNLOG nw = new WARNLOG();
                                nw.ID = PubMethod.maxid();
                                nw.DWNO = px.DWNO;
                                nw.DWMC = px.DWMC;
                                nw.XTLB = px.YWLSH.Substring(0, 1) == "1" ? "机动车" : "驾驶人";
                                nw.WARNLX = "大厅业务";
                                nw.YWLX = ywlx;
                                nw.WARNLX1 = "黑名单办理";
                                nw.OPLX = "本人属于黑名单人员";
                                nw.SFZMHM = px.BRZJHM;
                                nw.NAME = rb.NAME;
                                nw.HPHM = vf != null ? vf.HPHM : "";
                                nw.HPZLNAME = vf != null ? vf.HPZL : "";
                                nw.CJH = vf != null ? vf.CLSBDH : "";

                                nw.KEY6 = px.XH;
                                nw.GLLSH = px.YWLSH;
                                nw.STARTTIME = px.ENDTITIME;
                                nw.OPERID = px.JBRID;
                                nw.OPERNAME = px.JBR;
                                nw.ZT = "0";
                                nw.HCZT = "0";
                                nw.CREATETIME = DateTime.Now;
                                db1.WARNLOG.Add(nw);
                                db1.SaveChanges();
                                foreach (var host in MvcApplication.SocketHosts.ToList())
                                {
                                    host.socket.Send("Warning@" + DateTime.Now.ToShortTimeString() + "  大厅业务-" + px.CK + "-黑名单预警 - " + nw.OPLX);

                                }
                            }
                            if (rdv.driver1 != null&&1>2)
                            {

                                //驾驶人异常
                                if (rdv.driver1.ZT.IndexOfAny(anyof) >= 0)
                                {

                                    WARNLOG nw = new WARNLOG();
                                    nw.ID = PubMethod.maxid();
                                    nw.DWNO = px.DWNO;
                                    nw.DWMC = px.DWMC;
                                    nw.XTLB = px.YWLSH.Substring(0, 1) == "1" ? "机动车" : "驾驶人";
                                    nw.WARNLX = "大厅业务";
                                    nw.YWLX = ywlx;
                                    nw.WARNLX1 = "黑名单办理";
                                    nw.OPLX = "本人驾驶证异常";
                                    nw.OPLX1 = "";

                                    foreach (var i in anyof)
                                    {
                                        if (rdv.driver1.ZT.IndexOf(i) >= 0)
                                        {
                                            nw.OPLX1 += i;
                                        }
                                    }

                                    nw.SFZMHM = px.BRZJHM;
                                    nw.NAME = rdv.driver1.XM;

                                    nw.HPHM = vf != null ? vf.HPHM : "";
                                    nw.HPZLNAME = vf != null ? vf.HPZL:"";
                                    nw.CJH = vf != null ? vf.CLSBDH : "";
                                    

                                    nw.GLLSH = px.YWLSH;
                                    nw.KEY6 = px.XH;
                                    nw.STARTTIME = px.ENDTITIME;
                                    nw.OPERID = px.JBRID;
                                    nw.OPERNAME = px.JBR;
                                    nw.ZT = "0";
                                    nw.HCZT = "0";
                                    nw.CREATETIME = DateTime.Now;
                                    db1.WARNLOG.Add(nw);
                                    db1.SaveChanges();
                                    foreach (var host in MvcApplication.SocketHosts.ToList())
                                    {
                                        host.socket.Send("Warning@" + DateTime.Now.ToShortTimeString() + "  大厅业务-" + px.CK+"-黑名单预警-" + nw.OPLX);

                                    }
                                }

                            }

                            foreach (veh v in rdv.vehicles1)
                            {
                                WARNLOG nw = new WARNLOG();
                                nw.ID = PubMethod.maxid();
                                nw.DWNO = px.DWNO;
                                nw.DWMC = px.DWMC;
                                nw.XTLB = px.YWLSH.Substring(0, 1) == "1" ? "机动车" : "驾驶人";
                                nw.WARNLX = "大厅业务";
                                nw.YWLX = ywlx;
                                nw.WARNLX1 = "黑名单办理";
                                nw.OPLX = "本人机动车异常";
                                nw.OPLX1 = v.ZT;

                                nw.SFZMHM = v.SFZMHM;
                                nw.NAME = v.SYR;

                                nw.HPHM = v.HPHM;
                                nw.HPZLNAME = v.HPZL;
                                nw.CJH = v.CLSBDH;
                                nw.SYXZ = v.SYXZ;

                                nw.KEY6 = px.XH;
                                nw.GLLSH = px.YWLSH;
                                nw.STARTTIME = px.ENDTITIME;
                                nw.OPERID = px.JBRID;
                                nw.OPERNAME = px.JBR;
                                nw.ZT = "0";
                                nw.HCZT = "0";
                                nw.CREATETIME = DateTime.Now;
                                db1.WARNLOG.Add(nw);
                                db1.SaveChanges();
                                foreach (var host in MvcApplication.SocketHosts.ToList())
                                {
                                    host.socket.Send("Warning@" + DateTime.Now.ToShortTimeString() + "  大厅业务-" + px.CK+"-黑名单预警 - " + nw.OPLX  );

                                }
                            }
                        }
                        if (dlrishmd)
                        {
                            RBLIST rb = rdv.rblist2;
                            if (rb.LX.IndexOf("黑名单")>=0)
                            {
                                WARNLOG nw = new WARNLOG();
                                nw.ID = PubMethod.maxid();
                                nw.DWNO = px.DWNO;
                                nw.DWMC = px.DWMC;
                                nw.XTLB = px.YWLSH.Substring(0, 1) == "1" ? "机动车" : "驾驶人";
                                nw.WARNLX = "大厅业务";
                                nw.YWLX = ywlx;
                                nw.WARNLX1 = "黑名单办理";
                                nw.OPLX = "代理人属于黑名单人员";
                                nw.SFZMHM = px.BRZJHM;
                                nw.NAME = rb.NAME;
                                nw.HPHM = vf != null ? vf.HPHM : "";
                                nw.HPZLNAME = vf != null ? vf.HPZL : "";
                                nw.CJH = vf != null ? vf.CLSBDH : "";

                                nw.KEY6 = px.XH;
                                nw.GLLSH = px.YWLSH;
                                nw.STARTTIME = px.ENDTITIME;
                                nw.OPERID = px.JBRID;
                                nw.OPERNAME = px.JBR;
                                nw.ZT = "0";
                                nw.HCZT = "0";
                                nw.CREATETIME = DateTime.Now;
                                db1.WARNLOG.Add(nw);
                                db1.SaveChanges();
                                foreach (var host in MvcApplication.SocketHosts.ToList())
                                {
                                    host.socket.Send("Warning@" + DateTime.Now.ToShortTimeString() + "  大厅业务-" + px.CK + "-黑名单预警 - " + nw.OPLX);

                                }
                            }
                        }
                    }
                }
                catch(Exception ez)
                {
                    PubMethod.wrlog("warn-hmd", ez.Message);
                }
            }
        }
        public static void run2(string id)
        {
            XfywHmdBlyw(id);
        }
        /// <summary>
        /// 下放业务是黑名单依然办理业务，在业务“办结时触发”
        /// </summary>
        public static void XfywHmdBlyw(string id)
        {
            using (EntitiesTrff db3 = new EntitiesTrff())
            using (EntitiesXfyw db2 = new EntitiesXfyw())
                using(EntitiesDtgl db1=new EntitiesDtgl())
            using (EntitiesHmd db4 = new EntitiesHmd())
            {
                try
                {
                    BUSINESS_FLOW bf = (from p in db2.BUSINESS_FLOW where p.ID == id select p).First();
                    if (bf.ISHMD != "00" && bf.QUERYZT == "完毕")
                    {
                        RDV rdv = JsonConvert.DeserializeObject<RDV>(bf.DRVANDVEHINFO);
                        char[] anyof = { 'D', 'H', 'Z', 'M', 'S', 'U', 'R' };
                        Boolean brishmd = bf.ISHMD.Substring(0, 1) == "1" ? true : false;
                        Boolean dlrishmd = bf.ISHMD.Substring(1, 1) == "1" ? true : false;


                        /**------------------**/
                        if (brishmd)
                        {
                            if (rdv.driver1 != null)
                            {
                                RBLIST rb = rdv.rblist1;
                                if (rb.LX.IndexOf("黑名单") >= 0)
                                {
                                    WARNLOG nw = new WARNLOG();
                                    nw.ID = PubMethod.maxid();
                                    nw.DWNO = bf.DWNO;
                                    nw.DWMC = bf.DWMC;
                                    nw.XTLB = bf.XTLB;
                                    nw.WARNLX = "下放业务";
                                    nw.YWLX = bf.YWLX;
                                    nw.WARNLX1 = "黑名单办理";
                                    nw.OPLX = "本人属于黑名单人员";
                                    nw.SFZMHM = bf.BRZJHM;
                                    nw.NAME = rb.NAME;

                                    nw.KEY6 = bf.ID;
                                    nw.GLLSH = bf.CJGLSH;
                                    nw.STARTTIME = bf.OPER1TIME1;
                                    nw.OPERID = bf.OPER;
                                    nw.OPERNAME = bf.OPER;
                                    nw.ZT = "0";
                                    nw.HCZT = "0";
                                    nw.CREATETIME = DateTime.Now;
                                    db1.WARNLOG.Add(nw);
                                    db1.SaveChanges();
                                    foreach (var host in MvcApplication.SocketHosts.ToList())
                                    {
                                        host.socket.Send("Warning@" + DateTime.Now.ToShortTimeString() + "  下放业务-" + bf.DWMC + "-黑名单预警-" + nw.OPLX);


                                    }
                                }

                                //驾驶人异常
                                if (rdv.driver1.ZT.IndexOfAny(anyof) >= 0)
                                {

                                    WARNLOG nw = new WARNLOG();
                                    nw.ID = PubMethod.maxid();
                                    nw.DWNO = bf.DWNO;
                                    nw.DWMC = bf.DWMC;
                                    nw.XTLB = bf.XTLB;
                                    nw.WARNLX = "下放业务";
                                    nw.YWLX = bf.YWLX;
                                    nw.WARNLX1 = "黑名单办理";
                                    nw.OPLX = "本人驾驶证异常";
                                    nw.OPLX1 = "";

                                    foreach (var i in anyof)
                                    {
                                        if (rdv.driver1.ZT.IndexOf(i) >= 0)
                                        {
                                            nw.OPLX1 += i;
                                        }
                                    }

                                    nw.SFZMHM = bf.BRZJHM;
                                    nw.NAME = rdv.driver1.XM;

                                    nw.KEY6 = bf.ID;
                                    nw.GLLSH = bf.CJGLSH;
                                    nw.STARTTIME = bf.OPER1TIME1;
                                    nw.OPERID = bf.OPER;
                                    nw.OPERNAME = bf.OPER;
                                    nw.ZT = "0";
                                    nw.HCZT = "0";
                                    nw.CREATETIME = DateTime.Now;
                                    db1.WARNLOG.Add(nw);
                                    db1.SaveChanges();
                                    foreach (var host in MvcApplication.SocketHosts.ToList())
                                    {
                                        host.socket.Send("Warning@" + DateTime.Now.ToShortTimeString() + "  下放业务-" + bf.DWMC + "-黑名单预警-" + nw.OPLX);

                                    }
                                }

                            }

                            foreach (veh v in rdv.vehicles1)
                            {
                                WARNLOG nw = new WARNLOG();
                                nw.ID = PubMethod.maxid();
                                nw.DWNO = bf.DWNO;
                                nw.DWMC = bf.DWMC;
                                nw.XTLB = bf.XTLB;
                                nw.WARNLX = "下放业务";
                                nw.YWLX = bf.YWLX;
                                nw.WARNLX1 = "黑名单办理";
                                nw.OPLX = "本人机动车异常";
                                nw.OPLX1 = v.ZT;

                                nw.SFZMHM = v.SFZMHM;
                                nw.NAME = v.SYR;

                                nw.HPHM = v.HPHM;
                                nw.HPZLNAME = v.HPZL;
                                nw.CJH = v.CLSBDH;
                                nw.SYXZ = v.SYXZ;

                                nw.KEY6 = bf.ID;
                                nw.GLLSH = bf.CJGLSH;
                                nw.STARTTIME = bf.OPER1TIME1;
                                nw.OPERID = bf.OPER;
                                nw.OPERNAME = bf.OPER;
                                nw.ZT = "0";
                                nw.HCZT = "0";
                                nw.CREATETIME = DateTime.Now;
                                db1.WARNLOG.Add(nw);
                                db1.SaveChanges();
                                foreach (var host in MvcApplication.SocketHosts.ToList())
                                {
                                    host.socket.Send("Warning@" + DateTime.Now.ToShortTimeString() + "  下放业务-" + bf.DWMC + "-黑名单预警-" + nw.OPLX);


                                }
                            }
                        }
                        if (dlrishmd)
                        {
                            RBLIST rb = rdv.rblist2;
                            if (rb.LX.IndexOf("黑名单") >= 0)
                            {
                                WARNLOG nw = new WARNLOG();
                                nw.ID = PubMethod.maxid();
                                nw.DWNO = bf.DWNO;
                                nw.DWMC = bf.DWMC;
                                nw.XTLB = bf.XTLB;
                                nw.WARNLX = "下放业务";
                                nw.YWLX = bf.YWLX;
                                nw.WARNLX1 = "黑名单办理";
                                nw.OPLX = "代理人属于黑名单人员";
                                nw.SFZMHM = bf.BRZJHM;
                                nw.NAME = rb.NAME;

                                nw.KEY6 = bf.ID;
                                nw.GLLSH = bf.CJGLSH;
                                nw.STARTTIME = bf.OPER1TIME1;
                                nw.OPERID = bf.OPER;
                                nw.OPERNAME = bf.OPER;
                                nw.ZT = "0";
                                nw.HCZT = "0";
                                nw.CREATETIME = DateTime.Now;
                                db1.WARNLOG.Add(nw);
                                db1.SaveChanges();
                                foreach (var host in MvcApplication.SocketHosts.ToList())
                                {
                                    host.socket.Send("Warning@" + DateTime.Now.ToShortTimeString() + "  下放业务-" + bf.DWMC + "-黑名单预警-" + nw.OPLX);


                                }
                            }
                        }
                    }
                }
                catch (Exception ez)
                {
                    PubMethod.wrlog("warn-hmd", ez.Message);
                }
            }
        }

        /// <summary>
        /// 超过代办次数预警
        /// </summary>
        /// <param name="id"></param>
        public static void MaxAgentCountYj(string id)
        {
            DateTime day = DateTime.Now;
            int dbcs = int.Parse((from p in MvcApplication.SysConfigs where p.LX == "系统" && p.KEYWORD == "JRHMDDBCSXZ" select p).First().V1);
            int count;
            using (EntitiesDtgl db = new EntitiesDtgl())
            using (EntitiesXfyw db1 = new EntitiesXfyw())
            using (EntitiesHmd db3=new EntitiesHmd())
            {
                try
                {
                    AGENT ag = (from p in db3.AGENT where p.ID == id select p).First();
                    RBLIST rb = null;
                    PDXX px = null;
                    BUSINESS_FLOW bf= null;
                    string ywlx = "";
                    string xtlb = "";
                    VEH_FLOW vf = null;
                    if (ag.YWZL== "大厅业务")
                    {
                        px = (from p in db.PDXX where p.XH == ag.PID select p).First();
                        /**--------查业务流水----------**/

                        Hashtable flow = ywlsh.QueryFlow(px.YWLSH);
                        ywlx = flow["ywlx"] as string;
                        xtlb = flow["lx"] as string;

                        try
                        {
                            vf = flow["result"] as VEH_FLOW;
                        }
                        catch
                        {

                        }
                    }
                    if(ag.YWZL == "下放业务")
                    {
                        bf = (from p in db1.BUSINESS_FLOW where p.ID == ag.PID select p).First();
                        ywlx = bf.YWLX;
                        xtlb = bf.XTLB;
                    }
                    try
                    {
                        rb = (from p in db3.RBLIST where p.SFZHM == ag.DLRZJHM && p.LX == "红名单"&&p.ZT== "有效" select p).First();
                    }
                    catch { }
                    if (rb == null)
                    {
                         count= (from p in db3.AGENT where p.DLRZJHM == ag.DLRZJHM && p.ADDTIME.Value.Year == day.Year select p).Count();
                        if (count > dbcs)
                        {
                            WARNLOG nw = new WARNLOG();
                            nw.ID = PubMethod.maxid();
                            nw.DWNO = ag.YWZL == "大厅业务"?px.DWNO:bf.DWNO;
                            nw.DWMC = ag.YWZL == "大厅业务"?px.DWMC:bf.DWMC;
                            nw.XTLB = xtlb;
                            nw.WARNLX = ag.YWZL;
                            nw.YWLX = ywlx;
                            nw.WARNLX1 = "违规代办";
                            nw.OPLX = "代办次数超过限制";
                            nw.OPLX1 = "";

                            nw.SFZMHM = ag.YWZL == "大厅业务" ? px.DLRZJHM:bf.DLRZJHM;
                            nw.NAME = ag.YWZL == "大厅业务" ? px.DLRNAME : bf.DLRNAME;

                            nw.HPHM = ag.YWZL == "大厅业务"?( vf != null ? vf.HPHM : ""):bf.HPHM;
                            nw.HPZLNAME = ag.YWZL == "大厅业务" ? (vf != null ? vf.HPZL : "") : bf.HPHM;
                            nw.CJH = ag.YWZL == "大厅业务" ? (vf != null ? vf.CLSBDH : "") : bf.HPHM;

                            nw.KEY6= ag.YWZL == "大厅业务" ? px.XH : bf.ID;
                            nw.GLLSH = ag.YWZL == "大厅业务" ? px.YWLSH:bf.CJGLSH;
                            nw.STARTTIME = ag.YWZL == "大厅业务" ? px.ENDTITIME: DateTime.Now;
                            nw.OPERID = ag.YWZL == "大厅业务" ? px.JBRID:bf.OPER;
                            nw.OPERNAME = ag.YWZL == "大厅业务" ? px.JBR:bf.OPER;
                            nw.ZT = "0";
                            nw.HCZT = "0";
                            nw.CREATETIME = DateTime.Now;
                            db.WARNLOG.Add(nw);
                            db.SaveChanges();
                            foreach (var host in MvcApplication.SocketHosts.ToList())
                            {
                                host.socket.Send("Warning@" + DateTime.Now.ToShortTimeString() + " "+ag.YWZL+"-" +nw.DWMC+"-"+nw.WARNLX1+"-" + nw.OPLX);

                            }
                        }
                    }
                    else if(rb.DLFW=="本单位")
                    {
                        if (ag.BRZJHM != rb.ZZJGDM)
                        {
                            WARNLOG nw = new WARNLOG();
                            nw.ID = PubMethod.maxid();
                            nw.DWNO = ag.YWZL == "大厅业务" ? px.DWNO : bf.DWNO;
                            nw.DWMC = ag.YWZL == "大厅业务" ? px.DWMC : bf.DWMC;
                            nw.XTLB = xtlb;
                            nw.WARNLX = ag.YWZL;
                            nw.YWLX = ywlx;
                            nw.WARNLX1 = "违规代办";
                            nw.OPLX = "代办非授权单位";
                            nw.OPLX1 = "";

                            nw.SFZMHM = ag.YWZL == "大厅业务" ? px.DLRZJHM : bf.DLRZJHM;
                            nw.NAME = ag.YWZL == "大厅业务" ? px.DLRNAME : bf.DLRNAME;

                            nw.HPHM = ag.YWZL == "大厅业务" ? (vf != null ? vf.HPHM : "") : bf.HPHM;
                            nw.HPZLNAME = ag.YWZL == "大厅业务" ? (vf != null ? vf.HPZL : "") : bf.HPHM;
                            nw.CJH = ag.YWZL == "大厅业务" ? (vf != null ? vf.CLSBDH : "") : bf.HPHM;

                            nw.KEY6 = ag.YWZL == "大厅业务" ? px.XH : bf.ID;
                            nw.GLLSH = ag.YWZL == "大厅业务" ? px.YWLSH : bf.CJGLSH;
                            nw.STARTTIME = ag.YWZL == "大厅业务" ? px.ENDTITIME : DateTime.Now;
                            nw.OPERID = ag.YWZL == "大厅业务" ? px.JBRID : bf.OPER;
                            nw.OPERNAME = ag.YWZL == "大厅业务" ? px.JBR : bf.OPER;
                            nw.ZT = "0";
                            nw.HCZT = "0";
                            nw.CREATETIME = DateTime.Now;
                            db.WARNLOG.Add(nw);
                            db.SaveChanges();
                            foreach (var host in MvcApplication.SocketHosts.ToList())
                            {
                                host.socket.Send("Warning@" + DateTime.Now.ToShortTimeString() + " " + ag.YWZL + "-" + nw.DWMC + "-" + nw.WARNLX1 + "-" + nw.OPLX);

                            }

                            //---------------------
                            count = (from p in db3.AGENT where p.DLRZJHM == ag.DLRZJHM&&p.BRZJHM!=rb.ZZJGDM && p.ADDTIME.Value.Year == day.Year select p).Count();
                            if (count >dbcs)
                            {
                                WARNLOG nw1 = new WARNLOG();
                                nw1.ID = PubMethod.maxid();
                                nw1.DWNO = ag.YWZL == "大厅业务" ? px.DWNO : bf.DWNO;
                                nw1.DWMC = ag.YWZL == "大厅业务" ? px.DWMC : bf.DWMC;
                                nw1.XTLB = xtlb;
                                nw1.WARNLX = ag.YWZL;
                                nw1.YWLX = ywlx;
                                nw1.WARNLX1 = "违规代办";
                                nw1.OPLX = "代办次数超过限制";
                                nw1.OPLX1 = "";

                                nw1.SFZMHM = ag.YWZL == "大厅业务" ? px.DLRZJHM : bf.DLRZJHM;
                                nw1.NAME = ag.YWZL == "大厅业务" ? px.DLRNAME : bf.DLRNAME;

                                nw1.KEY6 = ag.YWZL == "大厅业务" ? px.XH : bf.ID;
                                nw1.GLLSH = ag.YWZL == "大厅业务" ? px.YWLSH : bf.CJGLSH;
                                nw1.STARTTIME = ag.YWZL == "大厅业务" ? px.ENDTITIME : DateTime.Now;
                                nw1.OPERID = ag.YWZL == "大厅业务" ? px.JBRID : bf.OPER;
                                nw1.OPERNAME = ag.YWZL == "大厅业务" ? px.JBR : bf.OPER;
                                nw1.ZT = "0";
                                nw1.HCZT = "0";
                                nw1.CREATETIME = DateTime.Now;
                                db.WARNLOG.Add(nw1);
                                db.SaveChanges();
                                foreach (var host in MvcApplication.SocketHosts.ToList())
                                {
                                    host.socket.Send("Warning@" + DateTime.Now.ToShortTimeString() + " " + ag.YWZL + "-" + nw1.DWMC + "-" + nw1.WARNLX1 + "-" + nw1.OPLX);

                                }
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