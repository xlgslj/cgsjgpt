var pagecolor = jQuery(".headtop", window.parent.document).css("background-color");
var active;
Vue.component('treeselect', VueTreeselect.Treeselect);
var user = JSON.parse(window.sessionStorage.getItem("user"));
var data = {
    user: JSON.parse(window.sessionStorage.getItem("user")),
    customcolor: pagecolor,
    newcolor: "rgba(" + pagecolor.substring(pagecolor.indexOf("(") + 1, pagecolor.indexOf(")")) + ",0.8)",
    rqfw: new Date().Format("yyyy-MM-dd") + " - " + new Date().Format("yyyy-MM-dd"),
    bmmc: null,
    bmno: user.DWNO,
    rq1: new Date().Format("yyyy-MM-dd"),
    rq2: new Date().Format("yyyy-MM-dd"),
    dws: [],
    dws1: []
};
layui.use(['laydate', 'layer', 'table', 'jquery'], function () {
    var laydate = layui.laydate,
        layer = layui.layer,
        table = layui.table;
    jQuery = layui.$;
    $ = layui.$; //日期范围

    laydate.render({
        elem: '#rqfw',
        value: data.rqfw,
        range: true,
        done: function done(value, date) {
            data.rqfw = value;
        }
    }); //第一个实例

    table.render({
        elem: '#demo',
        id: "table",
        height: "full-60",
        url: '/api/DtglTjfx/zrjggzltjDatas' //数据接口
        ,
        headers: {
            'Authorization': window.sessionStorage.getItem('token')
        },
        totalRow: true,
        page: false //开启分页
        ,
        limits: [10, 14, 20, 30, 40, 50, 60, 70, 80, 90],
        limit: 14,
        cols: [[//表头
            {
                type: 'numbers'
            }, {
                field: 'bmmc',
                title: '部门名称',
                width: 400
            }, {
                field: 'czry',
                title: '操作人员',
                width: 250
            }, {
                field: 'ywlx',
                title: '业务类型',
                width: 250
            }, {
                field: 'blsl',
                title: '办理数量',
                width: 100,
                event: 'show'
            }]],
        toolbar: false,
        where: {
            dwno: data.bmno,
            rq1: data.rq1,
            rq2: data.rq2
        },
        parseData: function parseData(res) {
            //将原始数据解析成 table 组件所规定的数据
            return {
                "code": res.code,
                //解析接口状态
                "count": 1,
                //解析数据长度
                "data": JSON.parse(res.data[0])
            };
        }
    });
    active = {
        reload: function reload() {
            //执行重载
            table.reload('table', {
                where: {
                    dwno: data.bmno,
                    rq1: data.rq1,
                    rq2: data.rq2
                }
            });
        }
    };
    table.on('tool(test)', function (obj) {
        console.log(obj.data);
        window.parent.layindex2 = window.parent.layer.open({
            title: "详细信息",
            type: 2,
            area: ["1000px", "600px"],
            fixed: false,
            //不固定
            maxmin: true,
            content: ["app/dtgl/tjfx/zrjggzltj-more.html?ywlx=" + obj.data.ywlx + "&dbrid=" + obj.data.czryid + "&rq1=" + data.rq1 + "&rq2=" + data.rq2, "no"]
        });
    });
});
var vm = new Vue({
    el: "#app",
    data: data,
    beforeCreate: function beforeCreate() {
        treeinit();
    },
    mounted: function () {
        if (hashtree) {
            console.log("tree");
            setinitdata();
        }
    },
    watch: {
        rqfw: function rqfw(nv) {
            this.rq1 = nv.split(" - ")[0];
            this.rq2 = nv.split(" - ")[1];
        }
    },
    methods: {
        focus: function focus() {
            this.showtree = !this.showtree;
            return false;
        },
        query: function query() {
            active["reload"] ? active["reload"].call(this) : '';
        }
    }
});

function treeinit() {
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