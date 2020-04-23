using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Web;
using cgsjgpt.Models;
using cgsjgpt.userclass.data;
using cgsjgpt.userclass.method;
using Newtonsoft.Json;
namespace cgsjgpt.userclass.flow
{
    public class GetFlows1
    {
        public static void AddVvehflow1(VEH_FLOW o)
        {
            try
            {
                using (EntitiesSys1 db1 = new EntitiesSys1())
                {
                    VVEH_FLOW1 newo = PubMethod.Mapper<VVEH_FLOW1, VEH_FLOW>(o);
                    newo.HDBJ = "0";
                    db1.VVEH_FLOW1.Add(newo);
                    db1.SaveChanges();
                    //以下是对临牌核发超过次数进行预警
                    if (o.YWLX == "O")
                    {
                        warn.lshp.tempHp(o);
                    }
                }
            }
            catch(Exception e)
            {
                PubMethod.wrlog("AddVvehflow1", o.LSH);
            }
        }
        public static void AddVvehflow2(VEH_FLOW o)
        {
            try
            {
                using (EntitiesSys1 db1 = new EntitiesSys1())
                using (EntitiesTrff db3 = new EntitiesTrff())
                {
                    List<veh> vs = db3.Database.SqlQuery<veh>("select hphm,hpzl,sfzmhm,clsbdh,sfzmhm,syxz,syr,yxqz,zt from vehicle where xh='"+o.XH+"'").ToList();

                    if (vs.Count > 0)
                    {
                        string identityCard = vs[0].SFZMHM;
                        string Birthday = string.Empty;
                        if (identityCard.Length == 18)//处理18位的身份证号码从号码中得到生日和性别代码
                        {
                            Birthday = identityCard.Substring(6, 4) + "-" + identityCard.Substring(10, 2) + "-" + identityCard.Substring(12, 2);
                        }
                        if (identityCard.Length == 15)
                        {
                            Birthday = "19" + identityCard.Substring(6, 2) + "-" + identityCard.Substring(8, 2) + "-" + identityCard.Substring(10, 2);
                        }
                        int age = CalculateAge(Birthday);
                        if ( age>= 60)
                        {
                            VVEH_FLOW1 newo = PubMethod.Mapper<VVEH_FLOW1, VEH_FLOW>(o);
                            newo.SYR = newo.SYR + "(" + vs[0].SFZMHM + ")";
                            newo.HDBJ = "0";
                            db1.VVEH_FLOW1.Add(newo);
                            db1.SaveChanges();
                            //以下是预警
                            warn.MorThan60.run(o, vs[0],age);
                        }
                    }
                }
            }
            catch (Exception e)
            {
                PubMethod.wrlog("AddVvehflow2", e.InnerException.InnerException.InnerException.Message);
            }
        }
        /// <summary>
        /// 根据出生日期，计算精确的年龄
        /// </summary>
        /// <param name="birthDate">生日</param>
        /// <returns></returns>
        public static int CalculateAge(string birthDay)
        {
            DateTime birthDate = DateTime.Parse(birthDay);
            DateTime nowDateTime = DateTime.Now;
            int age = nowDateTime.Year - birthDate.Year;
            //再考虑月、天的因素
            if (nowDateTime.Month < birthDate.Month || (nowDateTime.Month == birthDate.Month && nowDateTime.Day < birthDate.Day))
            {
                age--;
            }
            return age;
        }
    }
}