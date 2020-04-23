using cgsjgpt.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading;
using System.Web;

namespace cgsjgpt.userclass.method
{
    public class PubMethod
    {
        private static Entities db = new Entities();
        /// <summary>
        /// 写日志
        /// </summary>
        /// <param name="v1"></param>
        /// <param name="v2"></param>
        //读写锁，当资源处于写入模式时，其他线程写入需要等待本次写入结束之后才能继续写入
        static ReaderWriterLockSlim LogWriteLock = new ReaderWriterLockSlim();
        public static void wrlog(string v1, string v2)
        {

            try
            {
                                 //设置读写锁为写入模式独占资源，其他写入请求需要等待本次写入结束之后才能继续写入
                 //注意：长时间持有读线程锁或写线程锁会使其他线程发生饥饿 (starve)。 为了得到最好的性能，需要考虑重新构造应用程序以将写访问的持续时间减少到最小。
                 //      从性能方面考虑，请求进入写入模式应该紧跟文件操作之前，在此处进入写入模式仅是为了降低代码复杂度
                 //      因进入与退出写入模式应在同一个try finally语句块内，所以在请求进入写入模式之前不能触发异常，否则释放次数大于请求次数将会触发异常
                LogWriteLock.EnterWriteLock();
                string logpath = "d:\\log\\log_" + DateTime.Now.Year + "_" + DateTime.Now.Month + "_" + DateTime.Now.Day + ".txt";
                System.IO.File.AppendAllText(logpath, System.String.Format("({0:G})-{1}-{2}\r\n", System.DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss:fff"), v1, v2), Encoding.UTF8);
            }
            catch
            {

            }
            finally
            {
                //退出写入模式，释放资源占用
                //注意：一次请求对应一次释放
                //      若释放次数大于请求次数将会触发异常[写入锁定未经保持即被释放]
                //      若请求处理完成后未释放将会触发异常[此模式不下允许以递归方式获取写入锁定]
                LogWriteLock.ExitWriteLock();
            }
        }
        /// <summary>
        /// 获取最大ID
        /// </summary>
        /// <param name="table"></param>
        /// <param name="zd"></param>
        /// <returns></returns>
        public static string maxid()
        {
            string maxid = string.Empty;
            try
            {
                int newid = db.Database.SqlQuery<int>("select AUTOINC.nextval from dual").First();
                switch (newid.ToString().Length)
                {
                    case 1:
                        maxid = "000000000" + newid.ToString();
                        break;
                    case 2:
                        maxid = "00000000" + newid.ToString();
                        break;
                    case 3:
                        maxid = "0000000" + newid.ToString();
                        break;
                    case 4:
                        maxid = "000000" + newid.ToString();
                        break;
                    case 5:
                        maxid = "00000" + newid.ToString();
                        break;
                    case 6:
                        maxid = "0000" + newid.ToString();
                        break;
                    case 7:
                        maxid = "000" + newid.ToString();
                        break;
                    case 8:
                        maxid = "00" + newid.ToString();
                        break;
                    case 9:
                        maxid = "0" + newid.ToString();
                        break;
                    case 10:
                        maxid = newid.ToString();
                        break;


                }
            }
            catch
            {
                maxid = "0000000001";
            }
            return maxid;
        }
        /// 时间转秒数
        /// </summary>
        /// <param name="time"></param>
        /// <returns></returns>
        public static int ConvertDateTimeInt(System.DateTime time)
        {
            System.DateTime startTime = TimeZone.CurrentTimeZone.ToLocalTime(new System.DateTime(1970, 1, 1));
            return (int)(time - startTime).TotalSeconds;
        }
        /// <summary>
        /// 秒转时间
        /// </summary>
        /// <param name="timeStamp"></param>
        /// <returns></returns>
        public static DateTime ConvertStringToDateTime(string timeStamp)
        {
            DateTime dtStart = TimeZone.CurrentTimeZone.ToLocalTime(new DateTime(1970, 1, 1));
            long lTime = long.Parse(timeStamp + "0000000");
            TimeSpan toNow = new TimeSpan(lTime);
            return dtStart.Add(toNow);
        }
        /// <summary>
        /// 通过反射复制对象
        /// </summary>
        /// <typeparam name="D"></typeparam>
        /// <typeparam name="S"></typeparam>
        /// <param name="s"></param>
        /// <returns></returns>
        public static D Mapper<D, S>(S s)
        {
            D d = Activator.CreateInstance<D>();
            try
            {
                var Types = s.GetType();//获得类型  
                var Typed = typeof(D);
                foreach (PropertyInfo sp in Types.GetProperties())//获得类型的属性字段  
                {
                    foreach (PropertyInfo dp in Typed.GetProperties())
                    {
                        if (dp.Name == sp.Name)//判断属性名是否相同  
                        {
                            dp.SetValue(d, sp.GetValue(s, null), null);//获得s对象属性的值复制给d对象的属性  
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return d;
        }
        /// <summary>
        /// 递归获取当前单位i及子单位
        /// </summary>
        /// <param name="dwno"></param>
        /// <returns></returns>
        public static List<string> GetAllDw(string dwno)
        {
            List<string> dwnos = new List<string>();
            dwnos.Add(dwno);
            IQueryable<BMDB> source = from p in db.BMDB where p.PID == dwno select p;
            foreach (BMDB b in source)
            {
                dwnos.AddRange(GetAllDw(b.ID));
            }

            return dwnos;
        }
    }
    public static class linqext
    {
        public static IEnumerable<TSource> DistinctBy<TSource, TKey>(this IEnumerable<TSource> source, Func<TSource, TKey> keySelector)
        {
            HashSet<TKey> seenKeys = new HashSet<TKey>();
            foreach (TSource element in source)
            {
                if (seenKeys.Add(keySelector(element)))
                {
                    yield return element;
                }
            }
        }
    }


}