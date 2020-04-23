var AppData = JSON.parse(window.sessionStorage.getItem("AppData"))

var data = {
    mode: false,
    ptlb: "综合平台业务",
    xtlb: "",
    ywlx: "",
    ywyy: "",
    yhphmisnull: "是",
    cylshisnull: "是",
    blms: ['本人办理'],
    shms: "不需要审核",
    brzls: [],
    dlrzls: [],
    dwzls: [],
    temps: [],
    code: {
        ptlbs: [],
        xtlbs: [],
        ywlxs: [],
        blmss: [{ NAME: '本人办理' }, { NAME: '代理个人业务' }, { NAME: '代理单位业务' }],
        shmss: [{ NAME: '需要审核' }, { NAME: '不需要审核' }],
        photos: []

    }

}
var vm = new Vue({
    el: "#root",
    data: data,
    beforeCreate: function () {
        data.temps = data.brzls
        init();
    },
    watch: {
        xtlb: function () {
            this.yhphmisnull = "是";
            this.cylshisnull = "是";
        }
    },
    computed: {
        xtlbs1: function () {
            let p = data.code.xtlbs.filter(function (item) {
                return item.XTLB == data.ptlb;
            })
            return [{ CODE1: "", NAME: "" }].concat(p)
        },
        ywlxs1: function () {
            let p = data.code.ywlxs.filter(function (item) {
                return item.XTLB == data.xtlb && item.PTLB == data.ptlb;
            })
            return [{ CODE1: "", NAME: "" }].concat(p)
        },
        photos1: function () {
            let p = [];
            //var difference = data.code.photos.filter(function (v) { return data.temps.indexOf(v) === -1 })// [1,3]*/
            var difference = data.code.photos.filter(function (v) { return data.temps.find(function (item) { return item.ID == v.ID }) === undefined })// [1,3]*/
            let k = "xlgslj";
            difference.forEach(function (item) {

                if (item.K1 != k) {
                    k = item.K1;
                    p.push({ ID: 'split', K1: k })
                }
                p.push(item);
            })
            return p;
        }
    },
    methods: {
        save: function () {
            let msg = ""
            msg = data.ptlb == "" ? msg + '<br>' + '平台类别不能为空' : msg;
            msg = data.xtlb == "" ? msg + '<br>' + '系统类别不能为空' : msg;
            msg = data.ywlx == "" ? msg + '<br>' + '业务类型不能为空' : msg;
            if (msg != "") {
                layer.alert(msg, { icon: 2 })
                return;
            }
            layer.confirm("真的要保存吗", {
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
        ExitBlms: function (val) {
            return data.blms.indexOf(val) == -1 ? false : true;
        },
        ChangeMode: function () {
            data.mode = !data.mode
        },
        mouseover: function (id, index) {
            let addstr = "";
            addstr = addstr + "<a id='add_" + id + "' href='#' style='margin-left:5px;color:red;' onclick='additem(\"" + id + "\")' ><i class='iconfont' >&#10004</i></a> ";
            jQuery(event.target).append(addstr)

        },
        mouseout: function (id, index) {
            $("#add_" + id).unbind().remove();
        },
        mouseover1: function (id, index) {
            let addstr = "";
            if (index == 0) addstr = addstr + "<a id='down_" + id + "' href='#' style='margin-left:5px;color:red;' onclick='downitem(" + index + ")' ><i class='iconfont' >&#9660</i></a> ";
            else if (index == data.temps.length - 1) addstr = addstr + "<a id='up_" + id + "' href='#' style='margin-left:5px;color:red;' onclick='upitem(" + index + ")' ><i class='iconfont' >&#9650</i></a> ";
            else addstr = addstr + "<a id='up_" + id + "' href='#' style='margin-left:5px;color:red;' onclick='upitem(" + index + ")' ><i class='iconfont' >&#9650</i></a> <a id='down_" + id + "' href='#' style='margin-left:5px;color:red;' onclick='downitem(" + index + ")' ><i class='iconfont' >&#9660</i></a> ";
            addstr = addstr + "<a id='del_" + id + "' href='#' style='margin-left:5px;color:red;' onclick='delitem(\"" + index + "\")' ><i class='iconfont' >&#10006</i></a> ";
            jQuery(event.target).append(addstr)

        },
        mouseout1: function (id, index) {

            /*$("#del_" + id).unbind().remove();
			$("#up_" + id).unbind().remove();
			$("#down_" + id).unbind().remove();*/
            $("a[id*='up_']").unbind().remove();
            $("a[id*='down_'").unbind().remove();
            $("a[id*='del_'").unbind().remove();


        },
    }
})
function init() {
    jQuery.ajax({
        async: true,
        type: "get",
        contentType: "application/json",
        url: "/api/SysPublicMethod/GetCode",
        headers: {
            'Authorization': window.sessionStorage.getItem('token')
        },
        data: {
            lb: "['全局@全局@平台类别','全局@ALL@系统类别','ALL@ALL@业务类型','ALL@ALL@照片资料']"
        },
        success: function (res) {
            data.code.ptlbs = [{ CODE1: "", NAME: "" }].concat(res.Data)
            data.code.xtlbs = res.Data1
            data.code.ywlxs = res.Data2
            function compare(property) {
                return function (a, b) {
                    var value1 = a[property];
                    var value2 = b[property];
                    return value1 > value2 ? 1 : -1
                }
            }
            data.code.photos = res.Data3.sort(compare('K1'));
            data.code.photos.forEach(function (item) {
                Object.assign(item, { bx: true });
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
    })
}

function save() {
    let updata = {
        ptlb: data.ptlb,
        xtlb: data.xtlb,
        ywlx: data.ywlx,
        ywyy: data.ywyy,
        yhphmisnull: data.yhphmisnull,
        cylshisnull: data.cylshisnull,
        blms: data.blms,
        shms: data.shms,
        brzls: [],
        dlrzls: [],
        dwzls: []
    }
    data.brzls.forEach(function (item) {
        updata.brzls.push(Object.assign({}, {ID:item.ID, CODE: item.CODE1, NAME: item.NAME, bx: item.bx }));
    });
    if (data.blms.indexOf("代理个人业务") > 0) {
        data.dlrzls.forEach(function (item) {
            updata.dlrzls.push(Object.assign({}, { ID: item.ID, CODE: item.CODE1, NAME: item.NAME, bx: item.bx }));
        });
    }
    if (data.blms.indexOf("代理单位业务") > 0) {
        data.dwzls.forEach(function (item) {
            updata.dwzls.push(Object.assign({}, { ID: item.ID,  CODE: item.CODE1, NAME: item.NAME, bx: item.bx }));
        });
    }
    var index = layer.load(0, { shade: [0.1, "#FFFFFF"] });
    /*post方法,方便后端以dynamic类获取数据,
     * 1-contentType:"application/json",
     * 2-data必须stringify*/
    jQuery.ajax({
        async: true,
        type: "post",
        contentType: "application/json",
        url: "/api/XfywJcpz/BusinessBaseAdd",
        headers: {
            'Authorization': window.sessionStorage.getItem('token')
        },
        data: JSON.stringify(updata),
        success: function (res) {
            layer.close(index);
            layer.alert('保存成功！', { icon: 1 }, function (index) {
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
$(".tab > li").click(function () {
    $(".tab > li").removeClass("tabcurrent");
    $(this).addClass("tabcurrent");
    $(".website,.userinfo").hide();
    $("#" + $(".tab >li.tabcurrent").attr("name")).show();
    let p = $(".tab >li.tabcurrent").attr("name");
    data.temps = p == "brzl" ? data.brzls : (p == "dlrzl" ? data.dlrzls : data.dwzls);
});
function tab(id) {
    $(".tab > li").removeClass("tabcurrent");
    $(".tab > li[name=" + id + "]").addClass("tabcurrent");
    $(".website,.userinfo").hide();
    $("#" + id).show();
}
function additem(id) {
    let item = data.code.photos.filter(function (item) {
        return item.ID == id;
    })[0];
    data.temps.push(JSON.parse(JSON.stringify(item)))
    //data.temps.push(item)  数据混乱
    $("#add_" + id).unbind().remove();
}
function delitem(index) {
    data.temps.splice(index, 1);
    $("a[id*='up_']").unbind().remove();
    $("a[id*='down_'").unbind().remove();
    $("a[id*='del_'").unbind().remove();
}
function upitem(index) {
    console.log(index)
    let v1 = data.temps[index - 1];
    let v2 = data.temps[index];
    data.temps.splice(index - 1, 2, v2, v1)
    $("a[id*='up_']").unbind().remove();
    $("a[id*='down_'").unbind().remove();
    $("a[id*='del_'").unbind().remove();
}
function downitem(index) {
    let v1 = data.temps[index];
    let v2 = data.temps[index + 1];
    data.temps.splice(index, 2, v2, v1)
    $("a[id*='up_']").unbind().remove();
    $("a[id*='down_'").unbind().remove();
    $("a[id*='del_'").unbind().remove();
}
