var AppData = JSON.parse(window.sessionStorage.getItem("AppData"))
var data = {
    zzjgdm: GetUrlPara()[0].value,
    db: null,
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
        url: "/api/ZhglBagl/getSignDwbaFromZzjgdm",
        headers: {
            'Authorization': window.sessionStorage.getItem('token')
        },
        data: {
            zzjgdm: data.zzjgdm
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
