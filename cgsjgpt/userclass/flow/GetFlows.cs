using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using cgsjgpt.Models;
using cgsjgpt.userclass.method;
using cgsjgpt.userclass.sysFun;
using Newtonsoft.Json;
namespace cgsjgpt.userclass.flow
{
    public class GetFlows
    {
        public static void run()
        {
            GetVehFlows();
            GetDrvFlows();

            warn.ywlsh.YwlshTbkToLocal();
        }
        public static void GetVehFlows()
        {
            using (EntitiesTrff db = new EntitiesTrff())
            using (EntitiesSys1 db1 = new EntitiesSys1())
            using (Entities db2 = new Entities())
            {
                try
                {
                    Log.CreateLog("系统", 9, "", "", "业务流水", "机动车业务流水提取-启动", "", "", "", "", "", "", "");
                    PubMethod.wrlog("vehflow", "start1");
                    var jgbms = (from p in db2.BMDB where p.ISJG == "1" select p.BMNO).ToList() ;
                   // string jgbmstrs = "('" + string.Join("','",jgbms.ToArray()) + "')";
                    CONFIGBASE XTXXRQ = (from p in MvcApplication.SysConfigs where p.KEYWORD == "XTXXRQ" select p).First();
                    DateTime runday = Convert.ToDateTime(XTXXRQ.V1 + " " + "00:00:00");

                    string day = DateTime.Now.AddDays(-10).ToString("yyyy-MM-dd");
                    List<VEH_FLOW> vfs = db.Database.SqlQuery<VEH_FLOW>("select * from VEH_FLOW where to_char(sqrq,'yyyy-mm-dd')>='" + day + "'").ToList();
                    List<VVEH_FLOW> vfs1 = db1.Database.SqlQuery<VVEH_FLOW>("select * from VVEH_FLOW where to_char(sqrq,'yyyy-mm-dd')>='" + day + "'").ToList();
                    List<VVEH_FLOW1> vfs2 = db1.Database.SqlQuery<VVEH_FLOW1>("select * from VVEH_FLOW1 where to_char(sqrq,'yyyy-mm-dd')>='" + day + "'").ToList();

                    PubMethod.wrlog("start", vfs.Count.ToString());
                    foreach (VEH_FLOW v in vfs)
                    {
                        //将受监管单位的流水信息导入本地库(若不存在的话)
                        Boolean isexit = vfs1.Exists(p => p.LSH == v.LSH);
                        bool isjg = jgbms.Exists(p => p == v.GLBM);
                        if (isjg && !isexit)
                        {
                            try
                            {
                                VVEH_FLOW vf = new VVEH_FLOW();
                                vf.LSH = v.LSH;
                                vf.XH = v.XH;
                                vf.YWLX = v.YWLX;
                                vf.YWYY = v.YWYY;
                                vf.SYR = v.SYR;
                                vf.HPZL = v.HPZL;
                                vf.HPHM = v.HPHM;
                                vf.CLPP1 = v.CLPP1;
                                vf.CLXH = v.CLXH;
                                vf.CLLX = v.CLLX;
                                vf.XZQH = v.XZQH;
                                vf.SQRQ = v.SQRQ;
                                vf.BJRQ = v.BJRQ;
                                vf.XYGW = v.XYGW;
                                vf.YWLC = v.YWLC;
                                vf.LSZT = v.LSZT;
                                vf.GLBM = v.GLBM;
                                vf.FPBJ = v.FPBJ;
                                vf.FFBJ = v.FFBJ;
                                vf.RKBJ = v.RKBJ;
                                vf.CLSBDH = v.CLSBDH;
                                vf.LY = v.LY;
                                vf.HDBJ = "0";
                                db1.VVEH_FLOW.Add(vf);
                                db1.SaveChanges();
                            }
                            catch (Exception e)
                            {
                                // PubMethod.wrlog("insertvehflowerror", e.Message);
                            }
                        }
                        //将所有办理临时号牌的流水信息(无论是否是监管单位)导入本地库2(若不存在的话)
                        isexit = vfs2.Exists(p => p.LSH == v.LSH);
                        if (!isexit && v.YWLX == "O")
                        {
                            Task taskA = new Task(() => GetFlows1.AddVvehflow1(v));
                            taskA.Start();
                        }
                        //将所有注册登记/转移登记进行年龄比对,超过60岁预警
                        if (!isexit && (v.YWLX == "A"||v.YWLX=="B"))
                        {
                            Task taskB = new Task(() => GetFlows1.AddVvehflow2(v));
                            taskB.Start();
                        }

                    }
                    PubMethod.wrlog("vehflow", "end");
                    Log.CreateLog("系统", 9, "", "", "业务流水", "机动车业务流水提取-结束", "", "", "", "", "", "", "");
                }
                catch (Exception e)
                {
                    PubMethod.wrlog("vferror", e.InnerException.InnerException.Message);
                }
            }
        }
        public static void GetDrvFlows()
        {
            using (EntitiesTrff db = new EntitiesTrff())
            using (EntitiesSys1 db1 = new EntitiesSys1())
            using (Entities db2=new Entities())
            {
                try
                {
                    Log.CreateLog("系统", 9, "", "", "业务流水", "驾驶人业务流水提取-启动", "", "", "", "", "", "", "");
                    var jgbms = (from p in db2.BMDB where p.ISJG == "1" select p.BMNO).ToList();
                    //string jgbmstrs = "('" + string.Join("','", jgbms.ToArray()) + "')";
                    CONFIGBASE XTXXRQ = (from p in MvcApplication.SysConfigs where p.KEYWORD == "XTXXRQ" select p).First();
                    DateTime runday = Convert.ToDateTime(XTXXRQ.V1 + " " + "00:00:00");

                    string day = DateTime.Now.AddDays(-10).ToString("yyyy-MM-dd");
                    List<DRV_FLOW> dfs = db.Database.SqlQuery<DRV_FLOW>("select * from DRV_FLOW where to_char(kssj,'yyyy-mm-dd')>='" + day + "'").ToList();
                    List<DDRV_FLOW> dfs1 = db1.Database.SqlQuery<DDRV_FLOW>("select * from DDRV_FLOW where to_char(kssj,'yyyy-mm-dd')>='" + day + "'").ToList();
                    PubMethod.wrlog("start", dfs.Count.ToString());
                    foreach (DRV_FLOW d in dfs)
                    {
                        Boolean isexit = dfs1.Exists(p => p.LSH == d.LSH);
                        bool isjg = jgbms.Exists(p => p == d.YWBLBM);
                        if (((DateTime)d.KSSJ).CompareTo(runday) >= 0&&isjg && !isexit)
                        {
                            // PubMethod.wrlog("vehlsh", d.LSH);
                            try
                            {
                                DDRV_FLOW df = new DDRV_FLOW();
                                df.LSH = d.LSH;
                                df.SFZMHM = d.SFZMHM;
                                df.DABH = d.DABH;
                                df.XM = d.XM;
                                df.YWLX = d.YWLX;
                                df.YWYY = d.YWYY;
                                df.KSSJ = d.KSSJ;
                                df.JSSJ = d.JSSJ;
                                df.YWGW = d.YWGW;
                                df.KSKM = d.KSKM;
                                df.XYGW = d.XYGW;
                                df.GLBM = d.GLBM;
                                df.FFBZ = d.FFBZ;
                                df.RKBZ = d.RKBZ;
                                df.HDBZ = d.HDBZ;
                                df.XGZL = d.XGZL;
                                df.ZJCX = d.ZJCX;
                                df.YWZT = d.YWZT;
                                df.YWBLBM = d.YWBLBM;
                                df.FZJG = d.FZJG;
                                df.DCBJ = d.DCBJ;
                                df.HDBJ = "0";
                                db1.DDRV_FLOW.Add(df);
                                db1.SaveChanges();

                            }
                            catch (Exception e)
                            {
                                //PubMethod.wrlog("insertdrvflowerror", e.InnerException.InnerException.Message);

                            }
                        }
                    }
                    PubMethod.wrlog("drvflow", "end");
                    Log.CreateLog("系统", 9, "", "", "业务流水", "驾驶人业务流水提取-结束", "", "", "", "", "", "", "");
                }
                catch (Exception e)
                {
                    PubMethod.wrlog("dferror", e.Message);
                }
            }
        }
    }
}