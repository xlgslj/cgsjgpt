var AppData = JSON.parse(window.sessionStorage.getItem("AppData"))
var data = {
    zjlxs: AppData.Zjlx,
    zjlx: "居民身份证",
    name: "",
    zjhm: ""
}
var vm = new Vue({
    el: "#root",
    data: data,
    methods: {
        save: function () {
            let msg = "";
            msg = msg + (this.name == "" ? "名称必须输入" : "");
            msg = msg + (this.zjhm == "" ? "证件号码必须输入" : "");
            msg = msg + (this.zjlx == "居民身份证" && this.zjhm.length < 18 ? "身份证输入错误" : "");
            if (msg != "") {
                layer.alert(msg, { icon: 2 })
                return;
            }

            layer.confirm("真的保存数据吗", {
                btn: ["确定", "放弃"]
            },
                function (index) {
                    save1();
                    layer.close(index);
                },
                function () {
                    return;
                }
            )
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
        url: "/api/ZhglPzgl/SgAdd",
        headers: {
            'Authorization': window.sessionStorage.getItem('token')
        },
        data: JSON.stringify(data),
        success: function (res) {
            layer.confirm("成功,是否继续新增？", {
                btn: ["是", "否"]
            },
                function (index) {
                    data.zjlx = "居民身份证";
                    data.name = "";
                    data.zjhm = "";
                    layer.close(index);
                },
                function () {
                    parent.layer.close(parent.layindex);
                }
            )
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