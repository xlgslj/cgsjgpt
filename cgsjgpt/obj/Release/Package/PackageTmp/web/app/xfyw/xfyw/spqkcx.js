
var data = {
    CurrentRowObj: null
}
layui.use(['laydate', 'layer', 'table', 'jquery'], function () {
    var laydate = layui.laydate,
        layer = layui.layer,
        table = layui.table;



    var cols = [[ //表头
        { type: 'numbers', title: '序号' }
        , { field: 'XTLB', title: '系统类别', width: 100 }
        , { field: 'YWLX', title: '业务类型', width: 150 }
        , { field: 'YWYY', title: '业务原因', width: 135 }
        , { field: 'BRZJHM', title: '本人证件号码', width: 180 }
        , { field: 'HPHM', title: '车辆号牌', width: 100 }
        , { field: 'SPTIME1', title: '审批时间', width: 150 }
        , { field: 'SPER', title: '审批人', width: 150 }
        , { field: 'ZT', title: '审批结果', width: 150 }
        , { field: '', title: '操作', width: 120, toolbar: '#barDemo' }

    ]];
    //第一个实例
    table.render({
        elem: '#demo'
        , id: "table"
        , height: "full-5"
        , url: '/api/XfywXfyw/QuerySpjg' //数据接口
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
                item.ZT = item.ZT == "00" ? "待审核" : (item.ZT == "01" ? "审核不通过" : "审核通过")
            });
            return {
                "code": res.code, //解析接口状态
                "count": res.count, //解析数据长度
                "data": res.data //解析数据列表
            };
        }
    });


    table.on('tool(test)', function (obj) {
        if (obj.event == "sp") {
            data.CurrentRowObj = obj
            window.parent.layindex2 = window.parent.layer.open({
                title: "申请信息",
                type: 2,
                area: ["1300px", "800px"],
                fixed: false, //不固定
                maxmin: true,
                content: ["app/xfyw/xfyw/ywbledit.html?id=" + obj.data.ID, "no"]
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

