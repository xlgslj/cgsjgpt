var AppData = JSON.parse(window.sessionStorage.getItem("AppData"))

var data = {
    driverandvehicle: {},
    where: {
        id: GetUrlPara()[0].value,
        zl: GetUrlPara()[1].value,
        brname: decodeURIComponent(GetUrlPara()[2].value),
        brzjhm: GetUrlPara()[3].value,
        dlrname: decodeURIComponent(GetUrlPara()[4].value),
        dlrzjhm: GetUrlPara()[5].value,

    }
}
var vm = new Vue({
    el: "#root",
    data: data,
    watch: {

    },
    beforeCreate: function () {
        init();
    },
    updated: function () {
        //$('select.select').select();
    },
    methods: {

    }
})
function init() {
    var index = layer.load(0, {
        shade: [0.1, "#FFFFFF"]
    });
    jQuery.ajax({
        async: true,
        type: "get",
        contentType: "application/json",
        url: "/api/YjglYjgl/QueryHmd",
        headers: {
            'Authorization': window.sessionStorage.getItem('token')
        },
        data: {
            id: data.where.id,
            zl: data.where.zl

        },
        success: function (res) {
            data.driverandvehicle = JSON.parse(res.data)
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
    })
}
