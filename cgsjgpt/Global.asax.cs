using cgsjgpt.Models;
using cgsjgpt.userclass.data;
using cgsjgpt.userclass.method;
using Fleck;
using FluentScheduler;
using System;
using System.Collections.Generic;
using System.Data.Entity.Core.Mapping;
using System.Data.Entity.Core.Metadata.Edm;
using System.Data.Entity.Infrastructure;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Net;
using System.Threading;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;

namespace cgsjgpt
{
    public class MvcApplication : System.Web.HttpApplication
    {
        public static List<IWebSocketConnection> allSockets = new List<IWebSocketConnection>();
        public static List<WebSocketHost> SocketHosts = new List<WebSocketHost>();
        public static List<CONFIGBASE> SysConfigs=new List<CONFIGBASE>();
        public static List<CODE> DrvAndVehZts = new List<CODE>();

        protected void Application_Start()
        {
            PubMethod.wrlog("Application_Start：", "start");
            AreaRegistration.RegisterAllAreas();
            GlobalConfiguration.Configure(WebApiConfig.Register);
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);
            // 加上下面这一行，让服务器总是返回详细错误信息
            GlobalConfiguration.Configuration.IncludeErrorDetailPolicy
                = IncludeErrorDetailPolicy.Always;
            //获取系统配置
            GetSysConfigs();
            //初始化任务管理器
            JobManager.Initialize(new MyRegistry());
            startWS();
            PubMethod.wrlog("Application_Start：", "end");
        }
        //  在应用程序关闭时运行的代码  
        protected void Application_End(object sender, EventArgs e)
        {
            //下面的代码是关键，可解决IIS应用程序池自动回收的问题  

            Thread.Sleep(1000);
            PubMethod.wrlog("Application_End：", "start");
            try
            {
                //这里设置你的web地址，可以随便指向你的任意一个aspx页面甚至不存在的页面，目的是要激发Application_Start  
                string url = "http://127.0.0.1/api/Login/InLogin";
                HttpWebRequest myHttpWebRequest = (HttpWebRequest)WebRequest.Create(url);
                HttpWebResponse myHttpWebResponse = (HttpWebResponse)myHttpWebRequest.GetResponse();
                Stream receiveStream = myHttpWebResponse.GetResponseStream();//得到回写的字节流  
                //PubMethod.wrlog("appret", receiveStream.ToString());
                PubMethod.wrlog("Application_End：", "ok");
            }
            catch(Exception e1)
            {
                PubMethod.wrlog("Application_Enderror：", e1.Message);
            }
        }

        public void GetSysConfigs()
        {
            try
            {

                using (cgsjgpt.Models.Entities db = new Entities())
                {
                    var source1 = (from p in db.CONFIGBASE where p.LX == "系统" select p);
                    foreach(CONFIGBASE c in source1)
                    {
                        SysConfigs.Add(c);
                    }
                    var source2 = (from p in db.CODE where p.PTLB == "全局" && p.LB == "状态" select p);
                    foreach(CODE c in source2)
                    {
                        DrvAndVehZts.Add(c);
                    }
                   
                }
            }
            catch
            {

            }
        }

        public void startWS()
        {
            FleckLog.Level = LogLevel.Debug;
            var server = new WebSocketServer("ws://0.0.0.0:9811");
            server.Start(socket =>
            {
                socket.OnOpen = () =>
                {
                    string[] path = socket.ConnectionInfo.Path.Split(new char[] { '/'});
                    WebSocketHost host = new WebSocketHost();
                    host.id = socket.ConnectionInfo.Id.ToString();
                    host.app = path[1];
                    host.token = path[2];
                    host.idx = path.Length > 3 ? path[3] : "";
                    host.socket = socket;
                    SocketHosts.Add(host);
                    //Debug.WriteLine("调试内容输出……");
                    //allSockets.Add(socket);
                    //PubMethod.wrlog("hosts",host.token);
                };
                socket.OnClose = () =>
                {
                    //PubMethod.wrlog("socket.close", allSockets.Count.ToString() + "-" + SocketHosts.Count.ToString());
                    WebSocketHost host = SocketHosts.Find(p => p.id == socket.ConnectionInfo.Id.ToString());
                    SocketHosts.Remove(host);

                    IWebSocketConnection s = allSockets.Find(p => p.ConnectionInfo.Id == socket.ConnectionInfo.Id);
                    allSockets.Remove(s);
                   
                };
                socket.OnMessage = message =>
                {
                   
                    //PubMethod.wrlog("socket.message", "message");
                };
            });
        }
    }
}
