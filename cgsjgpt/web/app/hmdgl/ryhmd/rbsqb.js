var AppData = JSON.parse(window.sessionStorage.getItem("AppData"))
var data = {
    mdlx: "黑名单",
    dlfw: "",
    sqrname: "",
    sqrsfzmhm: "",
    tel: "",
    dwname: "",
    zzjgdm: "",
    sqs: "/web/images/zwtp.png",
    zzjgdmz: "/web/images/zwtp.png",
    idx: 0,
    memo: "",
    content: "",
    cameramode: false
}
Vue.component('lj-edit', {
    data: function () {
        return {
            editorContent: "建议将技术方案中诱导屏立杆"
        }
    },
    methods: {
        getContent: function () {
            return this.editorContent;
        }
    },
    mounted: function () {
        var E = window.wangEditor
        var editor = new E(this.$refs.editor)
        editor.customConfig.onchange = function (html) {
            this.editorContent = html
            data.content = html
        }
        editor.customConfig.uploadImgHeaders = {
            'Authorization': window.sessionStorage.getItem('token')
        }
        editor.customConfig.uploadImgServer = '/api/FileManger/PostFiles'
        editor.customConfig.uploadImgTimeout = 30000
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
        //editor.txt.html('<p>方案中诱导屏计划新建22套</p><br/>')
        // editor.cmd.do('insertHTML', this.editorContent)
    },
    //template: '<button v-on:click="count++">You clicked me {{ count }} times.</button>'
    template: '<div ref="editor" style="text-align:left"></div>'

})
var vm = new Vue({
    el: "#root",
    data: data,
    watch: {
        mdlx: function (nv, ov) {
            this.dlfw = nv == "红名单" ? "本单位" : "";
        }
    },
    methods: {
        save: function () {
            let msg = ""
            msg = data.sqrname == "" ? msg + '<br>' + '姓名不能为空' : msg;
            msg = data.sqrsfzmhm.length == 18 ? msg : msg + '<br>' + '身份证号不正确';
            msg = data.tel == "" ? msg + '<br>' + '手机号码不正确' : msg;
            msg = data.memo == "" ? msg + '<br>' + '说明不能为空' : msg;
            msg = (data.mdlx == '红名单' && (data.dlfw == '' || data.dlfw == null || data.dlfw == undefined)) ? msg + '<br>' + '请选择代理范围' : msg;
            msg = (data.mdlx == '红名单' && (data.zzjgdm == '' || data.zzjgdm == null || data.zzjgdm == undefined)) ? msg + '<br>' + '组织机构代码不能为空' : msg;
            msg = (data.mdlx == '红名单' && data.dwname == '') ? msg + '<br>' + '单位名称不能为空' : msg;
            msg = (data.mdlx == '红名单' && (data.sqs == '/web/images/zwtp.png' || data.zzjgdmz == '/web/images/zwtp.png')) ? msg + '<br>' + '图片资料没有上传' : msg;

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
        test: function () {
            console.log(this.$refs.sqzl.getContent())
        }
    }
})
function save1() {
    var index = layer.load(0, { shade: [0.1, "#FFFFFF"] });
    /*post方法,方便后端以dynamic类获取数据,
     * 1-contentType:"application/json",
     * 2-data必须stringify*/
    jQuery.ajax({
        async: true,
        type: "post",
        contentType: "application/json",
        url: "/api/HmdglRyhmd/RBlistAdd",
        headers: {
            'Authorization': window.sessionStorage.getItem('token')
        },
        data: JSON.stringify(data),
        success: function (res) {
            layer.close(index);
            layer.alert('保存成功！', { icon: 1 }, function (index) {
                parent.layer.close(parent.layindex);
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
function editorinit() {
    var E = window.wangEditor
    var editor = new E('#sqzl')
    editor.customConfig.debug = true
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
                if (data.idx == 1) data.sqs = ret.data[0];
                if (data.idx == 2) data.zzjgdmz = ret.data[0];
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
