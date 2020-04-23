var data = {
    id: GetUrlPara()[0].value,
    ywlx: {},
    count: 0
}
var vm = new Vue({
    el: "#app",
    data: data,
    computed: {
        upcode: {
            get: function () {
                return this.ywlx.CODE
            },
            set: function (val) {
                this.ywlx.CODE = val.toUpperCase()
            }
        }
    },
    beforeCreate: function () {
        init();
    },
    methods: {
        save: function () {
            _save()
        }
    }
})

function init() {
    jQuery.ajax({
        async: true,
        type: "get",
        contentType: "application/json",
        url: "/api/SysCsYwlx/GetYwlx",
        headers: {
            'Authorization': window.sessionStorage.getItem('token')
        },
        data: {
            id: data.id
        },
        success: function (res) {
            data.ywlx = res.data
            data.count = res.count
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
function _save() {
    var index = layer.load(0, { shade: [0.1, "#FFFFFF"] });
    /*post方法,方便后端以dynamic类获取数据,
     * 1-contentType:"application/json",
     * 2-data必须stringify*/
    jQuery.ajax({
        async: true,
        type: "post",
        contentType: "application/json",
        url: "/api/SysCsYwlx/EditCodeYwlx",
        headers: {
            'Authorization': window.sessionStorage.getItem('token')
        },
        data: JSON.stringify(data.ywlx),
        success: function (res) {
            layer.close(index);
            layer.alert('成功！', { icon: 1 }, function (index) {
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
    })
}