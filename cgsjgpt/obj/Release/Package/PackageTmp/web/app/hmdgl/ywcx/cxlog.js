var pagecolor = jQuery(".headtop", window.parent.document).css("background-color");
var active;
var date = new Date();
date.setDate(date.getDate() - 3);

var data = {
    zt: "",
    rqfw: date.Format("yyyy-MM-dd") + " - " + (new Date()).Format("yyyy-MM-dd"),
    oper: "",
    keys: "",
    rq1: date.Format("yyyy-MM-dd"),
    rq2: (new Date()).Format("yyyy-MM-dd"),
}
layui.use(['laydate', 'layer', 'table', 'jquery'], function () {
    var laydate = layui.laydate,
        layer = layui.layer,
        table = layui.table;

    //日期范围
    laydate.render({
        elem: '#rqfw'
        , value: data.rqfw
        , range: true
        , done: function (value, date) {
            data.rqfw = value;
        }
    });

    var cols = [[ //表头
        { type: 'numbers', title: '序号' }
        , { field: 'OPSJ', title: '查询时间', width: 150 }
        , { field: 'OPER', title: '操作人', width: 100 }
        , { field: 'IP', title: 'IP地址', width: 120 }
        , { field: 'KEYS', title: '查询条件', width: 260 }
        , { field: 'ZT', title: '状态', width: 60 }
        , { field: 'SECOND', title: '耗时', width: 70 }
        , { field: 'RETS', title: '返回值', width: 480 }

    ]];
    //第一个实例
    table.render({
        elem: '#demo'
        , id: "table"
        , height: "full-60"
        , url: '/api/HmdglYwcx/QueryTrffLog' //数据接口
        , headers: { 'Authorization': window.sessionStorage.getItem('token') }
        , totalRow: false
        , page: true //开启分页
        , limits: [10, 14, 20, 30, 40, 50, 60, 70, 80, 90]
        , limit: 14
        , cols: cols
        , toolbar: false
        , where: {
            zt: data.zt,
            oper: data.oper,
            keys: data.keys,
            rq1: data.rq1,
            rq2: data.rq2,
        }
        , parseData: function (res) { //将原始数据解析成 table 组件所规定的数据

        }
    });

    active = {
        reload: function () {
            //执行重载
            table.reload('table', {
                where: {
                    zt: data.zt,
                    oper: data.oper,
                    keys: data.keys,
                    rq1: data.rq1,
                    rq2: data.rq2,
                }

            });
        }

    };
    table.on('tool(test)', function (obj) {
        if (obj.event == "del") {
            //询问框
            layer.confirm('确定删除？', {
                btn: ['确定', '放弃'] //按钮
            }, function (index) {
                delagent(obj)
                layer.close(index);
            }, function () {
                return;
            });
        }
    });
})

var vm = new Vue({
    el: "#app",
    data: data,
    beforeCreate: function () {

    },
    watch: {
        rqfw: function (nv) {
            this.rq1 = nv.split(" - ")[0];
            this.rq2 = nv.split(" - ")[1];
        }
    },
    methods: {
        query: function () {
            active["reload"] ? active["reload"].call(this) : '';
        }
    }
})


