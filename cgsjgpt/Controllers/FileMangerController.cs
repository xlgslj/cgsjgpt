using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using cgsjgpt.userclass.method;
using Newtonsoft.Json;
using System.Dynamic;
using cgsjgpt.Controllers.Filters;
using System.Collections;
using System.Threading.Tasks;
using cgsjgpt.Models;
using cgsjgpt.userclass.data;

namespace cgsjgpt.Controllers
{
    [CustomAuthAttribute(false)]
    public class FileMangerController : ApiController
    {
        public class UpFileRet
        {
            public int errno { set; get; }
            public List<string> data { set; get; }
            public string msg { get; set; }
        }
        [HttpPost]
        public Task<Hashtable> PostFiles()
        {
            UpFileRet ret = new UpFileRet();
            // 检查是否是 multipart/form-data 
            if (!Request.Content.IsMimeMultipartContent("form-data"))
                throw new HttpResponseException(HttpStatusCode.UnsupportedMediaType);
            //文件保存目录路径 
            string SaveTempPath = "/upfiles/images";
            String dirTempPath = HttpContext.Current.Server.MapPath(SaveTempPath);
            var provider = new MultipartFormDataStreamProvider(dirTempPath);

            //var queryp = Request.GetQueryNameValuePairs();//获得查询字符串的键值集合 
            var task = Request.Content.ReadAsMultipartAsync(provider).
                ContinueWith<Hashtable>(o =>
                {
                    Hashtable hash = new Hashtable();
                    hash["errno"] = 1;
                    hash["msg"] = "上传出错";
                    var file = provider.FileData[0];//provider.FormData 
                    string orfilename = file.Headers.ContentDisposition.FileName.TrimStart('"').TrimEnd('"');
                    //(2019 - 04 - 28 16:53:42:813)-file.Headers.ContentDisposition -{ "DispositionType":"form-data","Parameters":[{"Name":"name","Value":"\"fj1.jpg\""},{"Name":"filename","Value":"\"fj1.jpg\""}],"Name":"\"fj1.jpg\"","FileName":"\"fj1.jpg\"","FileNameStar":null,"CreationDate":null,"ModificationDate":null,"ReadDate":null,"Size":null}
                    //(2019-04-28 16:53:42:813)-file.Headers.ContentDisposition.FileName-"fj1.jpg"

                    FileInfo fileinfo = new FileInfo(file.LocalFileName);
                    //最大文件大小 
                    int maxSize = 10000000;
                    if (fileinfo.Length <= 0)
                    {
                        hash["errno"] = 1;
                        hash["msg"] = "请选择上传文件。";
                    }
                    else if (fileinfo.Length > maxSize)
                    {
                        hash["errno"] = 1;
                        hash["msg"] = "上传文件大小超过限制。";
                        fileinfo.Delete();
                    }
                    else
                    {
                        string fileExt = orfilename.Substring(orfilename.LastIndexOf('.'));
                        //定义允许上传的文件扩展名 
                        String fileTypes = "gif,jpg,jpeg,png,bmp";
                        if (String.IsNullOrEmpty(fileExt) || Array.IndexOf(fileTypes.Split(','), fileExt.Substring(1).ToLower()) == -1)
                        {
                            hash["errno"] = 1;
                            hash["msg"] = "上传文件扩展名是不允许的扩展名。";
                        }
                        else
                        {
                            //String ymd = DateTime.Now.ToString("yyyyMMdd", System.Globalization.DateTimeFormatInfo.InvariantInfo);
                            String newFileName = DateTime.Now.ToString("yyyyMMdd_HHmmssffff", System.Globalization.DateTimeFormatInfo.InvariantInfo);
                            fileinfo.CopyTo(Path.Combine(dirTempPath, newFileName + fileExt), true);
                            fileinfo.Delete();
                            hash["errno"] = 0;
                            hash["msg"] = "上传成功";
                            List<string> urls = new List<string>();
                            urls.Add(SaveTempPath + "/" + newFileName + fileExt);
                            hash["data"] = urls;
                        }
                    }
                    return hash;
                });
            return task;
        }
        [HttpPost]
        public Task<Hashtable> PostFilesForActivex()
        {
            PubMethod.wrlog("postfile", "xlgslj");
            UpFileRet ret = new UpFileRet();
            // 检查是否是 multipart/form-data 
            if (!Request.Content.IsMimeMultipartContent("form-data"))
                throw new HttpResponseException(HttpStatusCode.UnsupportedMediaType);
            //文件保存目录路径 
            string SaveTempPath = "/upfiles/temp";
            String dirTempPath = HttpContext.Current.Server.MapPath(SaveTempPath);
            var provider = new MultipartFormDataStreamProvider(dirTempPath);

            string returl = "uperror";

            //var queryp = Request.GetQueryNameValuePairs();//获得查询字符串的键值集合 
            var task = Request.Content.ReadAsMultipartAsync(provider).
                ContinueWith<Hashtable>(o =>
                {
                    Hashtable hash = new Hashtable();
                    hash["errno"] = 1;
                    hash["msg"] = "上传出错";
                    var file = provider.FileData[0];//provider.FormData 
                    string orfilename = file.Headers.ContentDisposition.FileName.TrimStart('"').TrimEnd('"');
                    string t = orfilename.Substring(orfilename.LastIndexOf('\\')+1);
                    string token= t.Substring(0,t.IndexOf('.'));
                    //PubMethod.wrlog("token", token);
                    //(2019 - 04 - 28 16:53:42:813)-file.Headers.ContentDisposition -{ "DispositionType":"form-data","Parameters":[{"Name":"name","Value":"\"fj1.jpg\""},{"Name":"filename","Value":"\"fj1.jpg\""}],"Name":"\"fj1.jpg\"","FileName":"\"fj1.jpg\"","FileNameStar":null,"CreationDate":null,"ModificationDate":null,"ReadDate":null,"Size":null}
                    //(2019-04-28 16:53:42:813)-file.Headers.ContentDisposition.FileName-"fj1.jpg"

                    FileInfo fileinfo = new FileInfo(file.LocalFileName);
                    //最大文件大小 
                    int maxSize = 10000000;
                    if (fileinfo.Length <= 0)
                    {
                        hash["errno"] = 1;
                        hash["msg"] = "请选择上传文件。";
                    }
                    else if (fileinfo.Length > maxSize)
                    {
                        hash["errno"] = 1;
                        hash["msg"] = "上传文件大小超过限制。";
                        fileinfo.Delete();
                    }
                    else
                    {
                        string fileExt = orfilename.Substring(orfilename.LastIndexOf('.'));
                        //定义允许上传的文件扩展名 
                        String fileTypes = "gif,jpg,jpeg,png,bmp";
                        if (String.IsNullOrEmpty(fileExt) || Array.IndexOf(fileTypes.Split(','), fileExt.Substring(1).ToLower()) == -1)
                        {
                            hash["errno"] = 1;
                            hash["msg"] = "上传文件扩展名是不允许的扩展名。";
                        }
                        else
                        {
                            //String ymd = DateTime.Now.ToString("yyyyMMdd", System.Globalization.DateTimeFormatInfo.InvariantInfo);
                            String newFileName = DateTime.Now.ToString("yyyyMMdd_HHmmssffff", System.Globalization.DateTimeFormatInfo.InvariantInfo);
                            fileinfo.CopyTo(Path.Combine(dirTempPath, newFileName + fileExt), true);
                            fileinfo.Delete();
                            hash["errno"] = 0;
                            hash["msg"] = "0";
                            List<string> urls = new List<string>();
                            urls.Add(SaveTempPath + "/" + newFileName + fileExt);
                            returl = SaveTempPath + "/" + newFileName + fileExt;
                            hash["data"] = urls;
                        }
                    }
                    return hash;
                });

            return task;
        }
        [HttpPost]
        public UpFileRet PostFiles_bak()

        {
            UpFileRet ret = new UpFileRet();
            ret.errno = 0;
            ret.data = new List<string>();
            try
            {

                HttpFileCollection filelist = HttpContext.Current.Request.Files;
                if (filelist != null && filelist.Count > 0)
                {
                    for (int i = 0; i < filelist.Count; i++)
                    {
                        HttpPostedFile file = filelist[i];
                        string FilePath = "C:/inetpub/wwwroot/upfiles/images/";
                        String Tpath = "/upfiles/images/";

                        string Extname = System.IO.Path.GetExtension(file.FileName);
                        string FileName = DateTime.Now.ToString("yyyyMMddHHmmssfff") + Extname;
                        DirectoryInfo di = new DirectoryInfo(FilePath);
                        if (!di.Exists) { di.Create(); }
                        try
                        {
                            //PubMethod.wrlog("filename", FilePath + FileName);
                            file.SaveAs(FilePath + FileName);
                            ret.data.Add(Tpath + FileName);
                        }
                        catch (Exception ex)
                        {
                            ret.errno = 1;
                            ret.msg = ex.Message;
                        }
                    }
                }
                else
                {
                    ret.errno = 2;
                    ret.msg = "文件不存在";
                }
            }
            catch (Exception e)
            {
                ret.errno = 3;
                ret.msg = e.Message;
            }
            return ret;
        }
 
        [HttpPost]
        public async Task<Hashtable> PostFiles1()
        {
            UpFileRet ret = new UpFileRet();
            // 检查是否是 multipart/form-data 
            if (!Request.Content.IsMimeMultipartContent("form-data"))
                throw new HttpResponseException(HttpStatusCode.UnsupportedMediaType);
            //文件保存目录路径 
            string SaveTempPath = "/upfiles/images";
            String dirTempPath = HttpContext.Current.Server.MapPath(SaveTempPath);
            var multipartMemoryStreamProvider = await Request.Content.ReadAsMultipartAsync();
            Hashtable hash = new Hashtable();
            hash["errno"] = 1;
            hash["msg"] = "上传出错";
            foreach (var content in multipartMemoryStreamProvider.Contents)
            {
                if (!string.IsNullOrEmpty(content.Headers.ContentDisposition.FileName))
                {
                    string orfilename = content.Headers.ContentDisposition.FileName.TrimStart('"').TrimEnd('"');
                    string fileExt = orfilename.Substring(orfilename.LastIndexOf('.'));
                    //定义允许上传的文件扩展名 
                    String fileTypes = "gif,jpg,jpeg,png,bmp";
                    if (String.IsNullOrEmpty(fileExt) || Array.IndexOf(fileTypes.Split(','), fileExt.Substring(1).ToLower()) == -1)
                    {
                        hash["errno"] = 1;
                        hash["msg"] = "上传文件扩展名是不允许的扩展名。";
                    }
                    else
                    {
                        String newFileName = DateTime.Now.ToString("yyyyMMdd_HHmmssffff", System.Globalization.DateTimeFormatInfo.InvariantInfo);
                        using (Stream stream = await content.ReadAsStreamAsync())
                        {
                            byte[] bytes = new byte[stream.Length];
                            stream.Read(bytes, 0, bytes.Length);
                            // 设置当前流的位置为流的开始   
                            stream.Seek(0, SeekOrigin.Begin);
                            // 把 byte[] 写入文件   
                            FileStream fs = new FileStream(Path.Combine(dirTempPath, newFileName + fileExt), FileMode.Create);
                            BinaryWriter bw = new BinaryWriter(fs);
                            bw.Write(bytes);
                            bw.Close();
                            fs.Close();
                        }
                        hash["errno"] = 0;
                        hash["msg"] = "上传成功1";
                        List<string> urls = new List<string>();
                        urls.Add(SaveTempPath + "/" + newFileName + fileExt);
                        hash["data"] = urls;
                    }
                }
                else
                {
                    hash["errno"] = 1;
                    hash["msg"] = "error。";
                }
            }
            return hash;
        }
    }
}
