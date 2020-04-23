var laydate, layer
var data = {
    hphm: "川D",
    hpzlno: "02",
    hpzlname: "小型汽车",
    jdcsyr: "",
    gxr: '',
    yxqlx: '固定',
    jssj: '',
    memo: "",
    hpzls: []
}
var ready = layui.use(['laydate', 'layer'], function () {
    laydate = layui.laydate;
    layer = layui.layer;

    var vm = new Vue({
        el: "#root",
        data: data,
        beforeCreate: function () {
            init()
        },
        mounted: function () {
            laydate.render({
                elem: '#jssj',
                done: function done(value, date) {
                    data.jssj = value;
                }
            });
        },
        computed: {
            uphphm: {
                get: function () {
                    return this.hphm
                },
                set: function (val) {
                    this.hphm = val.toUpperCase()
                }
            },
            hpzlandhphm: function () {
                return this.hphm + this.hpzlno
            },
            hpzlandhphmistrue: function () {
                var b = true
                if (this.hpzlno === "51" || this.hpzlno === "52") {
                    b = this.hphm.length === 8 ? true : false
                }
                else {
                    b = this.hphm.length === 7 ? true : false
                }
                return b
            }
        },
        watch: {
            hpzlno: function (val) {
                var o = this.hpzls.filter(function (item) {
                    return item.hpzlno === val;
                })[0]
                if (o) {
                    this.hpzlname = o.hpname
                }
            },
            hpzlandhphm: function (val) {
                jdcxx(this.hpzlandhphmistrue)
            },
            yxqlx: function (val) {
                if (val === "永久") {
                    this.jssj = ""
                }
            }
        },
        methods: {
            save: function () {
                var msg = ""
                msg = msg + (this.hpzlandhphmistrue ? "" : "号牌信息不正确<br/>")
                msg = msg + (this.yxqlx === "固定" && !this.jssj ? "请选择有效期<br/>" : "")
                msg = msg + (this.jdcsyr ? "" : "请输入号牌<br/>")
                if (msg) {
                    layer.alert(msg, { icon: 2 });
                    return
                }
                layer.confirm("真的保存数据吗", {
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
            }
        }
    })
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
        url: "/api/HmdglWztc/Add",
        headers: {
            'Authorization': window.sessionStorage.getItem('token')
        },
        data: JSON.stringify(data),
        success: function (res) {
            layer.close(index);
            if (res === "0") {
                layer.alert("新增成功", { icon: 1 }, function (index) {
                    //do something
                    parent.layer.close(parent.layindex2);
                });

            }
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
function init() {
    var index = layer.load(0, { shade: [0.1, "#FFFFFF"] });
    jQuery.ajax({
        async: true,
        type: "get",
        contentType: "application/json",
        url: "/api/HmdglWztc/gethpzl",
        headers: {
            'Authorization': window.sessionStorage.getItem('token')
        },
        data: {},
        success: function (res) {
            layer.close(index);
            data.hpzls = res.data
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
function jdcxx(b) {
    if (!b) {
        layer.alert('号牌信息不正确', { icon: 2 });
        return
    }
    var index = layer.load(0, { shade: [0.1, "#FFFFFF"] });
    jQuery.ajax({
        async: true,
        type: "get",
        contentType: "application/json",
        url: "/api/HmdglWztc/getjdcxx",
        headers: {
            'Authorization': window.sessionStorage.getItem('token')
        },
        data: {
            hpzlno: data.hpzlno,
            hphm: data.hphm
        },
        success: function (res) {
            layer.close(index);
            data.jdcsyr = res.data
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