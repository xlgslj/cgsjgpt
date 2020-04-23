
Vue.component('treeselect', VueTreeselect.Treeselect);
var data = {
    user: JSON.parse(window.sessionStorage.getItem("user")),
    id: GetUrlPara()[0].value,
    bmno: null,
    bmmc: null,
    ckmc: "",
    ip: "",
    kzkdz: "",
    wdbh: "",
    zcckh: "",
    pjcom: "",
    ywlxs: [],
    yxywlxs: [],
    bxywlxs: [],
    addlx: [],
    dellx: [],
    czry: "",
    divheight: "52px",
    showtree: false,
    dws: [],
    dws1: []
}
var vm = new Vue({
    el: "#root",
    data: data,
    beforeCreate: function () {
        init();
        treeinit();
    },
    computed: {
        up: function () {
            return this.addlx.length > 0;
        },
        down: function () {
            return this.dellx.length > 0;
        }
    },
    watch: {
        yxywlxs: function (nv, ov) {
            console.log(JSON.stringify(nv));
            //求差集
            this.bxywlxs = this.ywlxs.filter(function (item) {
                let ret = false;
                nv.some(function (v) {
                    if (item["ID"] == v["ID"]) {
                        ret = true;
                    }
                })
                return !ret;
            }).concat(nv.filter(function (item) {
                let ret = false;
                data.ywlxs.some(function (v) {
                    if (item["ID"] == v["ID"]) {
                        ret = true;
                    }
                })
                return !ret;
            }))
            //排序
            nv.some(function (item, index) {
                Object.assign(item, { sort: index })
            })
            console.log(JSON.stringify(data.yxywlxs))
            console.log(JSON.stringify(this.yxywlxs))

        }
    },
    methods: {
        focus: function () {
            this.showtree = !this.showtree;
            return false;
        },
        faddlx: function () {
            this.yxywlxs = this.yxywlxs.concat(this.addlx)
            this.addlx = [];
        },
        fdellx: function () {
            this.yxywlxs = this.yxywlxs.filter(function (item) {
                let ret = false;
                data.dellx.some(function (v) {
                    if (item["ID"] == v["ID"]) {
                        ret = true;
                    }
                })
                return !ret;
            })
            this.dellx = []
        },
        mouseover: function (id, index) {
            let addstr = "";
            if (index != 0) {
                addstr = addstr + "<input id='up_" + id + "' type='button' value='↑' style='float: none; margin - top: 5px;margin-left:10px; display: inline; ' onclick='runup(" + index + ")' class='btnsave' /> ";
            }
            if (index != (this.yxywlxs.length - 1)) {
                addstr = addstr + "<input id='down_" + id + "' type='button' value='↓' style='float: none; margin - top: 5px;margin-left:10px; display: inline; ' onclick='rundown(" + index + ")' class='btnsave' /> ";

            }
            jQuery(event.target).append(addstr)

        },
        mouseout: function (id) {
            $("#up_" + id).unbind().remove();
            $("#down_" + id).unbind().remove();

        },
        onselect: function (node, instanceId) {
            this.bmmc = node.label;
        },
        save: function () {
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
function save1() {
    var index = layer.load(0, { shade: [0.1, "#FFFFFF"] });

    /*post方法,方便后端以dynamic类获取数据,
     * 1-contentType:"application/json",
     * 2-data必须stringify*/
    jQuery.ajax({
        async: true,
        type: "post",
        contentType: "application/json",
        url: "/api/SysCsCkset/CkEdit",
        headers: {
            'Authorization': window.sessionStorage.getItem('token')
        },
        data: JSON.stringify(data),
        success: function (res) {
            layer.close(index);
            parent.layer.close(parent.layindex2);
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
function init() {
    var index = layer.load(0, { shade: [0.1, "#FFFFFF"] });
    jQuery.ajax({
        async: true,
        type: "get",
        contentType: "application/json",
        url: "/api/SysCsCkset/GetCk",
        headers: {
            'Authorization': window.sessionStorage.getItem('token')
        },
        data: {
            id: data.id
        },
        success: function (res) {
            data.ywlxs = data.bxywlxs = res.ywlxs;
            let ckset = res.ckset;
            data.bmno = ckset.BMNO;
            data.bmmc = ckset.BMMC;
            data.ckmc = ckset.CKMC;
            data.ip = ckset.IP;
            data.kzkdz = ckset.KZKDZ;
            data.wdbh = ckset.WDBH;
            data.zcckh = ckset.ZCCKH;
            data.pjcom = ckset.PJCOM;
            data.yxywlxs = JSON.parse(ckset.YWLXS);
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
function treeinit() {
    var index = layer.load(0, { shade: [0.1, "#FFFFFF"] });
    jQuery.ajax({
        async: true,
        type: "get",
        contentType: "application/json",
        url: "/api/SysQxBm/BmGet",
        headers: {
            'Authorization': window.sessionStorage.getItem('token')
        },
        data: {},
        success: function (res) {
            data.dws = res.Data;
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
function runup(index) {
    let v1 = data.yxywlxs[index - 1];
    let v2 = data.yxywlxs[index];
    data.yxywlxs.splice(index - 1, 2, v2, v1)
    $("input[id*='up_']").unbind().remove();
    $("input[id*='down_'").unbind().remove();
}
function rundown(index) {
    let v1 = data.yxywlxs[index]
    let v2 = data.yxywlxs[index + 1]
    data.yxywlxs.splice(index, 2, v2, v1)
    $("input[id*='up_']").unbind().remove();
    $("input[id*='down_'").unbind().remove();
}