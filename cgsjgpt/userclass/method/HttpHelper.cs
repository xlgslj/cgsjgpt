using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Xml;

namespace cgsjgpt.userclass.method
{
    public class HttpHelper
    {/// <summary>
     /// 发起POST同步请求
     /// 
     /// </summary>
     /// <param name="url"></param>
     /// <param name="postData"></param>
     /// <param name="contentType">application/xml、application/json、application/text、application/x-www-form-urlencoded</param>
     /// <param name="headers">填充消息头</param>        
     /// <returns></returns>
        public static string HttpPost(string url, string postData = null, string contentType = null, int timeOut = 30, Dictionary<string, string> headers = null)
        {
            postData = postData ?? "";
            using (HttpClient client = new HttpClient())
            {
                if (headers != null)
                {
                    foreach (var header in headers)
                        client.DefaultRequestHeaders.Add(header.Key, header.Value);
                }
                using (HttpContent httpContent = new StringContent(postData, Encoding.UTF8))
                {
                    if (contentType != null)
                        httpContent.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue(contentType);

                    HttpResponseMessage response = client.PostAsync(url, httpContent).Result;
                    return response.Content.ReadAsStringAsync().Result;
                }
            }
        }


        /// <summary>
        /// 发起POST异步请求
        /// </summary>
        /// <param name="url"></param>
        /// <param name="postData"></param>
        /// <param name="contentType">application/xml、application/json、application/text、application/x-www-form-urlencoded</param>
        /// <param name="headers">填充消息头</param>        
        /// <returns></returns>
        public static async Task<string> HttpPostAsync(string url, string postData = null, string contentType = null, int timeOut = 30, Dictionary<string, string> headers = null)
        {
            postData = postData ?? "";
            using (HttpClient client = new HttpClient())
            {
                client.Timeout = new TimeSpan(0, 0, timeOut);
                if (headers != null)
                {
                    foreach (var header in headers)
                        client.DefaultRequestHeaders.Add(header.Key, header.Value);
                }
                using (HttpContent httpContent = new StringContent(postData, Encoding.UTF8))
                {
                    if (contentType != null)
                        httpContent.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue(contentType);

                    HttpResponseMessage response = await client.PostAsync(url, httpContent);
                    return await response.Content.ReadAsStringAsync();
                }
            }
        }

        /// <summary>
        /// 发起GET同步请求
        /// </summary>
        /// <param name="url"></param>
        /// <param name="headers"></param>
        /// <param name="contentType"></param>
        /// <returns></returns>
        public static string HttpGet(string url, string contentType = null, Dictionary<string, string> headers = null)
        {
            using (HttpClient client = new HttpClient())
            {
                if (contentType != null)
                    client.DefaultRequestHeaders.Add("ContentType", contentType);
                if (headers != null)
                {
                    foreach (var header in headers)
                        client.DefaultRequestHeaders.Add(header.Key, header.Value);
                }
                HttpResponseMessage response = client.GetAsync(url).Result;
                return response.Content.ReadAsStringAsync().Result;
            }
        }

        /// <summary>
        /// 发起GET异步请求
        /// </summary>
        /// <param name="url"></param>
        /// <param name="headers"></param>
        /// <param name="contentType"></param>
        /// <returns></returns>
        public static async Task<string> HttpGetAsync(string url, string contentType = null, Dictionary<string, string> headers = null)
        {
            using (HttpClient client = new HttpClient())
            {
                if (contentType != null)
                    client.DefaultRequestHeaders.Add("ContentType", contentType);
                if (headers != null)
                {
                    foreach (var header in headers)
                        client.DefaultRequestHeaders.Add(header.Key, header.Value);
                }
                HttpResponseMessage response = await client.GetAsync(url);
                return await response.Content.ReadAsStringAsync();
            }
        }
        public static string HttpPostWebService(string url, string method,Dictionary<string,string> paras)
        {
            string result = string.Empty;
            string param = string.Empty;
            byte[] bytes = null;

            Stream writer = null;
            HttpWebRequest request = null;
            HttpWebResponse response = null;
            foreach(KeyValuePair<string,string> p in paras)
            {
                
                param += HttpUtility.UrlEncode(p.Key) + "=" + HttpUtility.UrlEncode(p.Value)+"&";
            }
            param = param == string.Empty ? param : param.Substring(0, param.Length - 1);
           // PubMethod.wrlog("cs", param);
             //param = HttpUtility.UrlEncode("hpzl") + "=" + HttpUtility.UrlEncode(hpzl) + "&" + HttpUtility.UrlEncode("hphm1") + "=" + HttpUtility.UrlEncode(hphm);
           
            bytes = Encoding.UTF8.GetBytes(param);

            request = (HttpWebRequest)WebRequest.Create(url + "/" + method);
            request.Method = "POST";
            request.ContentType = "application/x-www-form-urlencoded";
            request.ContentLength = bytes.Length;

            try
            {
                writer = request.GetRequestStream();        //获取用于写入请求数据的Stream对象
            }
            catch (Exception ex)
            {
                return "";
            }

            writer.Write(bytes, 0, bytes.Length);       //把参数数据写入请求数据流
            writer.Close();
            try
            {
                response = (HttpWebResponse)request.GetResponse();      //获得响应
            }
            catch (WebException ex)
            {
                PubMethod.wrlog("error", ex.Message);
                return "";
            }
            #region 这种方式读取到的是一个返回的结果字符串
            Stream stream = response.GetResponseStream();        //获取响应流
            XmlTextReader Reader = new XmlTextReader(stream);
            Reader.MoveToContent();
            result = Reader.ReadInnerXml();
            #endregion

            #region 这种方式读取到的是一个Xml格式的字符串
            //StreamReader reader = new StreamReader(response.GetResponseStream(), Encoding.UTF8);
            //result = reader.ReadToEnd();
            #endregion 

            response.Dispose();
            response.Close();

            //reader.Close();
            //reader.Dispose();

            Reader.Dispose();
            Reader.Close();

            stream.Dispose();
            stream.Close();

            return result;
        }

    }

}