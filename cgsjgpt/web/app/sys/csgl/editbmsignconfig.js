var data = {
    config: {
        ID: GetUrlPara()[0].value
    }
}
var vm = new Vue({
    el: "#root",
    data: data,
    beforeCreate: function () {
        init();
    },
    methods: {
        save: function () {
            //询问框
            layer.confirm('确定保存？', {
                btn: ['确定', '放弃'] //按钮

            }, function (index) {
                save1();
                layer.close(index);
            }, function () {
                return;
            });
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
        url: "/api/SysCsConfig/GetSingBmConfig",
        headers: {
            'Authorization': window.sessionStorage.getItem('token')
        },
        data: {
            id: data.config.ID
        },
        success: function (res) {
            data.config = res.Data;
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
        url: "/api/SysCsConfig/SaveSingBmConfig",
        headers: {
            'Authorization': window.sessionStorage.getItem('token')
        },
        data: JSON.stringify(data.config),
        success: function (res) {
            layer.close(index);
            let v = "";
            v = data.config.V1 == null ? v : v + data.config.V1;
            v = data.config.V2 == null ? v : v + "|" + data.config.V2;
            v = data.config.V3 == null ? v : v + "|" + data.config.V3;
            v = data.config.V4 == null ? v : v + "|" + data.config.V4;
            v = data.config.V5 == null ? v : v + "|" + data.config.V5;
            window.parent.postMessage({
                act: '机构参数设置完成',
                msg: {
                    answer: v
                }
            }, '*');
            window.parent.layer.close(window.parent.layindex2);
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
