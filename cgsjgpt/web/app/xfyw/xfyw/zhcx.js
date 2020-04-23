var pagecolor = jQuery(".headtop", window.parent.document).css("background-color");
var active;
var sourceData, tableData;
var checkrows = [];
var currentNOde = {};
var date = new Date();
date.setDate(date.getDate() - 3);
Vue.component('treeselect', VueTreeselect.Treeselect);
var data = {
    user: JSON.parse(window.sessionStorage.getItem("user")),
    bmmc: null,
    bmno: null,
    dws: [],
    dws1: [],
    where: {
        bmno: '',
        include: true,
        ptlb: "",
        xtlb: "",
        ywlx: "",
        ywyy: "",
        blms: "",
        shms: "",
        hphm: "",
        brzjhm: "",
        rq1: date.Format("yyyy-MM-dd"),
        rq2: (new Date()).Format("yyyy-MM-dd"),
    },
    rqfw: date.Format("yyyy-MM-dd") + " - " + (new Date()).Format("yyyy-MM-dd"),
    code: {
        ptlbs: [],
        xtlbs: [],
        blmss: []
    },
    dbclicked: false
}
layui.use(['laydate', 'layer', 'table', 'jquery'], function () {
    var layer = layui.layer,
        table = layui.table,
        laydate = layui.laydate;
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
        , { field: 'DWMC', title: '单位', width: 150 }
        , { field: 'YWLX', title: '业务类型', width: 150 }
        , { field: 'YWYY', title: '业务原因', width: 100 }
        , { field: 'SHMS', title: '审核模式', width: 100 }
        , { field: 'BLMS', title: '办理模式', width: 100 }
        , { field: 'BRZJHM', title: '本人证件号码', width: 120 }
        , { field: 'HPHM', title: '号牌号码', width: 90 }
        , { field: 'OPER', title: '提交人', width: 80 }
        , { field: 'OPERTIME1', title: '提交时间', width: 150 }
        , { field: 'SPER', title: '审核人', width: 80 }
        , { field: 'SPTIME1', title: '审核时间', width: 150 }
        , { field: 'ZT', title: '状态', width: 120 }
        , { title: '操作', fixed: 'right', width: 70, align: 'center', toolbar: '#barDemo' }

    ]];
    //第一个实例
    table.render({
        elem: '#demo'
        , id: "table"
        , height: "full-80"
        , url: '/api/XfywXfyw/QueryBusiness' //数据接口
        , headers: { 'Authorization': window.sessionStorage.getItem('token') }
        , totalRow: false
        , page: true //开启分页
        , limits: [10, 14, 20, 30, 40, 50, 60, 70, 80, 90]
        , limit: 14
        , cols: cols
        , toolbar: false
        , where: data.where
        , parseData: function (res) { //将原始数据解析成 table 组件所规定的数据
            res.data.forEach(function (item) {
                let zt = item.ZT;
                if (zt == "00") item.ZT = "待审核";
                if (zt == "01") item.ZT = "审核未通过";
                if (zt == "10") item.ZT = "待补录";
                if (zt == "11") item.ZT = "审核通过,待补录";
                if (zt == "20") item.ZT = "补录完成";
            });
            return {
                "code": res.code, //解析接口状态
                "count": res.count, //解析数据长度
                "data": res.data //解析数据列表
            };
        }
    });

    active = {
        reload: function () {
            //执行重载
            table.reload('table', {
                where: data.where
                , cols: cols
            });
        }
    };
    //监听工具条
    table.on('tool(test)', function (obj) {
        if (obj.event == "show") {
            window.parent.layindex2 = window.parent.layer.open({
                title: "详细信息",
                type: 2,
                area: ["1600px", "900px"],
                fixed: false,
                //不固定
                maxmin: true,
                content: ["app/xfyw/xfyw/zhcxmore.html?id=" + obj.data.ID, "no"]
            });
        }
    });
})

var vm = new Vue({
    el: "#app",
    data: data,
    beforeCreate: function () {
        init();
        treeinit();
    },
    computed: {
        xtlbs1: function () {
            let p = data.code.xtlbs.filter(function (item) {
                return item.XTLB == data.where.ptlb;
            })
            return [{ CODE1: "", NAME: "" }].concat(p)
        }
    },
    watch: {
        rqfw: function (nv) {
            this.where.rq1 = nv.split(" - ")[0];
            this.where.rq2 = nv.split(" - ")[1];
        },
        bmno: function (nv) {
            this.where.bmno = nv == undefined ? "" : nv;
        }
    },
    methods: {
        query: function () {
            active["reload"] ? active["reload"].call(this) : '';

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
            else { alert('错误:' + ret.Message) } try { layer.close(index); } catch (e) { }
            return;
        }
    })
}

function treeinit() {
    jQuery.ajax({
        async: true,
        type: "get",
        contentType: "application/json",
        url: "/api/SysQxBm/BmGet",
        headers: {
            'Authorization': window.sessionStorage.getItem('token')
        },
        data: {},
        success: function (res) {
            data.dws = res.Data;
            let temp = [];
            data.dws.forEach(function (item) {
                temp.push(Object.assign({}, { id: item.ID, pid: item.PID, label: item.NAME }));
            });
            let l = temp.filter(function (v) {
                return v.id == data.user.DWNO;
            })[0];
            l = Object.assign(l, { "children": builddw1(temp, data.user.DWNO) })
            data.dws1 = [];
            data.dws1.push(l);

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
function builddw1(data, pid) {
    var result = [], temp;
    //result.push(pid);
    for (var i in data) {
        if (data[i].pid == pid) {
            result.push(data[i]);
            //result.push(Object.assign(data[i],{id:data[i].ID,label:data[i].NAME}));
            temp = builddw1(data, data[i].id);
            if (temp.length > 0) {
                data[i].children = temp;
            }
        }
    }
    return result;

}
