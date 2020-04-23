var pagecolor = jQuery(".headtop", window.parent.document).css("background-color");
var active;
var date = new Date();
date.setDate(date.getDate() - 3650);

var data = {
    lx: "",
    rqfw: date.Format("yyyy-MM-dd") + " - " + (new Date()).Format("yyyy-MM-dd"),
    name: "",
    sfzhm: "",
    sper: "",
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
        , { field: 'LX', title: '名单类型', width: 100 }
        , { field: 'NAME', title: '姓名', width: 100 }
        , { field: 'SFZHM', title: '身份证明号码', width: 150 }
        , { field: 'TEL', title: '手机号码', width: 100 }
        , { field: 'SPSJ', title: '加入时间', width: 150 }
        , { field: 'MEMO', title: '备注', width: 140 }
        , { field: 'ZT', title: '状态', width: 60 }
        , { field: 'SPER', title: '审批人', width: 70 }
        , { field: 'JSER', title: '解锁人', width: 70 }
        , { field: 'JSSJ', title: '解锁时间', width: 150 }
        , { field: '', title: '操作', width: 140, toolbar: '#barDemo' }

    ]];
    //第一个实例
    table.render({
        elem: '#demo'
        , id: "table"
        , height: "full-60"
        , url: '/api/HmdglRyhmd/QueryRBlist' //数据接口
        , headers: { 'Authorization': window.sessionStorage.getItem('token') }
        , totalRow: false
        , page: true //开启分页
        , limits: [10, 14, 20, 30, 40, 50, 60, 70, 80, 90]
        , limit: 14
        , cols: cols
        , toolbar: false
        , where: {
            lx: data.lx,
            name: data.name,
            sfzhm: data.sfzhm,
            sper: data.sper,
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
                    lx: data.lx,
                    name: data.name,
                    sfzhm: data.sfzhm,
                    sper: data.sper,
                    rq1: data.rq1,
                    rq2: data.rq2,
                }

            });
        }

    };
    table.on('tool(test)', function (obj) {
        if (obj.event == "show") {
            data.CurrentRowObj = obj
            window.parent.layindex2 = window.parent.layer.open({
                title: "申请信息",
                type: 2,
                area: ["1300px", "900px"],
                fixed: false, //不固定
                maxmin: true,
                content: ["app/hmdgl/ryhmd/rbedit.html?id=" + obj.data.ID, "no"]
            });
        }
        else if (obj.event == "del") {
            data.CurrentRowObj = obj
            window.parent.layindex2 = window.parent.layer.open({
                title: "申请信息",
                type: 2,
                area: ["1300px", "900px"],
                fixed: false, //不固定
                maxmin: true,
                content: ["app/hmdgl/ryhmd/rbedit.html?id=" + obj.data.ID, "no"]
            });
        }
    });
})
function delagent(obj) {
    var index = layer.load(0, { shade: [0.1, "#FFFFFF"] });
    /*post方法,方便后端以dynamic类获取数据,
    * 1-contentType:"application/json",
    * 2-data必须stringify*/
    jQuery.ajax({
        async: true,
        type: "post",
        contentType: "application/json",
        url: "/api/HmdglRyhmd/DelAgent",
        headers: {
            'Authorization': window.sessionStorage.getItem('token')
        },
        data: JSON.stringify({
            id: obj.data.ID
        }),
        success: function (res) {
            layer.close(index);
            obj.del();

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
        },
        add: function () {
            window.parent.layindex2 = window.parent.layer.open({
                title: "详细信息",
                type: 2,
                area: ["1000px", "800px"],
                fixed: false, //不固定
                maxmin: true,
                content: ["app/hmdgl/ryhmd/adddbxx.html", "no"]
            });
        }

    }
})


