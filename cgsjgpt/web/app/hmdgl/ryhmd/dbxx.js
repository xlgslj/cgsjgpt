var pagecolor = jQuery(".headtop", window.parent.document).css("background-color");
var active;
var date = new Date();
date.setDate(date.getDate() - 3);

var data = {
    rqfw: date.Format("yyyy-MM-dd") + " - " + (new Date()).Format("yyyy-MM-dd"),
    dlrname: "",
    dlrzjhm: "",
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
        , { field: 'YWLX', title: '业务类型', width: 160 }
        , { field: 'DLRNAME', title: '姓名', width: 100 }
        , { field: 'DLRZJHM', title: '身份证明号码', width: 180 }
        , { field: 'ADDLX', title: '添加方式', width: 100 }
        , { field: 'ADDTIME', title: '添加时间', width: 200 }
        , { field: 'ADDRY', title: '添加人员', width: 120 }
        , { field: 'MEMO', title: '备注', width: 270 }
        , { field: '', title: '操作', width: 60, toolbar: '#barDemo' }

    ]];
    //第一个实例
    table.render({
        elem: '#demo'
        , id: "table"
        , height: "full-60"
        , url: '/api/HmdglRyhmd/QueryAgent' //数据接口
        , headers: { 'Authorization': window.sessionStorage.getItem('token') }
        , totalRow: false
        , page: true //开启分页
        , limits: [10, 14, 20, 30, 40, 50, 60, 70, 80, 90]
        , limit: 14
        , cols: cols
        , toolbar: false
        , where: {
            dlrname: data.dlrname,
            dlrzjhm: data.dlrzjhm,
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
                    dlrname: data.dlrname,
                    dlrzjhm: data.dlrzjhm,
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
                //delagent(obj)
                layer.close(index);
            }, function () {
                return;
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


