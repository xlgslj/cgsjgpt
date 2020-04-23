layui.use(['laydate', 'layer', 'table', 'jquery'], function () {
    var laydate = layui.laydate,
        layer = layui.layer,
        table = layui.table,
        jQuery = layui.$,
        $ = layui.$;
    var where = {};
    GetUrlPara().some(function (item) {
        where[item.name] = item.value
    });
    var cols = [[ //表头
        { type: 'numbers', title: '序号' }
        , { field: 'PDHM', title: '排队号码' }
        , { field: 'CK', title: '窗口' }
        , { field: 'JBR', title: '经办人' }
        , { field: 'BRNAME', title: '办理人' }
        , { field: 'BRZJHM', title: '办理人证件号码', width: 200 }
        , { field: 'YWLXMC', title: '业务类型' }
        , { field: 'STARTTIME', title: '叫号时间', width: 120 }
        , { field: 'WAITSECOND', title: '等候时间(分)', width: 120, sort: true }
        , { field: 'SECOND', title: '办理时间(分)', width: 120, sort: true }
        , { field: 'ZT', title: '状态' }

    ]];
    tableinit();
    function tableinit() {
        //第一个实例
        table.render({
            elem: '#demo'
            , id: "table"
            , height: "full-5"
            , url: '/api/DtglTjfx/SlrygzltjDatasMore' //数据接口
            , headers: { 'Authorization': window.sessionStorage.getItem('token') }
            , totalRow: true
            , page: false //开启分页
            , limits: [10, 14, 20, 30, 40, 50, 60, 70, 80, 90]
            , limit: 14
            , cols: cols
            , toolbar: false
            , where: where

        });
    }
})
