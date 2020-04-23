using cgsjgpt.Models;
using cgsjgpt.userclass.method;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace cgsjgpt.userclass.warn
{
    public class lshp
    {
        public static void tempHp(VEH_FLOW o)
        {
            //以下是对临牌核发超过次数进行预警
            using (EntitiesDtgl db = new EntitiesDtgl())
            using (EntitiesSys1 db1 = new EntitiesSys1())
            using(EntitiesXfyw db2=new EntitiesXfyw())
            {
                List<string> lshs = (from p in db1.VVEH_FLOW1 where p.YWLX == "O" && p.CLSBDH == o.CLSBDH select p.LSH).ToList();
                if (lshs.Count >= 2)
                {
                    try
                    {
                        WARNLOG nw = (from p in db.WARNLOG where p.WARNLX1 == "违规办理" && p.XTLB == "机动车" && p.OPLX == "临牌核发超过次数" && p.CJH == o.CLSBDH select p).First();

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

                        nw.HCZT = "0";
                        nw.HCJG = "";
                        nw.GLLSH = o.LSH;
                        nw.STARTTIME = DateTime.Now;
                        nw.CREATETIME = DateTime.Now;
                        nw.MEMO1 = JsonConvert.SerializeObject(lshs);
                        db.SaveChanges();
                    }
                    catch
                    {
                       
                        WARNLOG nw = new WARNLOG();
                        nw.ID = PubMethod.maxid();
                        nw.DWNO = "";
                        nw.DWMC = "";
                        nw.XTLB = "机动车";
                        nw.YWLX = o.YWLX;
                        nw.WARNLX1 = "违规办理";
                        nw.OPLX = "临牌核发超过次数";

                        nw.SFZMHM = "";
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
                        nw.GLLSH = o.LSH;
                        nw.STARTTIME = DateTime.Now;
                        nw.OPERID = " ";
                        nw.OPERNAME = "";
                        nw.ZT = "0";
                        nw.HCZT = "0";
                        nw.MEMO1= JsonConvert.SerializeObject(lshs);
                        nw.CREATETIME = DateTime.Now;
                        db.WARNLOG.Add(nw);
                        db.SaveChanges();
                    }

                }
            }
        }
    }
}