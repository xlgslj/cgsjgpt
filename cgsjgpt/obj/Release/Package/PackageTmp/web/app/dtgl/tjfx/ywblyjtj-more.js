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
        , { field: 'JBR', title: '办理人员' }
        , { field: 'PDHM', title: '号码' }
        , { field: 'YWLXMC', title: '业务类型', width: 200 }
        , { field: 'STARTTIME', title: '办理时间', width: 200 }
        , { field: 'SECOND', title: '办理时长' }
        , { field: 'BLYJ', title: '办理预警' }
        , { field: 'WAITSECOND', title: '等待时长' }
        , { field: 'DHYJ', title: '等待预警' }


    ]];
    tableinit();
    function tableinit() {
        //第一个实例
        table.render({
            elem: '#demo'
            , id: "table"
            , height: "full-5"
            , url: '/api/DtglTjfx/ywblyjtjDatasMore' //数据接口
            , headers: { 'Authorization': window.sessionStorage.getItem('token') }
            , totalRow: false
            , page: true //开启分页
            , limits: [10, 12, 20, 30, 40, 50, 60, 70, 80, 90]
            , limit: 12
            , cols: cols
            , toolbar: false
            , where: where
            , parseData: function (res) { //将原始数据解析成 table 组件所规定的数据
                let data = [];
                res.data.forEach(function (item) {
                    item.WAITSECOND = Math.round(item.WAITSECOND / 60) + "分钟";
                    item.SECOND = Math.round(item.SECOND / 60) + "分钟";
                    item.DHYJ = item.DHYJ == "0" ? "否" : "<span style='color:red'>是</span>";
                    item.BLYJ = item.BLYJ == "0" ? "否" : "<span style='color:red'>是</span>";

                    data.push(item)
                })
                console.log(data)
                return {
                    "code": res.code, //解析接口状态
                    "count": res.count, //解析数据长度
                    "data": data
                };
            }
        });
    }
})
