var pagecolor = jQuery(".headtop", window.parent.document).css("background-color");
var active;
var date = new Date();
date.setDate(date.getDate() - 3650);

var data = {
    where: {
        balx: '',
        dwmc: '',
        zzjgdm: ''
    }
}
layui.use(['laydate', 'layer', 'table', 'jquery'], function () {
    var laydate = layui.laydate,
        layer = layui.layer,
        table = layui.table;
    var cols = [[ //表头
        { type: 'numbers', title: '序号' }
        , { field: 'BALX', title: '备案类型', width: 120 }
        , { field: 'DWLX', title: '单位类型', width: 100 }
        , { field: 'DWMC', title: '单位名称', width: 300 }
        , { field: 'ZZJGDM', title: '组织机构代码', width: 200 }
        , { field: 'ADDRESS', title: '地址', width: 200 }
        , { field: 'TEL', title: '联系电话', width: 100 }
        , { field: 'MEMO', title: '备注', width: 250 }
        , { field: 'OPTIME', title: '添加时间', width: 150 }
        , { field: '', title: '操作', width:115, toolbar: '#barDemo' }

    ]];
    //第一个实例
    table.render({
        elem: '#demo'
        , id: "table"
        , height: "full-60"
        , url: '/api/ZhglBagl/queryBaxx' //数据接口
        , headers: { 'Authorization': window.sessionStorage.getItem('token') }
        , totalRow: false
        , page: true //开启分页
        , limits: [10, 14, 20, 30, 40, 50, 60, 70, 80, 90]
        , limit: 14
        , cols: cols
        , toolbar: false
        , where: data.where
        , parseData: function (res) { //将原始数据解析成 table 组件所规定的数据

        }
    });

    active = {
        reload: function () {
            //执行重载
            table.reload('table', {
                where: data.where
            });
        }

    };
    table.on('tool(test)', function (obj) {
        if (obj.event == "show") {
            data.CurrentRowObj = obj
            window.parent.layindex2 = window.parent.layer.open({
                title: "申请信息",
                type: 2,
                area: [parent.window.innerWidth >= 1300 ? "1300px" : "90%", parent.window.innerHeight >= 1200 ? "1200px" : "90%"],
                fixed: false, //不固定
                maxmin: true,
                content: ["app/zhgl/bagl/baedit.html?xh=" + obj.data.ID, (parent.window.innerWidth >= 1300 && parent.window.innerHeight >= 1200 ? "no" : "yes")]
            });
        }
        else if (obj.event == "del") {
            layer.confirm('真的删备案信息么', function (index) {
                delrow(obj);
                layer.close(index);
            });
        }
    });
})
function delrow(obj) {
    var index = layer.load(0, { shade: [0.1, "#FFFFFF"] });
    /*post方法,方便后端以dynamic类获取数据,
    * 1-contentType:"application/json",
    * 2-data必须stringify*/
    jQuery.ajax({
        async: true,
        type: "post",
        contentType: "application/json",
        url: "/api/zhglbagl/delDwbaDb",
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
            else { alert('错误:' + ret.Message) } try { layer.close(index); } catch (e) { }
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
    },
    methods: {
        query: function () {
            active["reload"] ? active["reload"].call(this) : '';
        }
    }
})


