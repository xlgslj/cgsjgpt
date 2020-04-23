using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using cgsjgpt.Models;
using cgsjgpt.userclass.method;
using Newtonsoft.Json;
namespace cgsjgpt.userclass.warn
{
    public class ywlsh
    {
        public static void run(string id)
        {
            Dtywlshyj(id);
        }
        //大厅办理,办结流水好录入错误预警，只判断正确否
        public static void Dtywlshyj(string id)
        {
            try
            {
                using (EntitiesDtgl db = new EntitiesDtgl())
                {
                    PDXX px = (from p in db.PDXX where p.XH == id select p).First();
                    Hashtable flow = QueryFlow(px.YWLSH);
                    Boolean lshistrue;
                    lshistrue = (flow["true"] as string) == "0" ? false : true;
                    if (!lshistrue)
                    {
                        WARNLOG nw = new WARNLOG();
                        nw.ID = PubMethod.maxid();
                        nw.DWNO = px.DWNO;
                        nw.DWMC = px.DWMC;
                        nw.XTLB = px.YWLSH.Substring(0, 1) == "1" ? "机动车" : "驾驶人";
                        nw.WARNLX = "大厅业务";
                        nw.WARNLX1 = "流水号异常";
                        nw.OPLX = "流水号输入不正确";

                        nw.SFZMHM = px.BRZJHM;
                        nw.NAME = px.BRNAME;

                        nw.KEY6 = px.XH;
                        nw.GLLSH = px.YWLSH;
                        nw.STARTTIME = px.ENDTITIME;
                        nw.OPERID = px.JBRID;
                        nw.OPERNAME = px.JBR;
                        nw.ZT = "0";
                        nw.HCZT = "0";
                        nw.CREATETIME = DateTime.Now;
                        db.WARNLOG.Add(nw);
                        db.SaveChanges();
                        foreach (var host in MvcApplication.SocketHosts.ToList())
                        {
                            host.socket.Send("Warning@" + DateTime.Now.ToShortTimeString() + "  大厅业务-" + px.CK + "-流水号异常预警-" + nw.OPLX);

                        }
                    }
                }
            }
            catch
            {

            }
        }
        /// <summary>
        /// 下放业务流水号预警，只判断正确否
        /// </summary>
        /// <param name="id"></param>
        public static void Xfywywlshyj(string id)
        {
            try
            {
                using (EntitiesXfyw db = new EntitiesXfyw())
                using (EntitiesDtgl db1 = new EntitiesDtgl())
                {
                    BUSINESS_FLOW px = (from p in db.BUSINESS_FLOW where p.ID == id select p).First();
                    Hashtable flow = QueryFlow(px.CJGLSH);
                    Boolean lshistrue;
                    lshistrue = (flow["true"] as string) == "0" ? false : true;
                    if (!lshistrue)
                    {
                        WARNLOG nw = new WARNLOG();
                        nw.ID = PubMethod.maxid();
                        nw.DWNO = px.DWNO;
                        nw.DWMC = px.DWMC;
                        nw.XTLB = px.XTLB;
                        nw.YWLX = px.YWLX;
                        nw.WARNLX = "下放业务";
                        nw.WARNLX1 = "流水号异常";
                        nw.OPLX = "流水号输入不正确";

                        nw.SFZMHM = px.BRZJHM;
                        nw.NAME = px.BRNAME;
                        nw.HPZLNAME = px.XTLB == "机动车" ? px.HPZL : "";
                        nw.HPHM = px.XTLB == "机动车" ? px.HPHM : "";
                        nw.CJH = px.XTLB == "机动车" ? px.CLSBDH : "";

                        nw.KEY6 = px.ID;
                        nw.GLLSH = px.CJGLSH;
                        nw.STARTTIME = DateTime.Now;
                        nw.OPERID = px.OPER;
                        nw.OPERNAME = px.OPER;
                        nw.ZT = "0";
                        nw.HCZT = "0";
                        nw.CREATETIME = DateTime.Now;
                        db1.WARNLOG.Add(nw);
                        db1.SaveChanges();
                        foreach (var host in MvcApplication.SocketHosts.ToList())
                        {
                            host.socket.Send("Warning@" + DateTime.Now.ToShortTimeString() + "  下放业务-" + px.DWMC + "-流水号异常预警-" + nw.OPLX);

                        }
                    }
                }
            }
            catch
            {

            }
        }
        /// <summary>
        /// 下放业务未录流水号预警
        /// </summary>
        public static void xfywnolshyj()
        {
            try
            {
                using (EntitiesXfyw db = new EntitiesXfyw())
                using (EntitiesDtgl db1 = new EntitiesDtgl())
                {
                    var bfs = (from p in db.BUSINESS_FLOW where p.ZT.Substring(0, 1) == "1" && p.WARNZT.Substring(0, 1) == "0" select p);
                    foreach(BUSINESS_FLOW px in bfs)
                    {
                        WARNLOG nw = new WARNLOG();
                        nw.ID = PubMethod.maxid();
                        nw.DWNO = px.DWNO;
                        nw.DWMC = px.DWMC;
                        nw.XTLB = px.XTLB;
                        nw.YWLX = px.YWLX;
                        nw.WARNLX = "下放业务";
                        nw.WARNLX1 = "流水号缺失";
                        nw.OPLX = "流水号未按时输入";

                        nw.SFZMHM = px.BRZJHM;
                        nw.NAME = px.BRNAME;
                        nw.HPZLNAME = px.XTLB == "机动车" ? px.HPZL : "";
                        nw.HPHM = px.XTLB == "机动车" ? px.HPHM : "";
                        nw.CJH = px.XTLB == "机动车" ? px.CLSBDH : "";

                        nw.KEY6 = px.ID;
                        nw.GLLSH = px.CJGLSH;
                        nw.STARTTIME = DateTime.Now;
                        nw.OPERID = px.OPER;
                        nw.OPERNAME = px.OPER;
                        nw.ZT = "0";
                        nw.HCZT = "0";
                        nw.CREATETIME = DateTime.Now;
                        db1.WARNLOG.Add(nw);
                        db1.SaveChanges();

                        foreach (var host in MvcApplication.SocketHosts.ToList())
                        {
                            host.socket.Send("Warning@" + DateTime.Now.ToShortTimeString() + "  下放业务-" + px.DWMC + "-流水号异常预警-" + nw.OPLX);

                        }

                        px.WARNZT = "1" + px.WARNZT.Substring(1, 8);
                        db.SaveChanges();
                    }

                }
            }
            catch
            {

            }
        }
        //从同步库将业务流水信息导入到本地后,对新增加的业务流水在本系统内进行比对
        ///1、流水信息在本地没有关联，属于线外办理，预警
        ///2、有关联，则比较办理时间
        /// <summary>
        /// 
        /// </summary>
        public static void YwlshTbkToLocal()
        {
            using (EntitiesDtgl db = new EntitiesDtgl())
            using (EntitiesXfyw db2 = new EntitiesXfyw())
            using(EntitiesSys1 db3=new EntitiesSys1())
            {
                try
                {
                    //机动车
                    var vfs = from p in db3.VVEH_FLOW where p.HDBJ == "0" select p;
                    foreach (VVEH_FLOW v in vfs)
                    {
                        PDXX px = null;
                        BUSINESS_FLOW bf = null;
                        try
                        {
                            px = (from p in db.PDXX where p.YWLSH == v.LSH select p).First();
                        }
                        catch
                        {
                            try
                            {
                                bf = (from p in db2.BUSINESS_FLOW where p.CJGLSH == v.LSH select p).First();
                            }
                            catch
                            {

                            }
                        }
                        if (px == null && bf == null)
                        {
                            //未经本系统就办理了业务，预警
                            WARNLOG nw = new WARNLOG();
                            nw.ID = PubMethod.maxid();
                            nw.DWNO = "";
                            nw.DWMC = "";
                            nw.XTLB = "机动车";
                            nw.YWLX = v.YWLX;
                            nw.WARNLX = "系统比对";
                            nw.WARNLX1 = "违规办理";
                            nw.OPLX = "同步库业务流水信息未在本系统找到对应办理记录";

                            nw.SFZMHM = "";
                            nw.NAME = v.SYR;
                            nw.HPZLNAME = v.HPZL;
                            nw.HPHM = v.HPHM;
                            nw.CJH = v.CLSBDH;


                            nw.KEY6 = "";
                            nw.GLLSH = v.LSH;
                            nw.STARTTIME = DateTime.Now;
                            nw.OPERID = " ";
                            nw.OPERNAME = "";
                            nw.ZT = "0";
                            nw.HCZT = "0";
                            nw.CREATETIME = DateTime.Now;
                            db.WARNLOG.Add(nw);
                            db.SaveChanges();
                            foreach (var host in MvcApplication.SocketHosts.ToList())
                            {
                                host.socket.Send("Warning@" + DateTime.Now.ToShortTimeString() + "  " + nw.WARNLX + "-" + nw.WARNLX1 + "-" + nw.OPLX);

                            }
                        }
                        else if (px != null)
                        {
                            px.LSHHCZT = "1";
                            db.SaveChanges();

                        }
                        else if (bf != null)
                        {
                            bf.LSHHCZT = "1";
                            db2.SaveChanges();
                        }
                      /*  else if (bf != null)
                        {
                            //如实本系统办理，且是下放业务，比较办理时间和审核时间
                            if (((DateTime)v.SQRQ).CompareTo((DateTime)bf.SPTIME1) < 0)
                            {
                                //未经本系统就办理了业务，预警
                                WARNLOG nw = new WARNLOG();
                                nw.ID = PubMethod.maxid();
                                nw.DWNO = bf.DWNO;
                                nw.DWMC = bf.DWMC;
                                nw.XTLB = bf.XTLB;
                                nw.YWLX = bf.YWLX;
                                nw.WARNLX = "下放业务";
                                nw.WARNLX1 = "违规办理";
                                nw.OPLX = "业务办理时间早于本系统审核时间";

                                nw.SFZMHM = bf.BRZJHM;
                                nw.NAME = bf.BRNAME;
                                nw.HPZLNAME = bf.HPZL;
                                nw.HPHM = bf.HPHM;
                                nw.CJH = v.CLSBDH;


                                nw.KEY6 = bf.ID;
                                nw.GLLSH = v.LSH;
                                nw.STARTTIME = bf.OPER1TIME1;
                                nw.OPERID = bf.OPER;
                                nw.OPERNAME = bf.OPER;
                                nw.ZT = "0";
                                nw.HCZT = "0";
                                nw.CREATETIME = DateTime.Now;
                                db.WARNLOG.Add(nw);
                                db.SaveChanges();
                                foreach (var host in MvcApplication.SocketHosts.ToList())
                                {
                                    host.socket.Send("Warning@" + DateTime.Now.ToShortTimeString() + "  "+nw.WARNLX+"-" + nw.WARNLX1 + "-" + nw.OPLX);

                                }
                            }
                        }*/
                        v.HDBJ = "1";
                        db3.SaveChanges();
                    }
                }
                catch(Exception e)
                {
                    PubMethod.wrlog("ywlserr", e.InnerException.InnerException.Message);
                }
                try
                {
                    //机动车
                    var dfs = from p in db3.DDRV_FLOW where p.HDBJ == "0" select p;
                    foreach (DDRV_FLOW d in dfs)
                    {
                        PDXX px = null;
                        BUSINESS_FLOW bf = null;
                        try
                        {
                            px = (from p in db.PDXX where p.YWLSH == d.LSH select p).First();
                        }
                        catch
                        {
                            try
                            {
                                bf = (from p in db2.BUSINESS_FLOW where p.CJGLSH == d.LSH select p).First();
                            }
                            catch
                            {

                            }
                        }
                        if (px == null && bf == null)
                        {
                            //未经本系统就办理了业务，预警
                            WARNLOG nw = new WARNLOG();
                            nw.ID = PubMethod.maxid();
                            nw.DWNO = "";
                            nw.DWMC = "";
                            nw.XTLB = "驾驶人";
                            nw.YWLX = d.YWLX;
                            nw.WARNLX = "系统比对";
                            nw.WARNLX1 = "违规办理";
                            nw.OPLX = "同步库业务流水信息未在本系统找到对应办理记录";

                            nw.SFZMHM = d.SFZMHM;
                            nw.NAME = d.XM;
                            nw.HPZLNAME = "";
                            nw.HPHM = "";
                            nw.CJH = "";


                            nw.KEY6 = "";
                            nw.GLLSH = d.LSH;
                            nw.STARTTIME = DateTime.Now;
                            nw.OPERID = " ";
                            nw.OPERNAME = "";
                            nw.ZT = "0";
                            nw.HCZT = "0";
                            nw.CREATETIME = DateTime.Now;
                         
                            db.WARNLOG.Add(nw);
                            db.SaveChanges();
                            foreach (var host in MvcApplication.SocketHosts.ToList())
                            {
                                host.socket.Send("Warning@" + DateTime.Now.ToShortTimeString() + "  " + nw.WARNLX + "-" + nw.WARNLX1 + "-" + nw.OPLX);

                            }
                        }
                        else if (px != null)
                        {
                            px.LSHHCZT = "1";
                            db.SaveChanges();

                        }
                        else if (bf != null)
                        {
                            bf.LSHHCZT = "1";
                            db2.SaveChanges();
                        }
                        /* else if (bf != null)
                         {
                             //如实本系统办理，且是下放业务，比较办理时间和审核时间
                             if (((DateTime)d.KSSJ).CompareTo((DateTime)bf.SPTIME1) < 0)
                             {
                                 //未经本系统就办理了业务，预警
                                 WARNLOG nw = new WARNLOG();
                                 nw.ID = PubMethod.maxid();
                                 nw.DWNO = bf.DWNO;
                                 nw.DWMC = bf.DWMC;
                                 nw.XTLB = bf.XTLB;
                                 nw.YWLX = bf.YWLX;
                                 nw.WARNLX = "下放业务";
                                 nw.WARNLX1 = "违规办理";
                                 nw.OPLX = "业务办理时间早于本系统审核时间";

                                 nw.SFZMHM = bf.BRZJHM;
                                 nw.NAME = bf.BRNAME;
                                 nw.HPZLNAME = bf.HPZL;
                                 nw.HPHM = bf.HPHM;
                                 nw.CJH = "";


                                 nw.KEY6 = bf.ID;
                                 nw.GLLSH = d.LSH;
                                 nw.STARTTIME = bf.OPER1TIME1;
                                 nw.OPERID = bf.OPER;
                                 nw.OPERNAME = bf.OPER;
                                 nw.ZT = "0";
                                 nw.HCZT = "0";
                                 nw.CREATETIME = DateTime.Now;
                                 db.WARNLOG.Add(nw);
                                 db.SaveChanges();
                                 foreach (var host in MvcApplication.SocketHosts.ToList())
                                 {
                                     host.socket.Send("Warning@" + DateTime.Now.ToShortTimeString() + "  " + nw.WARNLX + "-" + nw.WARNLX1 + "-" + nw.OPLX);

                                 }
                             }
                         }*/
                        d.HDBJ = "1";
                        db3.SaveChanges();
                    }
                }
                catch(Exception e)
                {
                    PubMethod.wrlog("ywlserr",e.InnerException.InnerException.Message);
                }
            }

        }



        public static Hashtable QueryFlow(string lsh)
        {
            Hashtable ret = new Hashtable();
            Boolean istrue = true;
            if (lsh.Length != 13) istrue = false;
            if (lsh.Substring(0, 1) != "1" && lsh.Substring(0, 1) != "2") istrue = false;
            try
            {
                long n = long.Parse(lsh);
            }
            catch
            {
                istrue = false;
            }
            ret["true"] = "1";
            if (!istrue) ret["true"] = "0";
            else
            {
                
                using (EntitiesTrff db3 = new EntitiesTrff())
                {
                    if (lsh.Substring(0, 1) == "1")
                    {
                      
                        ret["lx"] = "机动车";
                        try
                        {
                            VEH_FLOW vf= db3.Database.SqlQuery<VEH_FLOW>("select * from veh_flow where lsh='" + lsh + "'").First();
                            ret["result"] = vf;
                            ret["ywlx"] = vf.YWLX;
                            ret["restrue"] = "1";
                        }
                        catch
                        {
                            ret["ywlx"] = "";
                            ret["restrue"] = "0";
                        }
                    }
                    if (lsh.Substring(0, 1) == "2")
                    {
                        ret["lx"] = "驾驶人";
                        try
                        {
                            DRV_FLOW df = db3.Database.SqlQuery<DRV_FLOW>("select * from drv_flow where lsh='" + lsh + "'").First();
                            ret["result"] = df;
                            ret["ywlx"] = df.YWLX;
                            ret["restrue"] = "1";
                        }
                        catch
                        {
                            ret["ywlx"] = "";
                            ret["restrue"] = "0";
                        }
                    }
                }
            }
            //PubMethod.wrlog("ywlshret", JsonConvert.SerializeObject(ret));
            return ret;
        }
    }
}