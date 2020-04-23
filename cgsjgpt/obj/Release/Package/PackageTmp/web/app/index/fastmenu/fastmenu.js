var AppData = JSON.parse(window.sessionStorage.getItem("AppData"))

var data = {
    menus: [],
    menus1: [],
    user: {},
    fastmenu: []
}
var vm = new Vue({
    el: "#root",
    data: data,
    beforeCreate: function () {
        init();
    },
    watch: {
        fastmenu: function (v) {

            let difference = this.menus.filter(function (item) {
                return data.fastmenu.find(function (item2) {
                    return item2.ID == item.ID;
                }) === undefined;
            });
            buildmenu1(difference);
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
    methods: {
        mouseover1: function (id, index) {
            let addstr = "";
            addstr = addstr + "<a id='del1_" + index + "' href='#' style='margin-left:5px;color:red;' onclick='delitem(\"" + index + "\")' ><i class='iconfont' >&#10006</i></a> ";
            jQuery(event.target).append(addstr)

        },
        mouseout1: function (id, index) {
            $("#del1_" + index).unbind().remove();
        },
        mouseover2: function (id, index) {
            let addstr = "";
            addstr = addstr + "<a id='add2_" + id + "' href='#' style='margin-left:5px;color:red;' onclick='additem(\"" + id + "\")' ><i class='iconfont' >&#10004</i></a> ";
            jQuery(event.target).append(addstr)

        },
        mouseout2: function (id, index) {
            $("#add2_" + id).unbind().remove();
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
        url: "/api/IndexFastmenu/FastmenuInit",
        headers: {
            'Authorization': window.sessionStorage.getItem('token')
        },
        data: JSON.stringify(data),
        success: function (res) {
            data.menus = res.menus;
            data.user = res.user;
            let p = JSON.parse(data.user.FASTMENU);
            p.forEach(function (item) {
                let v = data.menus.find(function (item2) {
                    return item2.ID == item;
                });
                data.fastmenu = data.fastmenu.concat(v);
            });
            let difference = data.menus.filter(function (item) {
                return data.fastmenu.find(function (item2) {
                    return item2.ID == item.ID;
                }) === undefined;
            });
            buildmenu1(difference);

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
function buildmenu1(source) {
    data.menus1 = [];
    let one = source.filter(function (item) {
        return item.PID == "R000000001";
    });
    one.forEach(function (item) {
        let m1 = { self: item, childs: [] }
        let two = source.filter(function (item1) {
            return item1.PID == m1.self.ID
        });
        two.forEach(function (item2) {
            let m2 = { self: item2, childs: [] };
            let three = source.filter(function (item3) {
                return item3.PID == m2.self.ID;
            });
            three.forEach(function (item3) {
                m2.childs.push(item3);
            });
            m1.childs.push(m2);
        });
        data.menus1.push(m1);
    });

}
function additem(id) {
    if (data.fastmenu.length >= 10) {
        layer.alert("快捷菜单不能超过10个", { icon: 2 });
    }
    else {
        let p = data.menus.find(function (item) {
            return item.ID == id;
        })
        data.fastmenu.push(p);
    }
    $("#add2_" + id).unbind().remove();
}
function delitem(index) {
    data.fastmenu.splice(index, 1);
    $("#del1_" + index).unbind().remove();
}
function save() {
    var index = layer.load(0, { shade: [0.1, "#FFFFFF"] });
    var p = [];
    data.fastmenu.forEach(function (item) {
        p.push(item.ID);
    })
    /*post方法,方便后端以dynamic类获取数据,
    * 1-contentType:"application/json",
    * 2-data必须stringify*/
    jQuery.ajax({
        async: true,
        type: "post",
        contentType: "application/json",
        url: "/api/IndexFastmenu/EditFastMenu",
        headers: {
            'Authorization': window.sessionStorage.getItem('token')
        },
        data: JSON.stringify({
            fastmenu: JSON.stringify(p)

        }),
        success: function (res) {
            layer.close(index);
            layer.alert('成功！', { icon: 1 }, function (index) {
                parent.layer.close(parent.layindex);
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