var pagecolor = jQuery(".headtop", window.parent.document).css("background-color");
var active, jQuery, $;
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
    sortlx: "总业务数",
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
    });
    var cols = [//表头
        {
            field: 'name',
            title: 'ID',
            width: 80,
            sort: true
        }, {
            field: 'age',
            title: 'I1D',
            width: 80,
            sort: true
        }];
    jQuery.ajax({
        async: true,
        type: "get",
        contentType: "application/json",
        url: "/api/DtglTjfx/SlrygzltjHeards",
        headers: {
            'Authorization': window.sessionStorage.getItem('token')
        },
        data: {},
        success: function success(res) {
            var newcols = JSON.parse(res);
            tableinit(newcols);
        },
        error: function error(res) {
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

    function tableinit(newcols) {
        //第一个实例
        table.render({
            elem: '#demo',
            id: "table",
            height: "full-60",
            url: '/api/DtglTjfx/SlrygzltjDatas' //数据接口
            ,
            headers: {
                'Authorization': window.sessionStorage.getItem('token')
            },
            totalRow: true,
            page: false //开启分页
            ,
            limits: [10, 14, 20, 30, 40, 50, 60, 70, 80, 90],
            limit: 14,
            cols: newcols,
            toolbar: false,
            where: {
                dwno: data.bmno,
                rq1: data.rq1,
                rq2: data.rq2,
                sortlx: data.sortlx
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
    }

    active = {
        reload: function reload() {
            //执行重载
            table.reload('table', {
                where: {
                    dwno: data.bmno,
                    rq1: data.rq1,
                    rq2: data.rq2,
                    sortlx: data.sortlx
                }
            });
        }
    };
    table.on('tool(test)', function (obj) {
        //console.log(obj.event) //得到当前行元素对象
        //console.log(obj.data) //得到当前行数据
        window.parent.layindex2 = window.parent.layer.open({
            title: "详细信息",
            type: 2,
            area: ["1200px", "600px"],
            fixed: false,
            //不固定
            maxmin: true,
            content: ["app/dtgl/tjfx/slrygzltj-more.html?jbrid=" + obj.data.id + "&rq1=" + data.rq1 + "&rq2=" + data.rq2 + "&lx=" + obj.event, "no"]
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

    },
    watch: {
        rqfw: function rqfw(nv) {
            this.rq1 = nv.split(" - ")[0];
            this.rq2 = nv.split(" - ")[1];
        }
    },
    methods: {
        onselect: function (node, instanceId) {
            this.bmmc = node.label;
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