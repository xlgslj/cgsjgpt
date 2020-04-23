using cgsjgpt.Models;
using Fleck;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace cgsjgpt.userclass.data
{
    public class Result
    {
        public string Msg { get; set; }
    }
    public class Result<m1>
    {
        public string Msg { get; set; }
        public m1 memo1 { get; set; }
    }
    public class Result<m1,  d1>
    {
        public string Msg { get; set; }
        public m1 memo1 { get; set; }
        public List<d1> Data { get; set; }
    }
    public class Result<m1, d1,d2>
    {
        public string Msg { get; set; }
        public m1 memo1 { get; set; }
        public List<d1> Data { get; set; }
        public List<d2> Data1 { get; set; }
    }
    public class Result<m1, m2, d1, d2, d3>
    {
        public string Msg { get; set; }
        public m1 memo1 { get; set; }
        public m2 memo2 { get; set; }
        public List<d1> Data { get; set; }
        public List<d2> Data1 { get; set; }
        public List<d3> Data2 { get; set; }
    }

    public class Result<m1, m2, d1, d2, d3,d4>
    {
        public string Msg { get; set; }
        public string Err { get; set; }
        public m1 memo1 { get; set; }
        public m2 memo2 { get; set; }
        public List<d1> Data { get; set; }
        public List<d2> Data1 { get; set; }
        public List<d3> Data2 { get; set; }
        public List<d4> Data3 { get; set; }

    }
    public class ResultToLay<m1>
    {
        public int code { get; set; }
        public string msg { get; set; }
        public int count { get; set; }
        public List<m1> data { get; set; }
    }
    /// <summary>
    /// 窗口业务类型
    /// </summary>
    public class CkYwlx
    {
        public string ID { get; set; }
        public string NAME { get; set; }
        public string CODE { get; set; }
        public string MEMO { get; set; }
        public int sort { get; set; }
    }
    /// <summary>
    /// Echart 数据类
    /// </summary>
    public class ResultToEchart
    {
        public List<string> legend { get; set; }
        public List<string> xAxis { get; set; }
        public List<ResultToEchart_Series> series { get; set; }

    }
    public class ResultToEchart_Series
    {
        public string name { get; set; }
        public string type { get; set; }
        public List<float?> data { get; set; }

    }
    public class pdxx_jhqk
    {
        public int xh { set; get; }
        public string ck { set; get; }
        public string oplogid { set; get; }
        public string operid { set; get; }
        public string opername { set; get; }
        public DateTime stime { set; get; }
        public DateTime etime { set; get; }
        public int second { set; get; }
        public string szt { set; get; }
        public string ezt { set; get; }
    }
    public class WebSocketHost
    {
        public string id { get; set; }
        public string token { get; set; }
        public string app { get; set; }
        public string idx { get; set; }
        public IWebSocketConnection socket { get; set; }
    }
    /// <summary>
    /// 下放业务办理资料
    /// </summary>
    public class OXfywBlzl
    {
        public string CODE { get; set; }
        public string NAME { get; set; }
        public string BX { get; set; }
        public string SRC { get; set; }
    }
    public class drv
    {
        public string XM { get; set; }
        public DateTime? CCLZRQ { get; set; }
        public DateTime? YXQZ { get; set; }
        public int? LJJF { get; set; }
        public string ZT { get; set; }

    }
    public class veh
    {
        public string HPHM { get; set; }
        public string HPZL { get; set; }
        public string SYXZ { get; set; }
        public string SYR { get; set; }
        public string SFZMHM { get; set; }
        public string CLSBDH { get; set; }
        public DateTime? YXQZ { get; set; }
        public string ZT { get; set; }

    }
    public class RDV
    {
        public RBLIST rblist1 { get; set; }
        public RBLIST rblist2 { get; set; }

        public drv driver1 { get; set; }
        public List<veh> vehicles1 { get; set; }
        public drv driver2 { get; set; }
        public List<veh> vehicles2 { get; set; }


    }
    public class hpzl
    {
        public string hpzlno { get; set; }
        public string hpname { get; set; }
    }
}