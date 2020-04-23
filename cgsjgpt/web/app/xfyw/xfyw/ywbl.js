var strHtml;
var isIE = (navigator.userAgent.indexOf('MSIE') >= 0) || (navigator.userAgent.indexOf('Trident') >= 0);
if (!isIE) {
    strHtml = "<br><font color='#FF00FF'>此页面需使用IE浏览器</font>";
    document.body.innerHTML = strHtml;
}
if (isIE) {
    try {
        var devid = captrue.sGetDevicesId();
    }
    catch (e) {
        strHtml = "<br><font color='#FF00FF'>高拍仪控件未安装!点击这里<a href='../../../js/Doccamera/DoccameraOcx.exe' target='_self'>执行安装</a>,安装后请刷新页面或重新进入。</font>";
        document.body.innerHTML = strHtml;
    }
}
var layer, step;
var data = {
    bid: "",
    ptlb: "",
    xtlb: "",
    ywlx: "",
    ywyy: "",
    cylshisnull: "",
    yhphmisnull: "",
    blms: "",
    blmss: "",
    shms: "",
    brzls: [],
    dlrzls: [],
    dwzls: [],
    currentzls: [],
    idx: -1,

    hpzl: "02 小型汽车",
    hpzlno: "02",
    sfjc: "川",
    hphm1: "D",
    hphm: "川D",
    clsbdh: "",
    cylsh: "",
    ysfjc: "川",
    yhphm1: "D",
    yhphm: "川D",

    brzjlx: "居民身份证",
    brzjhm: "",
    brname: "",
    brtel: "",

    dlrzjlx: "居民身份证",
    dlrzjhm: "",
    dlrname: "",
    dlrtel: "",

    dwdm: "",
    dwmc: "",


    businesses: [],


    code: {
        sfjcs: AppData.Sfjc,
        hpzls: [],
        zjlxs: AppData.Zjlx
    }
}
layui.config({
    base: '../../../step-lay/'
}).use(['form', 'step', 'layer'], function () {
    var $ = layui.$
        , form = layui.form;
    step = layui.step;
    layer = layui.layer;

    step.render({
        elem: '#stepForm',
        filter: 'stepForm',
        width: '100%', //设置容器宽度
        stepWidth: '750px',
        height: '800px',
        stepItems: [{
            title: '选择业务类型'
        }, {
            title: '完善信息'
        }, {
            title: '采集资料'
        }, {
            title: '完成'
        }]
    });

    $('.pre').click(function () {
        step.pre('#stepForm');
    });

    $('.next').click(function () {
        let page = jQuery(this).attr("data-page");
        let msg = "";
        msg = msg + ((page == "page1" && data.ywlx.length == 0) ? "请选择业务类型" : "")

        /***************************************************************************/
        //msg = msg + ((page == "page2" && data.xtlb == '机动车' && data.hphm.length < 7) ? "号牌不正确<br/>" : "")
        msg = msg + ((page == "page2" && data.xtlb == '机动车' && data.yhphmisnull == "否" && data.yhphm.length < 7) ? "原号牌不正确<br/>" : "")
        //msg = msg + ((page == "page2" && data.xtlb == '机动车' && data.clsbdh.length == 0) ? "车辆识别代号不正确<br/>" : "")
        msg = msg + ((page == "page2" && data.xtlb == '机动车' && data.cylshisnull == "否" && data.cylsh.length == 0) ? "查验流水号不正确<br/>" : "")

        msg = msg + ((page == "page2" && ((data.blms == '代理个人业务' || data.blms == '本人办理') && (data.brzjlx == "居民身份证" ? (data.brzjhm.length == 18 ? false : true) : (data.brzjhm.length > 0 ? false : true)))) ? "本人证件号码不正确<br/>" : "")
        msg = msg + ((page == "page2" && (data.blms == '代理个人业务' || data.blms == '本人办理') && data.brname.length == 0) ? "本人姓名不正确<br/>" : "")
        msg = msg + ((page == "page2" && (data.blms == '代理个人业务' || data.blms == '本人办理') && data.brtel.length < 11) ? "本人手机号码不正确<br/>" : "")

        msg = msg + ((page == "page2" && ((data.blms == '代理个人业务' || data.blms == '代理单位业务') && (data.dlrzjlx == "居民身份证" ? (data.dlrzjhm.length == 18 ? false : true) : (data.dlrzjhm.length > 0 ? false : true)))) ? "代理人证件号码不正确<br/>" : "")
        msg = msg + ((page == "page2" && (data.blms == '代理个人业务' || data.blms == '代理单位业务') && data.dlrname.length == 0) ? "代理人姓名不正确<br/>" : "")
        msg = msg + ((page == "page2" && (data.blms == '代理个人业务' || data.blms == '代理单位业务') && data.dlrtel.length < 11) ? "代理人手机号码不正确<br/>" : "")

        msg = msg + ((page == "page2" && data.blms == '代理单位业务' && data.dwdm.length == 0) ? "单位代码不正确<br/>" : "")
        msg = msg + ((page == "page2" && data.blms == '代理单位业务' && data.dwmc.length == 0) ? "单位名称不正确<br/>" : "")
        /***************************************************************************/
        msg = msg + ((page == "page3" && data.currentzls.filter(function (item) {
            return item.bx & item.SRC == '../../../images/zwtp.png';
        }).length > 0) ? "还有图片未上传<br/>" : "")

        if (msg != "") {
            layer.alert(msg, { icon: 2 })
            return;
        }
        if (page == "page4") reset();
        if (page == "page3") {
            layer.confirm("确定" + (data.shms == "需要审核" ? "提请审核" : "保存") + "?", {
                btn: ["确定", "放弃"]
            },
                function (index) {
                    layer.close(index);
                    save();
                },
                function () {
                    return;
                }
            )
        }
        else {
            step.next('#stepForm');
        }
    });
    $("#closewindow").click(function () {
        parent.layer.close(parent.layindex);
    });
})
var vm = new Vue({
    el: '#stepForm',
    data: data,
    beforeCreate: function () {
        init();
    },
    updated: function () {
        var viewer = new Viewer(document.getElementById('images'), {
            title: true,
            toolbar: true,
            hidden: function () {
                //jQuery(".showimg").removeClass("showimg");
            }
        });

    },
    computed: {
        jdcyw: function () {
            return this.businesses.filter(function (item) {
                return item.dwyw.XTLB == "机动车";
            });
        },
        jsryw: function () {
            return this.businesses.filter(function (item) {
                return item.dwyw.XTLB == "驾驶人";
            });
        }

    },
    methods: {
        chooseyw: function (id, event) {
            jQuery(".tablebox>div").removeClass("currentyw");
            var el = event.target;
            $(el).addClass("currentyw");

            var p = this.businesses.filter(function (item) {
                return item.dwyw.ID == id;
            })[0].dwyw;
            this.bid = id;
            this.ptlb = p.PTLB;
            this.xtlb = p.XTLB;
            this.ywlx = p.YWLX;
            this.ywyy = p.YWYY;
            this.cylsh = "";
            this.cylshisnull = p.CYLSHISNULL;
            this.yhphm = "川D";
            this.yhphmisnull = p.YHPHMISNULL;
            this.blmss = JSON.parse(p.BLMS);
            this.blms = this.blmss[0];
            this.shms = p.SHMS;

            this.brzls = JSON.parse(p.BRZL);
            this.brzls.forEach(function (item) {
                return Object.assign(item, { SRC: '../../../images/zwtp.png' });
            });
            this.dlrzls = JSON.parse(p.DLRZL);
            this.dlrzls.forEach(function (item) {
                return Object.assign(item, { SRC: '../../../images/zwtp.png' });
            });
            this.dwzls = JSON.parse(p.DWZL);
            this.dwzls.forEach(function (item) {
                return Object.assign(item, { SRC: '../../../images/zwtp.png' });
            });
            this.currentzls = this.blms == "本人办理" ? this.brzls : (this.blms == "代理个人业务" ? this.dlrzls : this.dwzls)
        },
        choosephoto: function (index, event) {
            jQuery("div>img").removeClass("currentphoto");
            let el = event.target;
            $("img", jQuery(el).parent().parent()).addClass("currentphoto");
            this.idx = index;
            cameraload();
        },
        queryhmd: function () {
            let msg = "";
            msg = msg + (((data.blms == '代理个人业务' || data.blms == '本人办理') && (data.brzjlx == "居民身份证" ? (data.brzjhm.length == 18 ? false : true) : (data.brzjhm.length > 0 ? false : true))) ? "本人证件号码不正确<br/>" : "")
            msg = msg + (((data.blms == '代理个人业务' || data.blms == '代理单位业务') && (data.dlrzjlx == "居民身份证" ? (data.dlrzjhm.length == 18 ? false : true) : (data.dlrzjhm.length > 0 ? false : true))) ? "代理人证件号码不正确<br/>" : "")
            if (msg != "") {
                layer.alert(msg, { icon: 2 })
                return;
            }
            window.parent.layindex2 = window.parent.layer.open({
                title: "黑名单查询",
                type: 2,
                area: [parent.window.innerWidth >= 800 ? "800px" : "90%", parent.window.innerHeight >= 700 ? "700px" : "90%"],
                fixed: false,
                //不固定
                maxmin: true,
                content: ["app/xfyw/xfyw/hmdcx.html?brzjlx=" + data.brzjlx + "&brzjhm=" + data.brzjhm + "&dlrzjlx=" + data.dlrzjlx + "&dlrzjhm=" + data.dlrzjhm + "&blms=" + data.blms, (parent.window.innerWidth >= 800 && parent.window.innerHeight >= 700 ? "no" : "yes")]
            });
        },
        readidcard: function (zt) {
            let o = _readidcard();
            if (o.msg === 1) {
                if (zt === "1") {
                    data.brname = o.name;
                    data.brzjhm = o.sfid;
                }
                else if (zt === "2") {
                    data.dlrname = o.name;
                    data.dlrzjhm = o.sfid;
                }
            }
        }
    },
    watch: {
        sfjc: function (val, oldVal) {
            data.hphm = val + data.hphm1;
        },
        hphm1: function (val, oldVal) {
            this.hphm1 = val.toUpperCase();
            data.hphm = data.sfjc + this.hphm1;
        },
        ysfjc: function (val, oldVal) {
            data.yhphm = val + data.yhphm1;
        },
        yhphm1: function (val, oldVal) {
            this.yhphm1 = val.toUpperCase();
            data.yhphm = data.ysfjc + this.yhphm1;
        },
        blms: function (val, oldval) {
            data.currentzls = val == "本人办理" ? data.brzls : (val == "代理个人业务" ? data.dlrzls : data.dwzls)
        }
    }
});

function init() {
    var index = layer.load(0, { shade: [0.1, "#FFFFFF"] });
    /*post方法,方便后端以dynamic类获取数据,
    * 1-contentType:"application/json",
    * 2-data必须stringify*/
    jQuery.ajax({
        async: true,
        type: "get",
        contentType: "application/json",
        url: "/api/XfywJcpz/BusinessBmQxQuery",
        headers: {
            'Authorization': window.sessionStorage.getItem('token')
        },
        data: {},
        success: function (res) {
            layer.close(index);
            data.businesses = res.data

        },
        error: function (res) {
            var ret = JSON.parse(res.responseText)

            if (ret.Message == "Token 不存在或过期") {
                setTimeout(function () {
                    window.sessionStorage.clear();
                    window.parent.location.href = "/";
                    window.location.href = "/"

                }, 2000)
            }
            else { alert('错误:' + ret.Message) } try { layer.close(index); } catch (e) { }
            return;
        }
    });

    jQuery.ajax({
        async: true,
        type: "get",
        contentType: "application/json",
        url: "/api/SysPublicMethod/GetCode",
        headers: {
            'Authorization': window.sessionStorage.getItem('token')
        },
        data: {
            lb: "['综合平台业务@系统@号牌种类']"
        },
        success: function (res) {
            data.code.hpzls = res.Data
        },
        error: function (res) {
            var ret = JSON.parse(res.responseText)

            if (ret.Message == "Token 不存在或过期") {
                setTimeout(function () {
                    window.sessionStorage.clear();
                    window.parent.location.href = "/";
                    window.location.href = "/"

                }, 2000)
            }
            else { alert('错误:' + ret.Message) } try { layer.close(index); } catch (e) { }
            return;
        }
    })
}
function save() {
    var index = layer.load(0, { shade: [0.1, "#FFFFFF"] });
    let updata = JSON.parse(JSON.stringify(data));
    updata.businesses = null;
    updata.code = null;
    if (updata.blms == "本人办理") {
        updata.dlrzls = [];
        updata.dwzls = [];
    } else if (updata.blms == "代理个人业务") {
        updata.brzls = [];
        updata.dwzls = []
    } else {
        updata.brzls = [];
        updata.dlrzls = [];
    }
    /*post方法,方便后端以dynamic类获取数据,
    * 1-contentType:"application/json",
    * 2-data必须stringify*/
    jQuery.ajax({
        async: true,
        type: "post",
        contentType: "application/json",
        url: "/api/XfywXfyw/BusinessFlowAdd",
        headers: {
            'Authorization': window.sessionStorage.getItem('token')
        },
        data: JSON.stringify(updata),
        success: function (res) {
            layer.close(index);
            step.next('#stepForm');
            camerastop();
        },
        error: function (res) {
            var ret = JSON.parse(res.responseText)

            if (ret.Message == "Token 不存在或过期") {
                setTimeout(function () {
                    window.sessionStorage.clear();
                    window.parent.location.href = "/";
                    window.location.href = "/"

                }, 2000)
            }
            else { alert('错误:' + ret.Message) } try { layer.close(index); } catch (e) { }
            camerastop();
        }
    });
}
function reset() {
    data.bid = "";
    data.ptlb = "";
    data.xtlb = "";
    data.ywlx = "";
    data.ywyy = "";
    data.blms = "";
    data.blmss = "";
    data.shms = "";
    data.brzls = [];
    data.dlrzls = [];
    data.dwzls = [];
    data.currentzls = [];
    data.idx = -1;

    data.hpzl = "02 小型汽车";
    data.hpzlno = "02";
    data.sfjc = "川";
    data.hphm1 = "D";
    data.hphm = "川D";
    data.clsbdh = "";
    data.cylsh = "";
    data.ysfjc = "川";
    data.yhphm1 = "D";
    data.yhphm = "川D";

    data.brzjlx = "居民身份证";
    data.brzjhm = "";
    data.brname = "";
    data.brtel = "";

    data.dlrzjlx = "居民身份证";
    data.dlrzjhm = "";
    data.dlrname = "";
    data.dlrtel = "";

    data.dwdm = "";
    data.dwmc = "";
    jQuery(".tablebox>div").removeClass("currentyw");
    camerastop();
}
$(".tab > li").click(function () {
    $(".tab > li").removeClass("tabcurrent");
    $(this).addClass("tabcurrent");
    $(".website,.userinfo").hide();
    $("#" + $(".tab >li.tabcurrent").attr("name")).show();
});
function tab(id) {
    $(".tab > li").removeClass("tabcurrent");
    $(".tab > li[name=" + id + "]").addClass("tabcurrent");
    $(".website,.userinfo").hide();
    $("#" + id).show();
}
//====高拍仪:====
var isopened = false;
var str;
var dev;
var mode = 0;
var token = window.sessionStorage.getItem('token');
var direxit = false;
var cs = 0;
var ret;
function cameraload() {
    if (!isopened) {
        var index = layer.load(0, { shade: [0.1, "#FFFFFF"] });
        setTimeout(function () {
            str = captrue.bStopPlay();
            str = captrue.bStartPlay();
            dev = 0;
            cs = 0;
            isopened = true;
        }, 1);
        jQuery("#rdev").val("关闭设备")
        jQuery("input[name='mode']").eq(0).attr("checked", true);
        layer.close(index);
    }
}
function camerastop() {
    str = captrue.bStopPlay();
    isopened = false;
    cs = 0;
    jQuery("#rdev").val("打开设备")
}
function changedev() {
    if (dev == 0) {
        str = captrue.bStopPlay();
        str = captrue.bStartPlay2(0);
        dev = 1;
    }
    else {
        str = captrue.bStopPlay();
        str = captrue.bStartPlay();
        dev = 0;
    }
}
function changemode(el) {
    mode = el.value;
    captrue.bSetMode(el.value);
}
function camera() {
    if (!direxit) {
        direxit = captrue.bCreateDir("d:\\camera-cgsjgpt");
    }
    if (direxit) {
        str = captrue.bSaveJPG("d:\\camera-cgsjgpt\\", token);
        cs++;
        if ((str & mode == 0 & cs == 1) || (str & mode == 2 & cs == 2)) {
            cs = 0;
            str = captrue.sUpLoadImageEx2("d:\\camera-cgsjgpt\\" + token + ".jpg", window.sessionStorage.getItem("rooturl"), 80, "/api/FileManger/PostFilesForActivex", true, false);
            if (str.indexOf('"msg":"0"') > 0) {
                ret = JSON.parse(str);
                var obj = JSON.parse(JSON.stringify(data.currentzls[data.idx]));
                obj.SRC = ret.data[0];
                Vue.set(data.currentzls, data.idx, obj);
            }

        }
        else if (str & mode == 2 & cs == 1) {
            alert("请将证件翻面!");
        }
    }
    else {
        alert("文件夹创建错误");
    }
}
function rdev() {
    if (isopened) {
        camerastop();
    }
    else {
        cameraload();
    }
}
camerastop();
//高派一身份证
function _readidcard() {
    var strbarcode = vehPrinter.GetQrText();
    if (strbarcode == "") {
        alert("请移出或翻面!");
        return { msg: 0 };
    }
    if (strbarcode == "-1") {
        alert("读取二代证信息时发生错误，请检查设备是否正确连接!");
        return { msg: 0 };
    }
    var info = parseCardInfo(strbarcode);
    return info;
}
function parseCardInfo(sss) {
    var sfzxx = sss.split("|");
    var tempStr = sfzxx[0];
    var v_sfzmmc;
    var v_xm;
    var v_xb = sfzxx[2];
    var v_sfzmhm;
    var v_sfzyxqz;
    var v_csrq;
    var v_yjdz;
    var v_zp;
    if (tempStr.lastIndexOf("I") > 0) {
        tempStr = tempStr.substring(tempStr.length - 1, tempStr.length);
        v_sfzmmc = tempStr; //证件类型
        v_xm = sfzxx[5];//取外国人中文姓名
        v_sfzmhm = sfzxx[3];//取身份证号
        //[7]有效期始,[8]有效期止
        v_sfzyxqz = sfzxx[7];
        v_csrq = sfzxx[8];
        v_zp = sfzxx[13];
    } else if (tempStr.lastIndexOf("Q") > 0) {
        v_sfzmmc = "Q";
        v_xm = sfzxx[1];
        v_sfzmhm = sfzxx[6];
        //[8]有效期始,[9]有效期止
        v_sfzyxqz = sfzxx[9];
        v_csrq = sfzxx[4];
        v_yjdz = sfzxx[5];
        v_zp = sfzxx[11];
    } else {
        v_sfzmmc = "A";
        v_xm = sfzxx[1];
        v_sfzmhm = sfzxx[6];
        //[8]有效期始,[9]有效期止
        v_sfzyxqz = sfzxx[9];
        v_csrq = sfzxx[4];
        v_yjdz = sfzxx[5];
        v_zp = sfzxx[11];
    }
    return { msg: 1, name: v_xm, sfid: v_sfzmhm };
}


var g_iPort;
function _readidcard1() {
    var ret;
    g_iPort = getport();
    var iResult;
    var info = { msg: 0 };
    iResult = objActiveX.hxgc_OpenReader(g_iPort); //打开设备

    if (iResult != 0) {
        alert("打开设备失败，错误代码：" + iResult + ".");
    }
    else {
        iResult = objActiveX.hxgc_ReadIDCard(g_iPort); //读二代证

        if (iResult == 0) {
            info["msg"] = 1;
            info["name"] = objActiveX.hxgc_GetName();   //姓名           
            info["sfid"] = objActiveX.hxgc_GetIDCode();            //身份证号      

        }
        iResult = objActiveX.hxgc_CloseReader(g_iPort); //关闭设备
    }
    return info;
}
function getport() {
    var isIE = (navigator.userAgent.indexOf('MSIE') >= 0) || (navigator.userAgent.indexOf('Trident') >= 0);
    if (!isIE) {
        strHtml = "<br><font color='#FF00FF'>此页面需使用IE浏览器</font>";
        document.body.innerHTML = strHtml;
        return;
    }
    var port = "";
    var zt = "";
    var mid = "";
    if (isIE) {
        try {
            port = _loadStorage("g_iPort");
            if (port == null) {
                return scan_port();
            }
            zt = objActiveX.hxgc_OpenReader(port);
            if (zt == "0") {
                mid = objActiveX.hxgc_GetSamIdToStr(port); //获取SAMID
                objActiveX.hxgc_CloseReader(port);
                if (mid != "") {
                    return port;
                }
                else {
                    return scan_port();
                }
            }
            else {
                return scan_port();
            }
        }
        catch (e) {
            strHtml = "<br><font color='#FF00FF'>二代证读卡器未安装!请按以下步骤安装:</br>1、点击这里<a href='../../../js/idcard/ftdi_ft232_drive.exe' target='_self'>执行USB驱动安装；</a></br>2、点击这里<a href='../../../js/idcard/HxgcIDReader.exe' target='_self'>执行读卡器IE控件驱动安装；</a></br>3、安装后请刷新页面或重新进入。</font>";
            document.body.innerHTML = strHtml;
            return;
        }
    }

}
function scan_port() {
    var zt, mid;
    for (var i = 1; i <= 16; i++) {
        try {
            zt = objActiveX.hxgc_OpenReader(i);
            if (zt == "0") {
                mid = objActiveX.hxgc_GetSamIdToStr(i); //获取SAMID
                objActiveX.hxgc_CloseReader(i); //关闭设备
                if (mid != "") {

                    _saveStorage("g_iPort", i);
                    return i;
                }

            }


        }
        catch (e) {
            strHtml = "<br><font color='#FF00FF'>二代证读卡器未安装!请按以下步骤安装:</br>1、点击这里<a href='../../../js/idcard/ftdi_ft232_drive.exe' target='_self'>执行USB驱动安装；</a></br>2、点击这里<a href='../../../js/idcard/HxgcIDReader.exe' target='_self'>执行读卡器IE控件驱动安装；</a></br>3、安装后请刷新页面或重新进入。</font>";
            document.body.innerHTML = strHtml;
            return;
        }
    }
    for (var i = 1001; i <= 1016; i++) {
        try {
            //alert(i);
            zt = objActiveX.hxgc_OpenReader(i);
            if (zt == "0") {
                mid = objActiveX.hxgc_GetSamIdToStr(i); //获取SAMID
                objActiveX.hxgc_CloseReader(i); //关闭设备
                if (mid != "") {
                    _saveStorage("g_iPort", i);
                    return i;
                }
                //break;
            }
        }
        catch (e) {
            strHtml = "<br><font color='#FF00FF'>二代证读卡器未安装!请按以下步骤安装:</br>1、点击这里<a href='../../../js/idcard/ftdi_ft232_drive.exe' target='_self'>执行USB驱动安装；</a></br>2、点击这里<a href='../../../js/idcard/HxgcIDReader.exe' target='_self'>执行读卡器IE控件驱动安装；</a></br>3、安装后请刷新页面或重新进入。</font>";
            document.body.innerHTML = strHtml;
            return;
        }
    }

}
/*
 * html5获取本地存储
 */
function _loadStorage(attr) {
    var str = localStorage.getItem(attr);
    return str;
}
/*
 * HTML5本地存储 
 */
function _saveStorage(key, value) {
    var self = this;
    localStorage.setItem(key, value);
}
