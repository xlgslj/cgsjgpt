var AppData = JSON.parse(window.sessionStorage.getItem("AppData"))

var data = {
    id: GetUrlPara()[0].value,
    businessinfo: {},
    driverandvehicle: {},
    spcontent: "",
    blzls: null,
    showhmd: false,
    showbg:false
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
        save: function (zt) {
            if (zt == 1) {
                layer.confirm("确定审核通过？", {
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
            }
            else if (zt == 4) {
                layer.confirm("确定终止办理此项业务？", {
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
            }
            else if (zt == 0) {
                layer.prompt({
                    title: '请输入审核不通过原因，并确认',
                    formType: 0
                }, function (value, index) {
                    data.spcontent = value;
                    layer.close(index);
                    layer.confirm("确定审核不通过？", {
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
                });

            }
        },
        showimg: function (event) {
            if (this.showbg) {
                var el = event.target;
                $(el).addClass("showimg");
            }
        },
        showhmdfun: function () {
            this.showhmd = !this.showhmd;
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
        url: "/api/XfywXfyw/GetSingleBusiness",
        headers: {
            'Authorization': window.sessionStorage.getItem('token')
        },
        data: {
            id: data.id
        },
        success: function (res) {
            data.businessinfo = res.data;
            var blms = data.businessinfo.BLMS;
            data.blzls = blms == "本人办理" ? JSON.parse(data.businessinfo.BRZLS) : (blms == "代理个人业务" ? JSON.parse(data.businessinfo.DLRZLS) : JSON.parse(data.businessinfo.DWZLS))
            try {
                data.driverandvehicle = JSON.parse(data.businessinfo.DRVANDVEHINFO);
            }
            catch (e) { }
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
        url: "/api/XfywXfyw/BusinessSp",
        headers: {
            'Authorization': window.sessionStorage.getItem('token')
        },
        data: JSON.stringify({
            id: data.id,
            zt: zt,
            spcontent: data.spcontent
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
