var AppData = JSON.parse(window.sessionStorage.getItem("AppData"))

var data = {
    id: GetUrlPara()[0].value,
    businessinfo: {},
    blzls: null,
    hpzls: null,
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
            let msg = '';
            msg = msg + (data.businessinfo.XTLB==='机动车'&&(data.businessinfo.CJGLSH === null || data.businessinfo.CJGLSH === undefined || data.businessinfo.CJGLSH === '') ? "车驾管流水号必须输入<br/>" : "");
            msg = msg + ((data.businessinfo.HPHM === null || data.businessinfo.HPHM === undefined || data.businessinfo.HPHM === '') ? "号牌号码必须输入<br/>" : "");

            if (msg!="") {
                layer.alert(msg, { icon: 2 })
                return;
            }
            layer.confirm("确定保存补录信息？", {
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
            data.businessinfo = res.data
            var blms = data.businessinfo.BLMS;
            data.blzls = blms == "本人办理" ? JSON.parse(data.businessinfo.BRZLS) : (blms == "代理个人业务" ? JSON.parse(data.businessinfo.DLRZLS) : JSON.parse(data.businessinfo.DWZLS))
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
    jQuery.ajax({
        async: true,
        type: "get",
        contentType: "application/json",
        url: "/api/SysPublicMethod/GetCode",
        headers: {
            'Authorization': window.sessionStorage.getItem('token')
        },
        data: {
            lb: "['综合平台业务@系统@号牌种类']"
        },
        success: function (res) {
            data.hpzls = res.Data
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
function save1() {
    var index = layer.load(0, { shade: [0.1, "#FFFFFF"] });
    /*post方法,方便后端以dynamic类获取数据,
     * 1-contentType:"application/json",
     * 2-data必须stringify*/
    jQuery.ajax({
        async: true,
        type: "post",
        contentType: "application/json",
        url: "/api/XfywXfyw/BusinessXxbl",
        headers: {
            'Authorization': window.sessionStorage.getItem('token')
        },
        data: JSON.stringify({
            id: data.businessinfo.ID,
            cjglsh: data.businessinfo.CJGLSH,
            cylsh: data.businessinfo.CYLSH
        }),
        success: function (res) {
            layer.close(index);
            window.parent.postMessage({
                act: '红/黑名单审核完成',
                msg: {
                    answer: '我接收到啦！'
                }
            }, '*');
            layer.alert('完成！', { icon: 1 }, function (index) {
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
