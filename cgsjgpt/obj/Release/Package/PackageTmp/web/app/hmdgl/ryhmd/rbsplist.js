
var data = {
    CurrentRowObj: null
}
layui.use(['laydate', 'layer', 'table', 'jquery'], function () {
    var laydate = layui.laydate,
        layer = layui.layer,
        table = layui.table;



    var cols = [[ //表头
        { type: 'numbers', title: '序号' }
        , { field: 'LX', title: '名单类型', width: 100 }
        , { field: 'NAME', title: '姓名', width: 100 }
        , { field: 'SFZHM', title: '身份证明号码', width: 150 }
        , { field: 'TEL', title: '手机号码', width: 100 }
        , { field: 'LRSJ', title: '申请时间', width: 150 }
        , { field: 'MEMO', title: '备注', width: 370 }
        , { field: '', title: '操作', width: 70, toolbar: '#barDemo' }

    ]];
    //第一个实例
    table.render({
        elem: '#demo'
        , id: "table"
        , height: "full-5"
        , url: '/api/HmdglRyhmd/QueryDshRBlist' //数据接口
        , headers: { 'Authorization': window.sessionStorage.getItem('token') }
        , totalRow: false
        , page: true //开启分页
        , limits: [10, 14, 20, 30, 40, 50, 60, 70, 80, 90]
        , limit: 14
        , cols: cols
        , toolbar: false
        , where: {

        }
        , parseData: function (res) { //将原始数据解析成 table 组件所规定的数据

        }
    });


    table.on('tool(test)', function (obj) {
        if (obj.event == "sp") {
            data.CurrentRowObj = obj
            window.parent.layindex2 = window.parent.layer.open({
                title: "申请信息",
                type: 2,
                area: [parent.window.innerWidth >= 1300 ? "1300px" : "90%", parent.window.innerHeight >= 900 ? "900px" : "90%"],
                fixed: false, //不固定
                maxmin: true,
                content: ["app/hmdgl/ryhmd/rbspb.html?id=" + obj.data.ID, (parent.window.innerWidth >= 1300 && parent.window.innerHeight >= 900 ? "no" : "yes")]
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

    },
    methods: {


    }
})
// 注册消息事件监听，对来自 myIframe 框架的消息进行处理
window.addEventListener('message', function (e) {
    if (e.data.act == '红/黑名单审核完成') {
        data.CurrentRowObj.del();
    }
}, false);

