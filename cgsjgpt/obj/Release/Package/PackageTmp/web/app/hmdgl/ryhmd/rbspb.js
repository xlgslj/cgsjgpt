var AppData = JSON.parse(window.sessionStorage.getItem("AppData"))

var data = {
    id: GetUrlPara()[0].value,
    rbinfo: {}
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
        rbinfo: function (nv) {
            this.$refs.sqzl.setContent(nv.CAUSE)
        }
    },
    methods: {
        save: function (zt) {
            layer.confirm("确定" + (zt == '有效' ? '审核通过？' : '审核不通过？'), {
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
        test: function () {
            console.log(this.$refs.sqzl.getContent())
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
        url: "/api/HmdglRyhmd/GetSingleRb",
        headers: {
            'Authorization': window.sessionStorage.getItem('token')
        },
        data: {
            id: data.id
        },
        success: function (res) {
            data.rbinfo = res.memo1
            let txt = data.rbinfo.OPERLX;//data.rbinfo.OPERLX!="变更"?data.rbinfo.OPERLX:data.rbinfo.OPERLX+":"+data.rbinfo.OPLOG;
            wm_test(txt);
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
    /*post方法,方便后端以dynamic类获取数据,
     * 1-contentType:"application/json",
     * 2-data必须stringify*/
    jQuery.ajax({
        async: true,
        type: "post",
        contentType: "application/json",
        url: "/api/HmdglRyhmd/RbSp",
        headers: {
            'Authorization': window.sessionStorage.getItem('token')
        },
        data: JSON.stringify({
            id: data.id,
            zt: zt
        }),
        success: function (res) {
            layer.close(index);
            window.parent.postMessage({
                act: '红/黑名单审核完成',
                msg: {
                    answer: '我接收到啦！'
                }
            }, '*');
            layer.alert('审核完成！', { icon: 1 }, function (index) {
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
function wm_test(txt) {
    var config = {};

    config.watermark_txt = txt;

    config.watermark_x = 20;

    config.watermark_y = 20;

    config.watermark_rows = 0;

    config.watermark_cols = 0;

    config.watermark_x_space = 100;

    config.watermark_y_space = 50;

    config.watermark_font = "微软雅黑";

    config.watermark_color = "red";

    config.watermark_fontsize = "50px";

    config.watermark_alpha = 0.15;

    config.watermark_width = 300;

    config.watermark_height = 200;

    config.watermark_angle = 15;
    //all push

    watermark.load(config);
}


