var data = {
    where: {
        hphm: '',
        gxr: ''
    }
};
layui.use(['laydate', 'layer', 'table', 'jquery'], function () {
    var layer = layui.layer,
        table = layui.table;
    jQuery = layui.$;
    $ = layui.$; //日期范围


    var cols = [[ //表头
        { type: 'numbers', title: '序号' }
        , { field: 'HPZLNAME', title: '号牌类型', width: 100 }
        , { field: 'HPHM', title: '号牌号码', width: 120 }
        , { field: 'JDCSYR', title: '机动车所有人', width: 180 }
        , {
            field: 'JSSJ', title: '类型', width: 80,
            templet: function (d) {
                return d.JSSJ === "9999-12-31" ? "永久" : "固定期"
            }
        }
        , {
            field: 'JSSJ', title: '有效期止', width: 120,
            templet: function (d) {
                return d.JSSJ === "9999-12-31" ? "" : d.JSSJ
            }
        }
        , { field: 'GXR', title: '干系人', width: 200 }
        , { field: 'MEMO', title: '备注', width: 200 }
        , { field: '', title: '操作', width: 120, toolbar: '#barDemo' }
    ]];
    //第一个实例
    table.render({
        elem: '#demo'
        , id: "table"
        , height: "full-55"
        , url: '/api/HmdglWztc/GetInfo' //数据接口
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
        reload: function reload() {
            //执行重载
            table.reload('table', {
                where: data.where,
                cols: cols,
                page: {
                    curr: 1  //支持对象 laypage 参数
                }
            });
        }
    };
    table.on('tool(test)', function (obj) {
        if (obj.event == "edit") {
            window.parent.layindex2 = window.parent.layer.open({
                title: "增加用户",
                type: 2,
                area: ["900px", "500px"],
                fixed: false, //不固定
                maxmin: true,
                content: ["app/hmdgl/ryhmd/speciatableedit.html?id="+obj.data.ID, "no"]
            });
        }
        else if (obj.event == "del") {
            layer.confirm('真的删么', function (index) {
                delrow(obj);
                layer.close(index);
            });
        }
    });
});
var vm = new Vue({
    el: "#app",
    data: data,
    beforeCreate: function beforeCreate() {
    },
    watch: {

    },
    methods: {
        query: function () {
            active["reload"] ? active["reload"].call(this) : '';
        },
        add: function () {
            window.parent.layindex2 = window.parent.layer.open({
                title: "增加用户",
                type: 2,
                area: ["900px", "500px"],
                fixed: false, //不固定
                maxmin: true,
                content: ["app/hmdgl/ryhmd/speciatableadd.html", "no"]
            });
        }

    }
});
function delrow(obj) {
    var index = layer.load(0, { shade: [0.1, "#FFFFFF"] });
    /*post方法,方便后端以dynamic类获取数据,
     * 1-contentType:"application/json",
     * 2-data必须stringify*/
    jQuery.ajax({
        async: true,
        type: "post",
        contentType: "application/json",
        url: "/api/HmdglWztc/Del",
        headers: {
            'Authorization': window.sessionStorage.getItem('token')
        },
        data: JSON.stringify({
            id: obj.data.ID
        }),
        success: function (res) {
            layer.close(index);
            if (res === "0") {
                layer.alert("删除成功", { icon: 1 }, function (index) {
                    layer.close(index);
                    obj.del();
                });

            }
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
