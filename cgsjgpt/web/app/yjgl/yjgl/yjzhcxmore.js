var AppData = JSON.parse(window.sessionStorage.getItem("AppData"))

var data = {
    id: GetUrlPara()[0].value,
    warnlog: null,
    flow: null,
    main: null
}
Vue.component('lj-edit', {
    data: function () {
        return {
            editorContent: ''
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
            data.warnlog.MEMO1 = html
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
        editor.txt.html(data.warnlog.MEMO1)
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

    },
    methods: {
        showNotice: function (id, zl) {
            if (zl == "机动车") {
                window.parent.layindex3 = window.parent.layer.open({
                    title: "退办信息",
                    type: 2,
                    area: [parent.window.innerWidth >= 1000 ? "1000px" : "90%", parent.window.innerHeight >= 900 ? "900px" : "90%"],
                    fixed: false,
                    //不固定
                    maxmin: true,
                    content: ["app/dtgl/ywbl/queryjdcywgzs-more.html?id=" + id, (parent.window.innerWidth >= 1000 && parent.window.innerHeight >= 900 ? "no" : "yes")]
                });
            }
            else if (zl == "驾驶证") {
                window.parent.layindex3 = window.parent.layer.open({
                    title: "退办信息",
                    type: 2,
                    area: [parent.window.innerWidth >= 1000 ? "1000px" : "90%", parent.window.innerHeight >= 800 ? "800px" : "90%"],
                    fixed: false,
                    //不固定
                    maxmin: true,
                    content: ["app/dtgl/ywbl/queryjszywgzs-more.html?id=" + id, (parent.window.innerWidth >= 1000 && parent.window.innerHeight >= 800 ? "no" : "yes")]
                });
            }
        },
        showHmd: function (id, zl, brname, brzjhm, dlrname, dlrzjhm) {

            window.parent.layindex3 = window.parent.layer.open({
                title: "黑名单查询",
                type: 2,
                area: [parent.window.innerWidth >= 800 ? "800px" : "90%", parent.window.innerHeight >= 700 ? "700px" : "90%"],
                fixed: false,
                //不固定
                maxmin: true,
                content: ["app/yjgl/yjgl/hmdcx.html?id=" + id + "&zl=" + zl + "&brname=" + encodeURIComponent(brname) + "&brzjhm=" + brzjhm + "&dlrname=" + encodeURIComponent(dlrname) + "&dlrzjhm=" + dlrzjhm, (parent.window.innerWidth >= 800 && parent.window.innerHeight >= 700 ? "no" : "yes")]
            });
        },
        save: function () {
            if (this.warnlog.HCJG == null || this.warnlog.HCJG == undefined || this.warnlog.HCJG == "") {
                layer.alert("核查结果未确定!", { icon: 2 });
                return;
            }
            layer.confirm("确定核查完毕？", {
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
        url: "/api/YjglYjgl/GetSignWarnlog",
        headers: {
            'Authorization': window.sessionStorage.getItem('token')
        },
        data: {
            id: data.id
        },
        success: function (res) {
            data.warnlog = res.warnlog;
            data.flow = res.flow;
            data.main = res.main;
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
            else { alert('错误:' + ret.Message) }try{layer.close(index);}catch(e){}
            return;
        }
    });
}
function save1() {
    var index = layer.load(0, { shade: [0.1, "#FFFFFF"] });
    /*post方法,方便后端以dynamic类获取数据,
     * 1-contentType:"application/json",
     * 2-data必须stringify*/
    jQuery.ajax({
        async: true,
        type: "post",
        contentType: "application/json",
        url: "/api/YjglYjgl/YwblHcSave",
        headers: {
            'Authorization': window.sessionStorage.getItem('token')
        },
        data: JSON.stringify(data.warnlog),
        success: function (res) {
            layer.close(index);
            window.parent.postMessage({
                act: '预警核查完毕',
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
            else { alert('错误:' + ret.Message) }try{layer.close(index);}catch(e){}
            return;
        }
    });
}
