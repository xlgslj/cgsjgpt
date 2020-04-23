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
    id: GetUrlPara()[0].value,
    business_flow: {},
    base: {},

    currentzls: [],
    idx: -1,

    sfjc: "川",
    hphm1: "D",
    ysfjc: "川",
    yhphm1: "D",

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
        msg = msg + ((page == "page1" && data.business_flow.YWLX == "") ? "请选择业务类型" : "")
        /***************************************************************************/
        msg = msg + ((page == "page2" && data.business_flow.XTLB == '机动车' && data.business_flow.HPHM.length < 7) ? "原号牌不正确<br/>" : "")
        //msg = msg + ((page == "page2" && data.business_flow.XTLB == '机动车' && data.business_flow.CLSBDH == '') ? "车辆识别代号不正确<br/>" : "")
        msg = msg + ((page == "page2" && data.business_flow.XTLB == '机动车' && data.base.YHPHMISNULL == "否" && data.business_flow.HPHM1.length < 7) ? "原号牌不正确<br/>" : "")
        msg = msg + ((page == "page2" && data.business_flow.XTLB == '机动车' && data.base.CYLSHISNULL == "否" && data.business_flow.CYLSH == '') ? "查验流水号不正确<br/>" : "")


        /*sg = msg + ((page == "page2" && data.business_flow.BRZJHM == '') ? "本人证件号码不正确<br/>" : "")
         msg = msg + ((page == "page2" && data.business_flow.BRNAME == '') ? "本人姓名不正确<br/>" : "")
         msg = msg + ((page == "page2" && data.business_flow.BRTEL.length < 11) ? "本人手机号码不正确<br/>" : "")
 
         msg = msg + ((page == "page2" && data.business_flow.BLMS == '代理个人业务' && data.business_flow.DLRZJHM == '') ? "代理人证件号码不正确<br/>" : "")
         msg = msg + ((page == "page2" && data.business_flow.BLMS == '代理个人业务' && data.business_flow.DLRNAME == '') ? "代理人姓名不正确<br/>" : "")
         msg = msg + ((page == "page2" && data.business_flow.BLMS == '代理个人业务' && data.business_flow.DLRTEL.length < 11) ? "代理人手机号码不正确<br/>" : "")*/

        msg = msg + ((page == "page2" && ((data.business_flow.BLMS == '代理个人业务' || data.business_flow.BLMS == '本人办理') && (data.business_flow.BRZJLX == "居民身份证" ? (data.business_flow.BRZJHM.length == 18 ? false : true) : (data.business_flow.BRZJHM.length > 0 ? false : true)))) ? "本人证件号码不正确<br/>" : "")
        msg = msg + ((page == "page2" && (data.business_flow.BLMS == '代理个人业务' || data.business_flow.BLMS == '本人办理') && data.business_flow.BRNAME.length == 0) ? "本人姓名不正确<br/>" : "")
        msg = msg + ((page == "page2" && (data.business_flow.BLMS == '代理个人业务' || data.business_flow.BLMS == '本人办理') && data.business_flow.BRTEL.length < 11) ? "本人手机号码不正确<br/>" : "")

        msg = msg + ((page == "page2" && ((data.business_flow.BLMS == '代理个人业务' || data.business_flow.BLMS == '代理单位业务') && (data.business_flow.DLRZJLX == "居民身份证" ? (data.business_flow.DLRZJHM.length == 18 ? false : true) : (data.business_flow.DLRZJHM.length > 0 ? false : true)))) ? "代理人证件号码不正确<br/>" : "")
        msg = msg + ((page == "page2" && (data.business_flow.BLMS == '代理个人业务' || data.business_flow.BLMS == '代理单位业务') && data.business_flow.DLRNAME.length == 0) ? "代理人姓名不正确<br/>" : "")
        msg = msg + ((page == "page2" && (data.business_flow.BLMS == '代理个人业务' || data.business_flow.BLMS == '代理单位业务') && data.business_flow.DLRTEL.length < 11) ? "代理人手机号码不正确<br/>" : "")

        msg = msg + ((page == "page2" && data.business_flow.BLMS == '代理单位业务' && data.business_flow.DWDM == '') ? "单位代码不正确<br/>" : "")
        msg = msg + ((page == "page2" && data.business_flow.BLMS == '代理单位业务' && data.business_flow.BLDWMC == '') ? "单位名称不正确<br/>" : "")
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
    methods: {
        choosephoto: function (index, event) {
            jQuery("div>img").removeClass("currentphoto");
            let el = event.target;
            $("img", jQuery(el).parent().parent()).addClass("currentphoto");
            this.idx = index;
            cameraload();
        }
    },
    watch: {
        sfjc: function (val, oldVal) {
            data.business_flow.HPHM = val + data.hphm1;
        },
        hphm1: function (val, oldVal) {
            data.business_flow.HPHM = data.sfjc + val;
        },
        ysfjc: function (val, oldVal) {
            data.business_flow.HPHM1 = val + data.yhphm1;
        },
        yhphm1: function (val, oldVal) {
            data.business_flow.HPHM1 = data.ysfjc + val;
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
        url: "/api/XfywXfyw/GetBusiness_flow",
        headers: {
            'Authorization': window.sessionStorage.getItem('token')
        },
        data: {
            id: data.id
        },
        success: function (res) {
            layer.close(index);
            data.base = res.base;
            data.business_flow = res.data
            data.business_flow.BRZLS = JSON.parse(data.business_flow.BRZLS);
            data.business_flow.DLRZLS = JSON.parse(data.business_flow.DLRZLS);
            data.business_flow.DWZLS = JSON.parse(data.business_flow.DWZLS);

            data.currentzls = data.business_flow.BLMS == "本人办理" ? data.business_flow.BRZLS : (data.business_flow.BLMS == "代理个人业务" ? data.business_flow.DLRZLS : data.business_flow.DWZLS)

            data.sfjc = data.business_flow.HPHM.substr(0, 1);
            data.hphm1 = data.business_flow.HPHM.substr(1, data.business_flow.HPHM.length - 1);
            data.ysfjc = data.business_flow.HPHM1.substr(0, 1);
            data.yhphm1 = data.business_flow.HPHM1.substr(1, data.business_flow.HPHM1.length - 1);

        },
        error: function (res) {
            layer.alert(res.responseText, { icon: 2 });
            layer.close(index);
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
    data.business_flow.BRZLS = JSON.stringify(data.business_flow.BRZLS);
    data.business_flow.DLRZLS = JSON.stringify(data.business_flow.DLRZLS);
    data.business_flow.DWZLS = JSON.stringify(data.business_flow.DWZLS);
    Object.keys(data.business_flow).forEach(function (key) {
        if (data.business_flow[key] == null) {
            data.business_flow[key] = "";
        }
    });

    /*post方法,方便后端以dynamic类获取数据,
    * 1-contentType:"application/json",
    * 2-data必须stringify*/
    jQuery.ajax({
        async: true,
        type: "post",
        //contentType: "application/json",单实体作为参数，只能默认
        url: "/api/XfywXfyw/BusinessFlowEdit",
        headers: {
            'Authorization': window.sessionStorage.getItem('token')
        },
        data: data.business_flow,
        success: function (res) {
            layer.close(index);
            camerastop();
            window.parent.postMessage({
                act: '红/黑名单审核完成',
                msg: {
                    answer: '我接收到啦！'
                }
            }, '*');
            layer.alert('修改成功！', { icon: 1 }, function (index) {
                parent.layer.close(parent.layindex2);
            });
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
        if ((str & mode == 0 & cs == 1) || (str & mode == 4 & cs == 2)) {
            cs = 0;
            str = captrue.sUpLoadImageEx2("d:\\camera-cgsjgpt\\" + token + ".jpg", window.sessionStorage.getItem("rooturl"), 80, "/api/FileManger/PostFilesForActivex", true, false);
            if (str.indexOf('"msg":"0"') > 0) {
                ret = JSON.parse(str);
                var obj = JSON.parse(JSON.stringify(data.currentzls[data.idx]));
                obj.SRC = ret.data[0];
                Vue.set(data.currentzls, data.idx, obj);
            }

        }
        else if (str & mode == 4 & cs == 1) {
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
