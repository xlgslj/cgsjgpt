var AppData = JSON.parse(window.sessionStorage.getItem("AppData"))
var layindex, active;
var data = {
    name: "",
    pdhm: "",
    zjhm: "",
    rqfw: new Date().Format("yyyy-MM-dd") + " - " + new Date().Format("yyyy-MM-dd"),
    rq1: new Date().Format("yyyy-MM-dd"),
    rq2: new Date().Format("yyyy-MM-dd"),
    hmzts: AppData.Hmzt,
    hmzt: "选择号码状态"
}
layui.use(['laydate', 'layer', 'table', 'jquery'], function () {
    var laydate = layui.laydate,
        layer = layui.layer,
        table = layui.table;
    jQuery = layui.$;
    $ = layui.$; //日期范围

    var d = laydate.render({
        elem: '#rqfw',
        value: data.rqfw,
        range: true,
        done: function done(value, date) {
            data.rqfw = value;
        }
    });

    //第一个实例
    table.render({
        elem: '#demo'
        , id: "table"
        , height: "full-60"
        , url: '/api/DtglYwbl/GetPdxx' //数据接口
        , headers: { 'Authorization': window.sessionStorage.getItem('token') }
        , page: true //开启分页
        , limits: [10, 14, 20, 30, 40, 50, 60, 70, 80, 90]
        , limit: 14
        , cols: [[ //表头
            { field: 'XH', title: 'ID', width: 80, sort: true }
            , { field: 'PDHM', title: '号码', width: 60 }
            , { field: 'CK', title: '窗口', width: 100 }
            , { field: 'YWLXMC', title: '业务类型', width: 200 }
            , { field: 'JBR', title: '经办人', width: 100 }
            , { field: 'BRNAME', title: '办理人', width: 100 }
            , { field: 'BRZJHM', title: '办理人证件号码', width: 120 }
            , { field: 'QHSJ', title: '取号时间', width: 150 }
            , { field: 'JHCS', title: '叫号次数', width: 80 }
            , { field: 'JHSJ', title: '叫号时间', width: 150 }
            , { field: 'ZT', title: '状态', fixed: 'right', width: 100 }
            , { title: '操作', fixed: 'right', width: 70, align: 'center', toolbar: '#barDemo' }
        ]]
        , toolbar: false
        , where: {
            first: false,
            pdhm: "",
            zjhm: "",
            name: "",
            rq1: data.rq1,
            rq2: data.rq2,
            zt: ""
        }
    });
    active = {
        reload: function () {
            //执行重载
            table.reload('table', {
                page: {
                    curr: 1 //重新从第 1 页开始
                }
                , where: {
                    first: false,
                    pdhm: data.pdhm,
                    zjhm: data.zjhm,
                    name: data.name,
                    rq1: data.rq1,
                    rq2: data.rq2,
                    zt: data.hmzt == "选择号码状态" ? "" : data.hmzt
                }
            });
        }
    };

    jQuery("#query").click(function () {
        alert("kk")
        var type = $(this).data('type');
        active[type] ? active[type].call(this) : '';
    })

    //监听工具条
    table.on('tool(test)', function (obj) {
        if (obj.event == "show") {
            window.parent.layindex2 = window.parent.layer.open({
                title: "详细信息",
                type: 2,
                area: ["1000px", "600px"],
                fixed: false,
                //不固定
                maxmin: true,
                content: ["app/dtgl/ywbl/pdxxcx-more.html?id=" + obj.data.XH, "no"]
            });
        }
    });

});
/*------------------------*/
var vm = new Vue({
    el: "#app",
    data: data,
    watch: {
        rqfw: function rqfw(nv) {
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

