var pagecolor = jQuery(".headtop", window.parent.document).css("background-color");
var active;


var data = {
    ptlb: "",
    xtlb: "",
    ywlx: "",
    ywyy: "",
    blms: "",
    code: {
        ptlbs: [],
        xtlbs: [],
        blmss: []
    }
}
layui.use(['layer', 'table', 'jquery'], function () {
    var layer = layui.layer,
        table = layui.table;

    var cols = [[ //表头
        { type: 'numbers', title: '序号' }
        , { field: 'PTLB', title: '平台类别', width: 100 }
        , { field: 'XTLB', title: '系统类别', width: 100 }
        , { field: 'YWLX', title: '业务类型', width: 150 }
        , { field: 'YWYY', title: '业务原因', width: 100 }
        , { field: 'SHMS', title: '审核模式', width: 150 }
        , { field: 'BLMS', title: '办理模式', width: 140 }
        , { field: 'BRZL', title: '本人业务资料配置', width: 60 }
        , { field: 'DLRZL', title: '代理人业务资料配置', width: 70 }
        , { field: 'DWZL', title: '单位业务资料配置', width: 70 }
        , { field: '', title: '操作', width: 140, toolbar: '#barDemo' }

    ]];
    //第一个实例
    table.render({
        elem: '#demo'
        , id: "table"
        , height: "full-60"
        , url: '/api/XfywJcpz/QueryBusinessBase' //数据接口
        , headers: { 'Authorization': window.sessionStorage.getItem('token') }
        , totalRow: false
        , page: true //开启分页
        , limits: [10, 14, 20, 30, 40, 50, 60, 70, 80, 90]
        , limit: 14
        , cols: cols
        , toolbar: false
        , where: {
            ptlb: data.ptlb,
            xtlb: data.xtlb,
            ywlx: data.ywlx,
            ywyy: data.ywyy,
            blms: data.blms,
        }
        , parseData: function (res) { //将原始数据解析成 table 组件所规定的数据

        }
    });

    active = {
        reload: function () {
            //执行重载
            table.reload('table', {
                where: {
                    ptlb: data.ptlb,
                    xtlb: data.xtlb,
                    ywlx: data.ywlx,
                    ywyy: data.ywyy,
                    blms: data.blms,
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
                delbusiness(obj)
                layer.close(index);
            }, function () {
                return;
            });
        }
        else if (obj.event == "edit") {
            window.parent.layindex2 = window.parent.layer.open({
                title: "详细信息",
                type: 2,
                area: ["1000px", "800px"],
                fixed: false, //不固定
                maxmin: true,
                content: ["app/xfyw/jcpz/editbusiness.html?id=" + obj.data.ID, "no"]
            });
        }
    });
})

var vm = new Vue({
    el: "#app",
    data: data,
    beforeCreate: function () {
        init();
    },
    computed: {
        xtlbs1: function () {
            let p = data.code.xtlbs.filter(function (item) {
                return item.XTLB == data.ptlb;
            })
            return [{ CODE1: "", NAME: "" }].concat(p)
        }
    },
    watch: {

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
                content: ["app/xfyw/jcpz/addbusiness.html", "no"]
            });
        }

    }
})

function init() {
    jQuery.ajax({
        async: true,
        type: "get",
        contentType: "application/json",
        url: "/api/SysPublicMethod/GetCode",
        headers: {
            'Authorization': window.sessionStorage.getItem('token')
        },
        data: {
            lb: "['全局@全局@平台类别','全局@ALL@系统类别','全局@全局@办理模式']"
        },
        success: function (res) {
            data.code.ptlbs = [{ CODE1: "", NAME: "" }].concat(res.Data)
            data.code.xtlbs = res.Data1
            data.code.blmss = [{ CODE1: "", NAME: "" }].concat(res.Data2)

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
    })
}
function delbusiness(obj) {
    var index = layer.load(0, { shade: [0.1, "#FFFFFF"] });
    /*post方法,方便后端以dynamic类获取数据,
    * 1-contentType:"application/json",
    * 2-data必须stringify*/
    jQuery.ajax({
        async: true,
        type: "post",
        contentType: "application/json",
        url: "/api/XfywJcpz/BusinessBaseDel",
        headers: {
            'Authorization': window.sessionStorage.getItem('token')
        },
        data: JSON.stringify({
            id: obj.data.ID
        }),
        success: function (res) {
            obj.del();
            layer.close(index);
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
