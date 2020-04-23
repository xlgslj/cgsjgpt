var AppData = JSON.parse(window.sessionStorage.getItem("AppData"))

var data = {
    id: GetUrlPara()[0].value,
    warnlog: null,
    flow: null,
    main: null,
    blzls: null,
    showbg: false
}
var vm = new Vue({
    el: "#root",
    data: data,
    beforeCreate: function () {
        init();
    },
    updated: function () {
        var viewer = new Viewer(document.getElementById('view'), {
            title: true,
            toolbar: true,
            hidden: function () {
                jQuery(".showimg").removeClass("showimg");
            }
        });
    },
    methods: {
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
        },
        showimg: function (event) {
            if (this.showbg) {
                var el = event.target;
                $(el).addClass("showimg");
            }
        },
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
        url: "/api/XfywXfyw/GetSingleBusiness",
        headers: {
            'Authorization': window.sessionStorage.getItem('token')
        },
        data: {
            id: data.id
        },
        success: function (res) {
            data.flow = res.flow;
            data.main = res.data;
            var blms = data.main.BLMS;
            data.blzls = blms == "本人办理" ? JSON.parse(data.main.BRZLS) : (blms == "代理个人业务" ? JSON.parse(data.main.DLRZLS) : JSON.parse(data.main.DWZLS))
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
