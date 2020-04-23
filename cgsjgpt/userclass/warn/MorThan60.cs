using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using cgsjgpt.Models;
using cgsjgpt.userclass.method;
using Newtonsoft.Json;
using cgsjgpt.userclass.data;
namespace cgsjgpt.userclass.warn
{
    public class MorThan60
    {
        public static void run(VEH_FLOW o,veh veh,int age)
        {
            using (EntitiesDtgl db = new EntitiesDtgl())
            using (EntitiesSys1 db1 = new EntitiesSys1())
            using (EntitiesXfyw db2 = new EntitiesXfyw())
            {
                WARNLOG nw = new WARNLOG();
                nw.ID = PubMethod.maxid();
                nw.DWNO = "";
                nw.DWMC = "";
                nw.XTLB = "机动车";
                nw.YWLX = o.YWLX;
                nw.WARNLX1 = "违规办理";
                nw.OPLX = "注册/转移登记年龄超限";

                nw.SFZMHM =veh.SFZMHM;
                nw.NAME = o.SYR;
                nw.HPZLNAME = o.HPZL;
                nw.HPHM = o.HPHM;
                nw.CJH = o.CLSBDH;

                string key = "";
                string lx = "非本系统业务";
                try
                {
                    key = (from p in db.PDXX where p.YWLSH == o.LSH select p).First().XH;
                    lx = "大厅业务";
                }
                catch
                {
                    try
                    {
                        key = (from p in db2.BUSINESS_FLOW where p.CJGLSH == o.LSH select p).First().ID;
                        lx = "下放业务";
                    }
                    catch
                    {

                    }
                }
                nw.WARNLX = lx;
                nw.KEY6 = key;
                nw.OPLX1 = age.ToString();
                nw.SYXZ = veh.SYXZ;
                nw.GLLSH = o.LSH;
                nw.STARTTIME = DateTime.Now;
                nw.OPERID = " ";
                nw.OPERNAME = "";
                nw.ZT = "0";
                nw.HCZT = "0";

                nw.CREATETIME = DateTime.Now;
                db.WARNLOG.Add(nw);
                db.SaveChanges();

            }
        }
    }
}