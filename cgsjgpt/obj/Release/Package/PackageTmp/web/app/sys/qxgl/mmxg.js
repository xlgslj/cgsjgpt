var AppData = JSON.parse(window.sessionStorage.getItem("AppData"))
var data = {
    oldpwd: "",
    pwd1: "",
    pwd2:""
}
var vm = new Vue({
    el: "#root",
    data: data,
    methods: {
        save: function () {
            let msg = "";
            msg = msg + (this.oldpwd == ""||this.pwd1==""||this.pwd2=="" ? "必须输入" : "");
            msg = msg + (this.pwd1!= this.pwd2 ? "两次密码输入不正确" : "");

            if (msg != "") {
                layer.alert(msg, { icon: 2 })
                return;
            }

            layer.confirm("真的要修改吗", {
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
        url: "/api/SysQxUser/EditPwd",
        headers: {
            'Authorization': window.sessionStorage.getItem('token')
        },
        data: JSON.stringify(data),
        success: function (res) {
            layer.close(index);
            layer.alert('成功！', { icon: 1 }, function (index) {
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