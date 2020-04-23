var AppData = JSON.parse(window.sessionStorage.getItem("AppData"))
var data = {
    id: GetUrlPara()[0].value,
    idx: 0,
    db: {},
    cameramode: false
}

var vm = new Vue({
    el: "#root",
    data: data,
    beforeCreate: function () {
        init();

    },
    updated: function () {
        var viewer = new Viewer(document.getElementById('root'), {
            title: true,
            toolbar: true,
            hidden: function () {
                //jQuery(".showimg").removeClass("showimg");
            }
        });
    },
    watch: {

    },
    methods: {
        save: function () {
            let msg = ""
            msg = (data.db.BALX == "" || data.db.BALX == null || data.db.BALX == undefined) ? msg + '<br>' + '请选择备案类型' : msg;
            msg = (data.db.DWLX == "" || data.db.DWLX == null || data.db.DWLX == undefined) ? msg + '<br>' + '请选择机构类型' : msg;
            msg = (data.db.ZZJGDM == "" || data.db.ZZJGDM == null || data.db.ZZJGDM == undefined) ? msg + '<br>' + '组织机构代码不能为空' : msg;
            msg = (data.db.DWMC == "" || data.db.DWMC == null || data.db.DWMC == null) ? msg + '<br>' + '单位名称不能为空' : msg;
            msg = (data.db.DWJBR == "" || data.db.DWJBR == null || data.db.DWJBR == null) ? msg + '<br>' + '单位经办人不能为空' : msg;
            msg = (data.db.LXDH == "" || data.db.LXDH == null || data.db.LXDH == null) ? msg + '<br>' + '经办人联系电话不能为空' : msg;
            msg = (data.db.ADDRESS == "" || data.db.ADDRESS == null || data.db.ADDRESS == null) ? msg + '<br>' + '单位地址不能为空' : msg;
            msg = (data.db.TEL == "" || data.db.TEL == null || data.db.TEL == null) ? msg + '<br>' + '单位电话不能为空' : msg;
            msg = (data.db.MEMO == "" || data.db.MEMO == null || data.db.MEMO == null) ? msg + '<br>' + '说明不能为空' : msg;
             msg = data.db.URL1 == "/web/images/zwtp.png" ? msg + '<br>' + '请采集组织机构代码证资料' : msg;
             msg = data.db.URL2 == "/web/images/zwtp.png" ? msg + '<br>' + '请采集委托书资料' : msg;

            if (msg != "") {
                layer.alert(msg, { icon: 2 })
                return;
            }

            layer.confirm("真的保存数据吗", {
                btn: ["确定", "放弃"]
            },
                function (index) {
                    layer.close(index);
                    save1();
                },
                function () {
                    return;
                }
            )
        },
        choosephoto: function (index, event) {
            let el = event.target;
            let obj = jQuery(el).parent().parent();
            jQuery("img", obj).removeClass("currentphoto");
            $("img", jQuery(el).parent()).addClass("currentphoto");
            this.cameramode = true;
            this.idx = index;

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
                    alert(e);
                    strHtml = "<br><font color='#FF00FF'>高拍仪控件未安装!点击这里<a href='../../../js/Doccamera/DoccameraOcx.exe' target='_self'>执行安装</a>,安装后请刷新页面或重新进入。</font>";
                    document.body.innerHTML = strHtml;
                }
            }
            cameraload();
        }
    }
})
function init() {
    var index = layer.load(0, { shade: [0.1, "#FFFFFF"] });
    /*post方法,方便后端以dynamic类获取数据,
     * 1-contentType:"application/json",
     * 2-data必须stringify*/
    jQuery.ajax({
        async: true,
        type: "get",
        contentType: "application/json",
        url: "/api/ZhglBagl/getSignDwba",
        headers: {
            'Authorization': window.sessionStorage.getItem('token')
        },
        data: {
            id:data.id
        },
        success: function (res) {
            layer.close(index);
            data.db = res.data;
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
}
function save1() {
    var index = layer.load(0, { shade: [0.1, "#FFFFFF"] });
    /*post方法,方便后端以dynamic类获取数据,
     * 1-contentType:"application/json",
     * 2-data必须stringify*/
    /*单个实体作为参数
尝试成功，也就是说，两种写法都是可行的。如果你指定了contentType为application / json，则必须要传递序列化过的对象；如果使用post请求的默认参数类型，则前端直接传递json类型的对象即可*/
    jQuery.ajax({
        async: true,
        type: "post",
        contentType: "application/json",
        url: "/api/ZhglBagl/editDwbaDb",
        headers: {
            'Authorization': window.sessionStorage.getItem('token')
        },
        data: JSON.stringify(data.db),
        success: function (res) {
            layer.close(index);
            layer.alert('保存成功！', { icon: 1 }, function (index) {
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
            return;
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
        jQuery("#rdev").val("关闭设备");
        jQuery("input[name='mode']").eq(0).attr("checked", true);
        layer.close(index);
    }
}
function camerastop() {
    str = captrue.bStopPlay();
    isopened = false;
    cs = 0;
    jQuery("#rdev").val("打开设备");
    data.cameramode = false;
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
                if (data.idx == 1) data.db.URL1 = ret.data[0];
                if (data.idx == 2) data.db.URL2 = ret.data[0];
                if (data.idx == 3) data.db.URL3 = ret.data[0];
                if (data.idx == 4) data.db.URL4 = ret.data[0];
                if (data.idx == 5) data.db.URL5 = ret.data[0];
                if (data.idx == 6) data.db.URL6 = ret.data[0];

                camerastop();
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
