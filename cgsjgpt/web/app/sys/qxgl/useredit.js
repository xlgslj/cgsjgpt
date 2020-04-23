var AppData = JSON.parse(window.sessionStorage.getItem("AppData"))
Vue.component('treeselect', VueTreeselect.Treeselect);
var data = {
    id: GetUrlPara()[0].value,
    user: JSON.parse(window.sessionStorage.getItem("user")),
    dwno: null,
    dwmc: null,
    jgdws: [],
    loginname: "",
    name: "",
    sfzhm: "",
    mmyxq: "",
    lxdh: "",
    kqipxz: false,
    ip1: "",
    ip2: "",
    ip3: "",
    zhzt: "正常",
    pjxtzh: "",
    lxdz: "",
    qd: false,
    memo: "",
    ssks: "0",
    qxlx: "角色权限",
    ssqx: [],
    AccountStatus: AppData.AccountStatus,
    Office: AppData.Office,
    roles: [],
    menus: [],
    menus1: [],
    dws: [],
    dws1: []
}
var vm = new Vue({
    el: "#root",
    data: data,
    beforeCreate: function () {
        init();
    },
    watch: {
        qxlx: function () {
            this.ssqx = [];
        }

    },
    updated: function () {
        $(".tab>li").click(function () {
            $(".tab > li").removeClass("tabcurrent");
            $(this).addClass("tabcurrent");
            $(".website,.userinfo").hide();
            $("#" + $(".tab >li.tabcurrent").attr("name")).show();
        });
    },
    mounted: function () {
        $("#start").datepicker({
            "language": "zh-CN",
            "format": 'yyyy-mm-dd'
        }).on("changeDate", function () {
            data.mmyxq = $("#start").val();
        })

        $(".date .iconfont").click(function () {
            $(this).prev().trigger("focus");
        });

    },
    methods: {
        ckAllChange: function (i1, i2, event) {
            var el = event.target;
            var ck = $(el).is(':checked')
            this.menus1[i1].childs[i2].childs.forEach(function (item, index) {
                let o = JSON.parse(JSON.stringify(item));
                o.CK = ck;
                data.menus1[i1].childs[i2].childs.splice(index, 1, o);
            })
        },
        checkboxChange: function (event) {
            var el = event.target;
            var ck = $(el).is(':checked')
            var p = jQuery(el).parent().parent();
            var pre_td = p.prev();
            var inputs = jQuery("input[type='checkbox']", p);
            var i = 0;
            inputs.each(function () {
                if (jQuery(this).is(':checked')) i++;
            })
            var pre = jQuery("input[type='checkbox']", pre_td).eq(0);
            if (i == 0) { pre.prop("indeterminate", false); pre.attr("checked", false); }
            else if (i == inputs.size()) { pre.prop("indeterminate", false); pre.attr("checked", true); }
            else pre.prop("indeterminate", true);
        },
        bmchoose: function () {
            this.showtree = !this.showtree;
        },
        onselect: function (node, instanceId) {
            this.dwmc = node.label;
        },
        save: function () {
            if (this.dwno == null || this.dwno == undefined || this.dwno == "") {
                layer.alert('单位必须选择！', { icon: 2 });
                return;
            }
            layer.confirm("真的要修改用户吗", {
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
function init() {

    var index = layer.load(0, { shade: [0.1, "#FFFFFF"] });
    /*post方法,方便后端以dynamic类获取数据,
     * 1-contentType:"application/json",
     * 2-data必须stringify*/
    jQuery.ajax({
        async: true,
        type: "get",
        contentType: "application/json",
        url: "/api/SysQxUser/GetUser",
        headers: {
            'Authorization': window.sessionStorage.getItem('token')
        },
        data: {
            id: data.id
        },
        success: function (res) {

            let user = res.user;
            data.dwno = user.DWNO;
            data.dwmc = user.DWNAME;
            data.loginname = user.LOGINNAME;
            data.name = user.NAME;
            data.sfzhm = user.SFZHM;
            data.mmyxq = user.MMYXQ;
            data.lxdh = user.TEL;
            data.kqipxz = user.IPXZ;
            data.ip1 = user.IP1;
            data.ip2 = user.IP2;
            data.ip3 = user.IP3;
            data.zhzt = user.STATE;
            data.pjxtzh = user.PJXTZH;
            data.lxdz = user.LXDZ;
            data.qd = user.QD;
            data.memo = user.MEMO;
            data.ssks = user.BM;
            data.qxlx = user.QXLX;
            data.ssqx = JSON.parse(user.QXS);
            data.jgdws = JSON.parse(user.JGDWS);
            /*************************************/
            data.roles = res.roles;
            data.menus = res.menus;
            data.menus.forEach(function (item) {
                let a = data.ssqx.filter(function (it) {
                    return it == item.ID;
                });
                let exited = a.length > 0 ? true : false;

                Object.assign(item, { CK: exited })
            });
            let one = data.menus.filter(function (item) {
                return item.PID == "R000000001";
            });
            one.forEach(function (item) {
                let m1 = { self: item, childs: [] }
                let two = data.menus.filter(function (item1) {
                    return item1.PID == m1.self.ID
                });
                two.forEach(function (item2) {
                    let m2 = { self: item2, childs: [] };
                    let three = data.menus.filter(function (item3) {
                        return item3.PID == m2.self.ID;
                    });
                    three.forEach(function (item3) {
                        m2.childs.push(item3);
                    });
                    m1.childs.push(m2);
                });
                data.menus1.push(m1);
            });
            /*************************************/
            data.dws = res.dws;
            let temp = [];
            data.dws.forEach(function (item) {
                temp.push(Object.assign({}, { id: item.ID, pid: item.PID, label: item.NAME }));
            });
            let l = temp.filter(function (v) {
                return v.id == data.user.DWNO;
            })[0];
            l = Object.assign(l, { "children": builddw1(temp, data.user.DWNO) })
            data.dws1 = [];
            data.dws1.push(l);

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
function builddw1(data, pid) {
    var result = [], temp;
    for (var i in data) {
        if (data[i].pid == pid) {
            result.push(data[i]);
            //result.push(Object.assign(data[i],{id:data[i].ID,label:data[i].NAME}));
            temp = builddw1(data, data[i].id);
            if (temp.length > 0) {
                data[i].children = temp;
            }
        }
    }
    return result;

}
function save1() {
    if (data.qxlx == "自由权限") {
        data.ssqx = [];
        data.menus1.forEach(function (item) {
            item.childs.forEach(function (item2) {
                item2.childs.forEach(function (item3) {
                    if (item3.CK) {
                        if (data.ssqx.find(function (v) { return v == item3.ID }) == undefined) data.ssqx.push(item3.ID);
                        if (data.ssqx.find(function (v) { return v == item2.self.ID }) == undefined) data.ssqx.push(item2.self.ID);
                        if (data.ssqx.find(function (v) { return v == item.self.ID }) == undefined) data.ssqx.push(item.self.ID);

                    }
                });
            });
        })

    }
    data.ssqx = typeof (data.ssqx) === "string" ? data.ssqx : JSON.stringify(data.ssqx);
    var index = layer.load(0, { shade: [0.1, "#FFFFFF"] });
    /*post方法,方便后端以dynamic类获取数据,
     * 1-contentType:"application/json",
     * 2-data必须stringify*/
    jQuery.ajax({
        async: true,
        type: "post",
        contentType: "application/json",
        url: "/api/SysQxUser/UserEdit",
        headers: {
            'Authorization': window.sessionStorage.getItem('token')
        },
        data: JSON.stringify(data),
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
            else { alert('错误:' + ret.Message) }try{layer.close(index);}catch(e){}
            return;
        }
    });
}