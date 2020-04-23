var AppData = JSON.parse(window.sessionStorage.getItem("AppData"))

var data = {
    menus: [],
    menus1: [],
    role: {
        ID: null,
        NAME: null,
        LX: null,
        CJ: null,
        IDS: [],
        ZT: '正常'
    }
}
var vm = new Vue({
    el: "#root",
    data: data,
    beforeCreate: function () {
        init();
    },
    updated: function () {
        $(".tab>li").click(function () {
            $(".tab > li").removeClass("tabcurrent");
            $(this).addClass("tabcurrent");
            $(".website,.userinfo").hide();
            $("#" + $(".tab >li.tabcurrent").attr("name")).show();
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
        url: "/api/SysCsMenu/MenuGet",
        headers: {
            'Authorization': window.sessionStorage.getItem('token')
        },
        data: JSON.stringify(data),
        success: function (res) {
            data.menus = res.Data;
            data.menus.forEach(function (item) {
                Object.assign(item, { CK: false })
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
function save() {

    data.menus1.forEach(function (item) {
        item.childs.forEach(function (item2) {
            item2.childs.forEach(function (item3) {
                if (item3.CK) {
                    if (data.role.IDS.find(function (v) { return v == item3.ID }) == undefined) data.role.IDS.push(item3.ID);
                    if (data.role.IDS.find(function (v) { return v == item2.self.ID }) == undefined) data.role.IDS.push(item2.self.ID);
                    if (data.role.IDS.find(function (v) { return v == item.self.ID }) == undefined) data.role.IDS.push(item.self.ID);

                }
            });
        });
    })
    let msg = "";
    msg = msg + (data.role.NAME == "" ? "角色名不能为空<br/>" : "");
    msg = msg + (data.role.IDS.length == 0 ? "没有赋予任何权限" : "");

    if (msg != "") {
        layer.alert(msg, { icon: 2 })
        return;
    }
    Object.keys(data.role).forEach(function (key) {
        if (data.role[key] == null) {
            data.role[key] = "";
        }
    });
    data.role.IDS = JSON.stringify(data.role.IDS);
    var index = layer.load(0, { shade: [0.1, "#FFFFFF"] });
    /*post方法,方便后端以dynamic类获取数据,
    * 1-contentType:"application/json",
    * 2-data必须stringify*/
    jQuery.ajax({
        async: true,
        type: "post",
        //contentType: "application/json",单实体作为参数，只能默认
        url: "/api/SysQxRole/RoleAdd",
        headers: {
            'Authorization': window.sessionStorage.getItem('token')
        },
        data: data.role,
        success: function (res) {
            layer.close(index);
            window.parent.postMessage({
                act: '红/黑名单审核完成',
                msg: {
                    answer: '我接收到啦！'
                }
            }, '*');
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

function tab(id) {
    $(".tab > li").removeClass("tabcurrent");
    $(".tab > li[name=" + id + "]").addClass("tabcurrent");
    $(".website,.userinfo").hide();
    $("#" + id).show();
}