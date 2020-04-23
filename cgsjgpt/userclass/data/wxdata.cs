using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace pzhsykj.userclass.data
{
    public static class WxSetData
    {
        public const string AppId = "wxd6234b8a1fa9f2dd";
        public const string AppSecret = "dff4eca102f13f8fd8a8c5ca02f86502";
    }

    /* public static class HcwwAppData
     {
         public const string AppId = "wxd6234b8a1fa9f2dd";
         public const string AppId1 = "gh_7cebb197ec63";
         public const string AppSecret = "ec5345fd058802814c25dc3ce5a7e3b7";
     }*/
    public static class HcwwAppData
    {
        public const string AppId = "wxdcd68b8351e5e2e5";
        public const string AppId1 = "gh_ab313f63a992";
        public const string AppSecret = "5f3a0a93295ac84366373e07ba043647";
    }
    public static class GkzycAppData
    {
        public const string AppId = "wx4b591ef6cfbceff3";
        public const string AppId1 = "gh_e9694d6dfb86";
        public const string AppSecret = "f7c0996b9669d8b529bea450b69668ab";
    }
    /* public static class PzhjjAppData
     {
         public const string AppId = "wx2bf38b483f41f029";
         public const string AppId1 = "gh_347a219c064a";
         public const string AppSecret = "3e596ceca0a833966ff8829bf4ed4504";
     }*/
    public static class PzhjjAppData
    {
        public const string AppId = "wx740ba99d457a9767";
        public const string AppId1 = "gh_3a564e38256c";
        public const string AppSecret = "f1667f13b6fcfc9e974dfaed050a8e49";
    }
    //微信微薄公众号
    public static class pzhjjgzhAppData
    {
        public const string AppId = "wx9d8d82aae451cc42";
        public const string AppId1 = "gh_6acbc1a0dae9";
        public const string AppSecret = "c351c13dd8a915d1d6d3d13f5fbb5cc9";
    }
    /// <summary>
    /// 微信微薄公众号access_token
    /// </summary>
    public static class Pzhjjgzh_Access_token
    {
        public static string access_token = "";
        public static int expires_in = 0;
        public static long createtime = 0;
    }
    public static class TxCloudData
    {
        public const string AppId = "1255931451";
        public const string SecretId = "AKIDHOHvOd3S4QVLuDFLH9wb9VcU7UcVMVdW";
        public const string SecretKey = "mIadS1MSKxKSLzOaXFiwvfAQSFn6A0bx";
    }
    public static class TxSmsData
    {
        public const string appkey = "7f56dbdac4fe24a6b7d5c9ea46cfd9a1";
        public const string AppID = "1400108566";
    }
    /// <summary>
    /// 花城万维access_token
    /// </summary>
    public static class Hcww_Access_token
    {
        public static string access_token = "";
        public static int expires_in = 0;
        public static long createtime = 0;
    }

    /// <summary>
    /// 小程序access_token
    /// </summary>
    public static class Gkzyc_Access_token
    {
        public static string access_token = "";
        public static int expires_in = 0;
        public static long createtime = 0;
    }
    /// <summary>
    /// 上面静态类的辅助
    /// </summary>
    public class Access_token_result
    {
        public string access_token { get;set;}
        public int expires_in { get; set; }
        public string errcode { get; set; }
        public string errmsg { get; set; }
    }
    /// <summary>
    /// 用户信息类
    /// </summary>
    public class wxuserinfo
    {
        public string openid { get; set; }
        public string nickname { get; set; }
        public string sex { get; set; }
        public string language { get; set; }
        public string province { get; set; }
        public string city { get; set; }
        public string country { get; set; }
        public string headimgurl { get; set; }
        public string[] privilege { get; set; }
        public string unionid { get; set; }
    }

    /// <summary>
    /// 获取登陆信息
    /// </summary>
    public class WxLoginState
    {
         public string openid { get; set; }
        public string session_key { get; set; }
        public string unionid { get; set; }
        public string errcode { get; set; }
        public string errmsg { get; set; }
        public string type { get; set; }
    }
    /// <summary>
    /// 接受微信信息
    /// </summary>
    public class FromWeiXinMsg
    {
        public int Id { get; set; }
        public string ToUserName { get; set;}
        public string FromUserName { get; set; }
        public string CreateTime { get; set; }
        public string MsgType { get; set; }
        public string Event { get; set; }
        public string Content { get; set; }
        public string MsgId { get; set; }
        public string PicUrl { get; set; }
        public string MediaId { get; set; }
        public string SessionFrom { get; set; }
        public string Type { get; set; }
    }
    public class ToWeiXinMsg
    {
        public string ToUserName { get; set; }
        public string FromUserName { get; set; }
        public string CreateTime { get; set; }
        public string MsgType { get; set; }
    }
    /// <summary>
    /// socket 标识
    /// </summary>
    public class socketid_openid
    {
        public string wsid { get; set; }
        public string openid { get; set; }
        public string app { get; set; }
        public string scene { get; set; }
        public string parameter { get; set; }
    }
    /// <summary>
    /// api调用返回值
    /// </summary>
    public class apiresult
    {
        public string errcode { get; set; }
        public string errmsg { get; set; }
    }
    /// <summary>
    /// 微信公众号用户消息类
    /// XML解析
    /// </summary>
    public class WxXmlModel
    {
        /// <summary>
        /// 消息接收方微信号
        /// </summary>
        public string ToUserName { get; set; }
        /// <summary>
        /// 消息发送方微信号
        /// </summary>
        public string FromUserName { get; set; }
        /// <summary>
        /// 创建时间
        /// </summary>
        public string CreateTime { get; set; }
        /// <summary>
        /// 信息类型 地理位置:location,文本消息:text,消息类型:image
        /// </summary>
        public string MsgType { get; set; }
        /// <summary>
        /// 信息内容
        /// </summary>
        public string Content { get; set; }
        /// <summary>
        /// 地理位置纬度
        /// </summary>
        public string Location_X { get; set; }
        /// <summary>
        /// 地理位置经度
        /// </summary>
        public string Location_Y { get; set; }
        /// <summary>
        /// 地图缩放大小
        /// </summary>
        public string Scale { get; set; }
        /// <summary>
        /// 地理位置信息
        /// </summary>
        public string Label { get; set; }
        /// <summary>
        /// 图片链接，开发者可以用HTTP GET获取
        /// </summary>
        public string PicUrl { get; set; }
        /// <summary>
        /// 事件类型，subscribe(订阅/扫描带参数二维码订阅)、unsubscribe(取消订阅)、CLICK(自定义菜单点击事件) 、SCAN（已关注的状态下扫描带参数二维码）
        /// </summary>
        public string Event { get; set; }
        /// <summary>
        /// 事件KEY值
        /// </summary>
        public string EventKey { get; set; }
        /// <summary>
        /// 二维码的ticket，可以用来换取二维码
        /// </summary>
        public string Ticket { get; set; }
        /// <summary>
        /// 媒体ID
        /// </summary>
        public string MediaId { get; set; }
        /// <summary>
        /// 永久素材ID
        /// </summary>
        public string ThumbMediaId { get; set; }
    }
    public class Article
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public string PicUrl { get; set; }
        public string Url { get; set; }
    }
    public static class QrCode
    {
        public const string geturl = "https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=";
    }
}