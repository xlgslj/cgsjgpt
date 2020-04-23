using cgsjgpt.Models;
using FluentScheduler;
using System;
using System.Collections.Generic;
using System.Data.Entity.Core.Objects;
using System.Linq;
using System.Threading;
using System.Web;
using System.Web.Hosting;
using Newtonsoft.Json;
using System.Threading.Tasks;
using System.Data.Entity.Infrastructure;
using System.Data.Entity.Core.Mapping;
using System.Data.Entity.Core.Metadata.Edm;
using System.Net;
using System.IO;
using cgsjgpt.userclass.warn;

namespace cgsjgpt.userclass.method
{
    public class MyRegistry : Registry
    {

        public MyRegistry()
        {
            // Schedule an IJob to run at an interval
            // 立即执行每10秒一次的计划任务。（指定一个时间间隔运行，根据自己需求，可以是秒、分、时、天、月、年等。）
            //Schedule<MyJob>().ToRunNow().AndEvery(10).Seconds();
            // 立即执行每10秒一次的计划任务。如果本次任务没有结束，下一次的任务则不会开始，禁止并行运行
            Schedule<MyJob>().NonReentrant().ToRunNow().AndEvery(60).Seconds();
            //在每天的21：15执行计划任务
            //Schedule(() => Console.WriteLine("It's 9:15 PM now.")).ToRunEvery(1).Days().At(21, 15);
            // 立即执行一个在每月的第一个星期一 3:00 的计划任务
            //Schedule(() => Console.WriteLine("It's 3:00 AM now.")).ToRunNow().AndEvery(1).Months().OnTheFirst(DayOfWeek.Monday).At(3, 0);
            //在每周一的21：15执行计划任务
            // Schedule(() => Console.WriteLine("It's 9:15 PM now.")).ToRunEvery(1).Weeks().On(DayOfWeek.Monday).At(21, 15);



        }
        public class MyJob : IJob, IRegisteredObject
        {
            Entities db = new Entities();
            EntitiesDtgl db2 = new EntitiesDtgl();
            EntitiesTrff db3 = new EntitiesTrff();
            private readonly object _lock = new object();

            private bool _shuttingDown;
            public MyJob()
            {
                HostingEnvironment.RegisterObject(this);
            }
            public void Execute()
            {
                try
                {
                    lock (_lock)
                    {
                        if (_shuttingDown)
                            return;
                        // PubMethod.wrlog("开始工作：", "ok");
                        CreateWarnLog();
                       // PubMethod.wrlog("工作结束：", "ok");
                    }
                }
                finally
                {
                    HostingEnvironment.UnregisterObject(this);
                }

            }
            public void Stop(bool immediate)
            {
                PubMethod.wrlog("调用stop：", "");
                lock (_lock)
                {
                    PubMethod.wrlog("lock结束：", "");
                    _shuttingDown = true;
                }
                HostingEnvironment.UnregisterObject(this);
            }

            public void CreateWarnLog()
            {
                try
                {
                    DateTime now = DateTime.Now;
                    Task taskA = new Task(() => CreateWarnEven());
                    taskA.Start();

                    //整点刷新
                    if (now.Minute == 0 )
                    {
                        PubMethod.wrlog("正点刷新", "ok");
                        foreach (var host in MvcApplication.SocketHosts.ToList())
                        {
                            host.socket.Send("DataUpdate");

                        }
                    }
                    //定时核查下放业务未补录流水号开始时间
                    CONFIGBASE DSHCXFYWWBLLSHKSSJ = (from p in MvcApplication.SysConfigs where p.KEYWORD == "DSHCXFYWWBLLSHKSSJ" select p).First();
                    if (now.Hour == int.Parse(DSHCXFYWWBLLSHKSSJ.V1.Substring(0, 2)) && now.Minute == int.Parse(DSHCXFYWWBLLSHKSSJ.V1.Substring(3, 2)))
                    {
                        Task taskB = new Task(() => cgsjgpt.userclass.warn.ywlsh.xfywnolshyj());
                        taskB.Start();
                    }

                    //时时执行部分
                    //等候超时、办理超时、退办预警
                    Task taskC = new Task(() => DhOrBlOrTb.run());
                    taskC.Start();


                    //定时提取同步库业务流水信息
                    CONFIGBASE TQTBKYWLSXXKSSJ = (from p in MvcApplication.SysConfigs where p.KEYWORD == "TQTBKYWLSXXKSSJ" select p).First();
                    if (now.Hour == int.Parse(TQTBKYWLSXXKSSJ.V1.Substring(0, 2)) && now.Minute == int.Parse(TQTBKYWLSXXKSSJ.V1.Substring(3, 2)))
                    {
                        Task task = new Task(() => cgsjgpt.userclass.flow.GetFlows.run());
                        task.Start();
                    }

                    if(now.Hour >= 0 && now.Hour <= 7 && now.Minute % 10 == 0)
                    {
                        //每日0-7点,每隔10分钟激活一次网站,防止死掉,为执行定时任务
                        try
                        {
                            //这里设置你的web地址，可以随便指向你的任意一个aspx页面甚至不存在的页面，目的是要激发Application_Start  
                            string url = "http://127.0.0.1/api/Login/InLogin";
                            HttpWebRequest myHttpWebRequest = (HttpWebRequest)WebRequest.Create(url);
                            HttpWebResponse myHttpWebResponse = (HttpWebResponse)myHttpWebRequest.GetResponse();
                            Stream receiveStream = myHttpWebResponse.GetResponseStream();//得到回写的字节流  
                            //PubMethod.wrlog("appret", receiveStream.ToString());
                            PubMethod.wrlog("actived","ok");
                        }
                        catch (Exception e1)
                        {
                          
                        }
                    }

                    /*
                    //Trff,连接
                    if (now.Hour >= 7 && now.Hour <= 23 && now.Minute % 10 == 0)
                    {

                        Task taskB = new Task(() => ConnectTrff());
                        taskB.Start();
                    }*/
                }
                catch(Exception e)
                {
                    PubMethod.wrlog("errortask", e.Message);
                }
            }

            public void CreateWarnEven()
            {
                return;
                try
                {
                    Entities dbtask = new Entities();
                    List<CONFIGBASE> conf = (from p in MvcApplication.SysConfigs where p.LX == "系统" select p).ToList();
                    int YJXXSCJGSJ = Convert.ToInt32(conf.Where(p => p.KEYWORD == "YJXXSCJGSJ").First().V1);
                    string kssjstr = conf.Where(p => p.KEYWORD == "YJXXSCSJD").First().V1;
                    string jssjstr = conf.Where(p => p.KEYWORD == "YJXXSCSJD").First().V2;

                    DateTime kssj = Convert.ToDateTime(DateTime.Now.ToString("yyyy-MM-dd") + " " + kssjstr.Substring(0, 2) + ":00:00");
                    DateTime jssj = Convert.ToDateTime(DateTime.Now.ToString("yyyy-MM-dd") + " " + jssjstr.Substring(0, 2) + ":00:00").AddMinutes(5);

                    DateTime now = DateTime.Now;
                    if (now.CompareTo(kssj) >= 0 && now.CompareTo(jssj) <= 0 && now.Minute % YJXXSCJGSJ == 0)
                    {
                        IQueryable<BMDB> bm = from p in db.BMDB orderby p.ID select p;
                        foreach (BMDB b in bm)
                        {
                            IQueryable<WARNLOG> source = from p in db2.WARNLOG
                                                         where p.DWNO == b.ID && p.ZT == "0" && p.OPLX == "窗口业务"
                                    && p.STARTTIME.Value.Year == now.Year && p.STARTTIME.Value.Month == now.Month && p.STARTTIME.Value.Day == now.Day
                                                         select p;
                            var dhcs = (from p in source where p.WARNLX == "等待超时预警" orderby p.KEY2 select new { ywlx = p.OPLX1, xh = p.KEY1, pdhm = p.KEY2, qhsj = p.KEY3 }).ToList();
                            var blcs = (from p in source where p.WARNLX == "办理超时预警" orderby p.KEY2 select new { ywlx = p.OPLX1, xh = p.KEY1, pdhm = p.KEY2, kssj = p.KEY3, ck = p.KEY4, jbr = p.OPERNAME }).ToList();
                            var tbyj = (from p in source where p.WARNLX == "退办预警" orderby p.KEY2 select new { ywlx = p.OPLX1, xh = p.KEY1, pdhm = p.KEY2, kssj = p.KEY3, ck = p.KEY4, jbr = p.OPERNAME }).ToList();
                            if(dhcs.Count>0||blcs.Count>0||tbyj.Count>0)
                            {
                                WARNEVENT w = new WARNEVENT();
                                w.ID = PubMethod.maxid();
                                w.DWNO = b.ID;
                                w.DWMC = b.NAME;
                                w.CREATETIME = now;
                                w.WARNLX = "定时预警";
                                w.CONTENT = (dhcs.Count > 0 ? dhcs.Last().pdhm + " 等共"+dhcs.Count.ToString()+ "笔业务等候超时；    " : "") + (blcs.Count > 0 ? blcs.Last().pdhm + " 等共" + blcs.Count.ToString() + "笔业务办理超时；    " : "") + (tbyj.Count > 0 ? tbyj.Last().pdhm + " 等共"+tbyj.Count.ToString()+ "笔业务退办；" : "") ;
                                w.KEY1 = JsonConvert.SerializeObject(dhcs);
                                w.KEY2 = JsonConvert.SerializeObject(blcs);
                                w.KEY3 = JsonConvert.SerializeObject(tbyj);
                                w.ZT = "0";
                                db2.WARNEVENT.Add(w);
                            }
  
                        }
                        db2.SaveChanges();

                        foreach (var host in MvcApplication.SocketHosts.ToList())
                        {
                            host.socket.Send("Warning");

                        }
                    }
                }
                catch(Exception e)
                {
                    PubMethod.wrlog("CreateWarnEvenerror",e.Message);
                }
                
            }
            public void ConnectTrff()
            {
                try
                {
                    PubMethod.wrlog("TrffTimer", "start");
                    //这里设置你的web地址，可以随便指向你的任意一个aspx页面甚至不存在的页面，目的是要激发Application_Start  
                    string url = "http://127.0.0.1/api/Login/InLogin";
                    HttpWebRequest myHttpWebRequest = (HttpWebRequest)WebRequest.Create(url);
                    HttpWebResponse myHttpWebResponse = (HttpWebResponse)myHttpWebRequest.GetResponse();
                    Stream receiveStream = myHttpWebResponse.GetResponseStream();//得到回写的字节流  
                    PubMethod.wrlog("TrffTimer", "end");                                                        //PubMethod.wrlog("appret", receiveStream.ToString());
                }
                catch (Exception e1)
                {
                    PubMethod.wrlog("TrffTimerError", e1.Message);
                }
            }

            private class wxh
            {
                public string xh { get; set; }
            }
            public void task_bak()
            {
                DateTime now = DateTime.Now;

                //整点刷新
                if (now.Minute == 0 && now.Second == 0)
                {
                    foreach (var host in MvcApplication.SocketHosts.ToList())
                    {
                        host.socket.Send("DataUpdate");

                    }
                }


                IQueryable<BMDB> bm = from p in db.BMDB orderby p.ID select p;
                foreach (BMDB b in bm)
                {
                    try
                    {
                        IQueryable<CONFIGBM> conf = from p in db.CONFIGBM where p.DWNO==b.ID select p;
                        int blsj = conf.Where(p => p.KEYWORD == "PJYWBLSJBZXZ").First().V1==null?0: int.Parse(conf.Where(p => p.KEYWORD == "PJYWBLSJBZXZ").First().V1) * 60;
                        int dhsj = conf.Where(p => p.KEYWORD == "QZPJDHSJBZXZ").First().V1==null?0: int.Parse(conf.Where(p => p.KEYWORD == "QZPJDHSJBZXZ").First().V1) * 60;
                        List<wxh> xhs = (from p in db2.PDXX
                                         where p.DWNO == b.ID
                                        // && p.QHSJ.Value.Year == now.Year && p.QHSJ.Value.Month == now.Month && p.QHSJ.Value.Day == now.Day
                                          && ((p.ZT == "等待叫号" && EntityFunctions.DiffSeconds( p.QHSJ,now) > dhsj) || (p.ZT == "正在办理" && EntityFunctions.DiffSeconds( p.STARTTIME,now) > blsj))
                                         select new wxh { xh = p.XH }).ToList();
                        if (HttpRuntimeCache.Exists("warn-" + b.ID))
                        {
                            List<wxh> cxh = HttpRuntimeCache.Get("warn-" + b.ID) as List<wxh>;
                            Boolean equal = xhs.Count==cxh.Count?true:false;
                            //PubMethod.wrlog("xhs", JsonConvert.SerializeObject(xhs));
                           // PubMethod.wrlog("cxh", JsonConvert.SerializeObject(cxh));

                            if (equal)
                            {
                                foreach (wxh x in xhs)
                                {
                                    if (!cxh.Exists(p => p.xh == x.xh))
                                    {
                                        equal = false;
                                        break;
                                    }
                                }
                                if (equal)
                                {
                                    foreach (wxh x in cxh)
                                    {
                                        if (!xhs.Exists(p => p.xh == x.xh))
                                        {
                                            equal = false;
                                            break;
                                        }
                                    }
                                }
                            }
                            if (!equal)
                            {

                                foreach (var host in MvcApplication.SocketHosts.ToList())
                                {
                                    PubMethod.wrlog("socket", host.socket.ConnectionInfo.ClientIpAddress);
                                    host.socket.Send("Warning");

                                }
                                HttpRuntimeCache.Set("warn-" + b.ID, xhs);
                            }
                        }
                        else
                        {
                                HttpRuntimeCache.Set("warn-" + b.ID, xhs);
                            foreach (var host in MvcApplication.SocketHosts.ToList())
                            {
                                host.socket.Send("Warning");

                            }

                        }
                    }
                    catch(Exception e)
                    {
                        PubMethod.wrlog("error", e.Message);
                    }


                }
            }
        }


    }
}