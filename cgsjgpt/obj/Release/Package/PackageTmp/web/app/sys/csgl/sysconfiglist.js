
var data = {
    
}
layui.use(['laydate', 'layer', 'table', 'jquery'], function () {
    var laydate = layui.laydate,
        layer = layui.layer,
        table = layui.table;



    var cols = [[ //表头
        { type: 'numbers', title: '序号' }
        , { field: 'KEYWORD', title: '关键字', width: 200 }
        , { field: 'NAME', title: '参数名称', width: 340 }
        , { field: 'VALUE', title: '参数值', width: 300 }
        , { field: 'OPTIME', title: '操作时间 ', width: 180 }
        , { field: 'OPER', title: '操作人', width: 100 }
        , { field: '', title: '操作', width: 120, toolbar: '#barDemo' }

    ]];
    //第一个实例
    table.render({
        elem: '#demo'
        , id: "table"
        , height: "full-5"
        , url: '/api/SysCsConfig/GetSysConfigs' //数据接口
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
            res.data.forEach(function (item) {
                let v = "";
                v = item.V1 == null ? v : v + item.V1;
                v = item.V2 == null ? v : v + "|" + item.V2;
                v = item.V3 == null ? v : v + "|" + item.V3;
                v = item.V4 == null ? v : v + "|" + item.V4;
                v = item.V5 == null ? v : v + "|" + item.V5;

                Object.assign(item, { VALUE: v });
            })
            return {
                "code": res.code, //解析接口状态
                "count": res.count, //解析数据长度
                "data": res.data
            };
        }
    });


    table.on('tool(test)', function (obj) {
        if (obj.event == "set") {
            data.CurrentRowObj = obj
            window.parent.layindex2 = window.parent.layer.open({
                title: "参数设置",
                type: 2,
                area: ["800px", "500px"],
                fixed: false, //不固定
                maxmin: true,
                content: ["app/sys/csgl/editsyssignconfig.html?id=" + obj.data.ID, "no"]
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

    if (e.data.act == '系统参数设置完成') {
        data.CurrentRowObj.update({
            VALUE: e.data.msg.answer
        });
    }
}, false);


