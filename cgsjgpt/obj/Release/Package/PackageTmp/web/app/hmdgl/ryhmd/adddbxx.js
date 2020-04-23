var AppData = JSON.parse(window.sessionStorage.getItem("AppData"))

var data = {
    ywlx: "机动车业务",
    brname: "",
    brsfzhm: "",
    dlrname: "",
    dlrsfzhm: "",
    jbxx: {
        driver1: null,
        vehicles1: []

    },
    agents: [],
    rblist: null,
    zjlxs: AppData.Zjlx,
    zjlx: "居民身份证",
    showdsr: false,
    showdlr: false
}
var vm = new Vue({
    el: "#root",
    data: data,
    watch: {
        brsfzhm: function () {
            this.brname = "";
        },
        dlrsfzhm: function () {
            this.dlrname = "";
        }
    },
    updated: function () {
        //$('select.select').select();
    },
    computed: {
        brzjhmistrue: function () {
            let b = true;
            b = ((this.zjlx === "居民身份证" && this.brsfzhm.length == 18) || (this.zjlx != "居民身份证" && this.brsfzhm.length > 0)) ? true : false;
            //b=b&&(this.brname===""||this.brname===undefined||this.brname===null?false:true);
            return b;
        },
        brnameistrue: function () {
            return !(this.brname === "" || this.brname === undefined || this.brname === null);
        },
        dlrzjhmistrue: function () {
            return this.dlrsfzhm.length == 18
        },
        dlrnameistrue: function () {
            return !(this.dlrname === "" || this.dlrname === undefined || this.dlrname === null);
        },
        addAllow: function () {
            return this.brzjhmistrue && this.brnameistrue && this.dlrzjhmistrue && this.dlrnameistrue;
        }
    },
    methods: {
        save: function () {
            if (data.brname == "" || data.brsfzhm.length != 18 || data.dlrname == "" || data.dlrsfzhm.length != 18) {
                layer.alert("信息不正确", { icon: 2 });
                return;
            }
            layer.confirm("真的要新增代办记录吗", {
                btn: ["确定", "放弃"]
            },
                function (index) {
                    layer.close(index);
                    save();
                },
                function () {
                    return;
                }
            )

        },
        querydbjl: function () {
            if (data.dlrsfzhm.length == 18) {
                querydbjl(data.dlrsfzhm);
            }
            else {
                layer.alert("身份证号码不正确", { icon: 2 });
            }

        },
        queryjbxx: function () {
            let msg = "";
            msg += ((data.zjlx === "居民身份证" && data.brsfzhm.length != 18) || (data.zjlx != "居民身份证" && data.brsfzhm.length == 0)) ? "号码不正确" : "";
            if (msg==="") {
                queryjbxx(data.brsfzhm);
            }
            else {
                layer.alert(msg, { icon: 2 });
            }
        }
    }
})
function queryjbxx(sfzh) {
    data.showdsr = true;
    var index = layer.load(0, { shade: [0.1, "#FFFFFF"] });
    /*post方法,方便后端以dynamic类获取数据,
     * 1-contentType:"application/json",
     * 2-data必须stringify*/
    jQuery.ajax({
        async: true,
        type: "get",
        contentType: "application/json",
        url: "/api/SysPublicMethod/QueryVehicleAndDriver",
        headers: {
            'Authorization': window.sessionStorage.getItem('token')
        },
        data: {
            zjhm: data.brsfzhm,
            zjlx: data.zjlx
        },
        success: function (res) {
            data.jbxx = { driver1: res.drv, vehicles1: res.vehs }
            data.brname = res.key1;
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
function querydbjl(sfzh) {
    data.showdlr = true;
    var index = layer.load(0, { shade: [0.1, "#FFFFFF"] });
    /*post方法,方便后端以dynamic类获取数据,
     * 1-contentType:"application/json",
     * 2-data必须stringify*/
    jQuery.ajax({
        async: true,
        type: "get",
        contentType: "application/json",
        url: "/api/HmdglRyhmd/GetAgentsAndIsHmd",
        headers: {
            'Authorization': window.sessionStorage.getItem('token')
        },
        data: {
            sfzhm: data.dlrsfzhm
        },
        success: function (res) {
            data.agents = res.Data
            data.rblist = res.hmd;
            try {
                data.dlrname = data.agents[0].DLRNAME;
            }
            catch (e) {
                data.dlrname = "";
            }
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
function save() {
    var index = layer.load(0, { shade: [0.1, "#FFFFFF"] });
    /*post方法,方便后端以dynamic类获取数据,
     * 1-contentType:"application/json",
     * 2-data必须stringify*/
    jQuery.ajax({
        async: true,
        type: "post",
        contentType: "application/json",
        url: "/api/HmdglRyhmd/AddAgent",
        headers: {
            'Authorization': window.sessionStorage.getItem('token')
        },
        data: JSON.stringify({
            ywlx: data.ywlx,
            zjlx: data.zjlx,
            brname: data.brname,
            brsfzhm: data.brsfzhm,
            dlrname: data.dlrname,
            dlrsfzhm: data.dlrsfzhm
        }),
        success: function (res) {
            layer.close(index);
            layer.alert("加入成功", { icon: 2 });
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
            else { alert('错误:' + ret.Message) } try { layer.close(index); } catch (e) { }
            return;
        }
    });
}
$(".tab > li").click(function () {
    $(".tab > li").removeClass("tabcurrent");
    $(this).addClass("tabcurrent");
    $(".website,.userinfo").hide();
    $("#" + $(".tab >li.tabcurrent").attr("name")).show();
});
function tab(id) {
    $(".tab > li").removeClass("tabcurrent");
    $(".tab > li[name=" + id + "]").addClass("tabcurrent");
    $(".website,.userinfo").hide();
    $("#" + id).show();
}