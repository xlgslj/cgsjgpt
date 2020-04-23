var AppData = JSON.parse(window.sessionStorage.getItem("AppData"))

var data = {
    driverandvehicle: {},
    where: {
        brzjlx: GetUrlPara()[0].value,
        brzjhm: GetUrlPara()[1].value,
        dlrzjlx: GetUrlPara()[2].value,
        dlrzjhm: GetUrlPara()[3].value,
        blms: GetUrlPara()[4].value
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
        url: "/api/SysPublicMethod/QueryVehicleAndDriverForXfywHmd",
        headers: {
            'Authorization': window.sessionStorage.getItem('token')
        },
        data: data.where,
        success: function (res) {
            data.driverandvehicle = res.data
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
