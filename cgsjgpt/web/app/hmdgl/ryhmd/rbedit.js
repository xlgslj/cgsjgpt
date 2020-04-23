var AppData = JSON.parse(window.sessionStorage.getItem("AppData"))

var data = {
    id: GetUrlPara()[0].value,
    rbinfo: {},
    cameramode: false,
    idx: 0,
}
Vue.component('lj-edit', {
    data: function () {
        return {
            editorContent: "",
            el: null
        }
    },
    methods: {
        getContent: function () {
            return this.editorContent;
        },
        setContent: function (txt) {
            this.el.txt.html(txt)
        }
    },
    mounted: function () {
        var E = window.wangEditor
        var editor = new E(this.$refs.editor)
        editor.customConfig.onchange = function (html) {
            this.editorContent = html
            data.rbinfo.CAUSE = html
        }
        editor.customConfig.uploadImgHeaders = {
            'Authorization': window.sessionStorage.getItem('token')
        }
        editor.customConfig.uploadImgServer = '/api/FileManger/PostFiles'
        editor.customConfig.uploadImgHooks = {
            before: function (xhr, editor, files) {
                // 图片上传之前触发
                // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，files 是选择的图片文件

                // 如果返回的结果是 {prevent: true, msg: 'xxxx'} 则表示用户放弃上传
                // return {
                //     prevent: true,
                //     msg: '放弃上传'
                // }
            },
            success: function (xhr, editor, result) {
                // 图片上传并返回结果，图片插入成功之后触发
                // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，result 是服务器端返回的结果
            },
            fail: function (xhr, editor, result) {
                // 图片上传并返回结果，但图片插入错误时触发
                // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，result 是服务器端返回的结果
                alert(result.msg)
            },
            error: function (xhr, editor) {
                // 图片上传出错时触发
                // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象

            },
            timeout: function (xhr, editor) {
                // 图片上传超时时触发
                // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象
            }
        }

        editor.create()
        this.el = editor
        // editor.txt.html(data.rbinfo.CAUSE)
        // editor.cmd.do('insertHTML', this.editorContent)
    },
    //template: '<button v-on:click="count++">You clicked me {{ count }} times.</button>'
    template: '<div ref="editor" style="text-align:left"></div>'

})
var vm = new Vue({
    el: "#root",
    data: data,
    beforeCreate: function () {
        init();
    },
    watch: {
        rbinfo: function (nv) {
            this.$refs.sqzl.setContent(nv.CAUSE)
        }
    },
    methods: {
        save: function (zt) {
            let msg = ""
            msg = data.rbinfo.NAME == "" ? msg + '<br>' + '姓名不能为空' : msg;
            msg = data.rbinfo.SFZHM.length == 18 ? msg : msg + '<br>' + '身份证号不正确';
            msg = data.rbinfo.TEL == "" ? msg + '<br>' + '手机号码不正确' : msg;
            msg = data.rbinfo.MEMO == "" ? msg + '<br>' + '说明不能为空' : msg;
            msg = (data.rbinfo.LX == '红名单' && (data.rbinfo.DLFW == '' || data.rbinfo.DLFW == null || data.rbinfo.DLFW == undefined)) ? msg + '<br>' + '请选择代理范围' : msg;
            msg = (data.rbinfo.LX == '红名单' && (data.rbinfo.ZZJGDM == '' || data.rbinfo.ZZJGDM == null || data.rbinfo.ZZJGDM == undefined)) ? msg + '<br>' + '组织机构代码不能为空' : msg;
            msg = (data.rbinfo.LX == '红名单' && (data.rbinfo.DWNAME == '' || data.rbinfo.DWNAME == null || data.rbinfo.DWNAME == undefined)) ? msg + '<br>' + '单位名称不能为空' : msg;
            msg = (data.rbinfo.LX == '红名单' && (data.rbinfo.IMG1 == '' || data.rbinfo.IMG1 == null || data.rbinfo.IMG1 == undefined || data.rbinfo.IMG2 == '' || data.rbinfo.IMG2 == null || data.rbinfo.IMG2 == undefined)) ? msg + '<br>' + '图片资料没有上传' : msg;

            if (msg != "" && zt == "提请变更") {
                layer.alert(msg, { icon: 2 })
                return;
            }
            layer.confirm("确定" + zt, {
                btn: ["确定", "放弃"]
            },
                function (index) {
                    layer.close(index);
                    save1(zt);
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
            $(el).addClass("currentphoto");
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
        },
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
        url: "/api/HmdglRyhmd/GetSingleRb",
        headers: {
            'Authorization': window.sessionStorage.getItem('token')
        },
        data: {
            id: data.id
        },
        success: function (res) {
            data.rbinfo = res.memo1
            layer.close(index);
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
function save1(zt) {
    var index = layer.load(0, { shade: [0.1, "#FFFFFF"] });
    data.rbinfo.OPERLX = zt == "提请变更" ? "变更" : "删除"

    /*单个实体作为参数
    尝试成功，也就是说，两种写法都是可行的。如果你指定了contentType为application / json，则必须要传递序列化过的对象；如果使用post请求的默认参数类型，则前端直接传递json类型的对象即可*/
    jQuery.ajax({
        async: true,
        type: "post",
        contentType: "application/json",
        url: "/api/HmdglRyhmd/RbEdit",
        headers: {
            'Authorization': window.sessionStorage.getItem('token')
        },
        data:JSON.stringify( data.rbinfo),
        success: function (res) {
            layer.close(index);
            layer.alert('完成！', { icon: 1 }, function (index) {
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
                if (data.idx == 1) data.rbinfo.IMG1 = ret.data[0];
                if (data.idx == 2) data.rbinfo.IMG2 = ret.data[0];
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
