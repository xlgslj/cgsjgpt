var date = new Date();
date.setDate(date.getDate() - 3);
Vue.component('treeselect', VueTreeselect.Treeselect);
var data = {
    user: JSON.parse(window.sessionStorage.getItem("user")),
    rqfw: date.Format("yyyy-MM-dd") + " - " + new Date().Format("yyyy-MM-dd"),
    bmmc:null,
    bmno:null,
    dws: [],
    dws1: [],
    code: {

    },
    hczt: '',
    where: {
        xtlb: '',
        warnlx: '',
        warnlx1: '',
        oplx: '',
        name: '',
        sfzmhm: '',
        hphm: '',
        hczt: '',
        oper: '',
        hcjg: '',
        rq1: date.Format("yyyy-MM-dd"),
        rq2: new Date().Format("yyyy-MM-dd"),
        bmno: ''
    }
};
layui.config({
    base: '../../../js/layui_exts/'
}).use(['laydate', 'layer', 'table', 'jquery', 'excel'], function () {
    var laydate = layui.laydate,
        layer = layui.layer,
        table = layui.table,
        excel = layui.excel;
    jQuery = layui.$;
    $ = layui.$; //日期范围

    laydate.render({
        elem: '#rqfw',
        value: data.rqfw,
        range: true,
        done: function done(value, date) {
            data.rqfw = value;
        }
    });

    var cols = [[ //表头
        { type: 'numbers', title: '序号', fixed: 'left' }
        , { field: 'WARNLX1', title: '预警类型', width: 120, fixed: 'left' }
        , { field: 'OPLX', title: '预警说明', width: 180, fixed: 'left' }
        , { field: 'XTLB', title: '系统类别', width: 100 }
        , { field: 'YWLX', title: '业务类型', width: 120 }
        , { field: 'NAME', title: '车主/驾驶人姓名', width: 140 }
        , { field: 'SFZMHM', title: '车主/驾驶人身份证号', width: 185 }
        , { field: 'HPZLNAME', title: '号牌种类', width: 100 }
        , { field: 'HPHM', title: '号牌号码', width: 100 }
        , { field: 'CJH', title: '车架号', width: 200 }
        , { field: 'SYXZ', title: '使用性质', width: 90 }
        , { field: 'OPLX1', title: '状态', width: 100 }
        , {
            field: 'REGTIME', title: '登记时间', width: 180, templet: function (d) {
                var txt = d.OPLX === "办理超时预警" ? d.SECOND : (d.OPLX === "等待超时预警" ? d.SECOND : (d.REGTIME ? d.REGTIME : ''))
                return txt
            }
        }
        , { field: 'STARTTIME', title: '办理时间', width: 180 }
        , { field: 'GLLSH', title: '关联流水号', width: 150 }
        , { field: 'DWMC', title: '管理部门', width: 100 }
        , { field: 'OPERNAME', title: '经办人', width: 100 }
        , { field: '', title: '操作', width: 120, toolbar: '#barDemo', fixed: 'right' }

    ]];
    //第一个实例
    table.render({
        elem: '#demo'
        , id: "table"
        , height: "full-85"
        , url: '/api/YjglYjgl/YwblYjhcList1' //数据接口
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
                item.ZT = item.ZT == "00" ? "待审核" : (item.ZT == "01" ? "审核不通过" : (item.ZT == "10" ? "无需审核" : "审核通过"))
            });
            return {
                "code": res.code, //解析接口状态
                "count": res.count, //解析数据长度
                "data": res.data //解析数据列表
            };
        }
    });
    active = {
        reload: function reload() {
            //执行重载
            table.reload('table', {
                where: data.where,
                cols: cols,
                page: {
                    curr: 1 //重新从第 1 页开始
                }
            });
        }
    };
    table.on('tool(test)', function (obj) {
        if (obj.event == "show") {
            window.parent.layindex2 = window.parent.layer.open({
                title: "详细信息",
                type: 2,
                area: ["1600px", "900px"],
                fixed: false,
                //不固定
                maxmin: true,
                content: ["app/yjgl/yjgl/yjzhcxmore.html?id=" + obj.data.ID, "no"]
            });
        }
    });
    $('#exportExcel').on('click', function () {
        jQuery.ajax({
            async: true,
            type: "get",
            contentType: "application/json",
            url: "/api/YjglYjgl/YwblYjhcList1",
            headers: {
                'Authorization': window.sessionStorage.getItem('token')
            },
            data: Object.assign(data.where, { page: 1, limit: 1000 }),
            success: function success(res) {
                var data = res.data;
                data.forEach(function (item) {
                    var v = item.OPLX === "办理超时预警" ? item.SECOND : (item.OPLX === "等待超时预警" ? item.SECOND : (item.REGTIME ? item.REGTIME : ''))
                    item.REGTIME = v
                })
                // 重点！！！如果后端给的数据顺序和映射关系不对，请执行梳理函数后导出
                data = excel.filterExportData(data, [
                    'WARNLX1'
                    , 'OPLX'
                    , 'XTLB'
                    , 'YWLX'
                    , 'NAME'
                    , 'SFZMHM'
                    , 'HPZLNAME'
                    , 'HPHM'
                    , 'CJH'
                    , 'SYXZ'
                    , 'OPLX1'
                    , 'REGTIME'
                    , 'STARTTIME'
                    , 'GLLSH'
                    , 'DWMC'
                    , 'OPERNAME'
                    , 'HCJG'
                    , 'MEMO2'
                ]);
                // 重点2！！！一般都需要加一个表头，表头的键名顺序需要与最终导出的数据一致
                data.unshift(
                    {
                        WARNLX1: "预警类型"
                        , OPLX: "预警说明"
                        , XTLB: "系统类别"
                        , YWLX: "业务类型"
                        , NAME: "车主/驾驶人姓名"
                        , SFZMHM: "车主/驾驶人身份证号"
                        , HPZLNAME: "号牌种类"
                        , HPHM: "号牌号码"
                        , CJH: "车架号"
                        , SYXZ: "使用性质"
                        , OPLX1: "状态"
                        , REGTIME: "登记时间"
                        , STARTTIME: "办理时间"
                        , GLLSH: "关联流水号"
                        , DWMC: "管理部门"
                        , OPERNAME: "经办人"
                        , HCJG: '核查结果'
                        , MEMO2: '核查说明'
                    });
                excel.exportExcel(data, '预警信息.xlsx', 'xlsx');
            },
            error: function error(res) {
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
    });
});
var vm = new Vue({
    el: "#app",
    data: data,
    beforeCreate: function beforeCreate() {
        init();
        treeinit();
    },
    watch: {
        rqfw: function (nv) {
            this.where.rq1 = nv.split(" - ")[0];
            this.where.rq2 = nv.split(" - ")[1];
        },
        bmno: function (nv) {
            this.where.bmno = nv == undefined ? "" : nv;
        },
        hczt: function (nv) {
            this.where.hczt = nv;
            this.where.hcjg = "";
        }
    },
    methods: {
        query: function () {
            active["reload"] ? active["reload"].call(this) : '';
        }
    }
});

function init() {
    jQuery.ajax({
        async: true,
        type: "get",
        contentType: "application/json",
        url: "/api/YjglYjgl/YjzhcxInit",
        headers: {
            'Authorization': window.sessionStorage.getItem('token')
        },
        data: {

        },
        success: function success(res) {
            data.code = res;
            data.code.hczt = [
                {
                    v: '',
                    t: '所有'
                },
                {
                    v: '0',
                    t: '待核查'
                },
                {
                    v: '1',
                    t: '已核查'
                }
            ];
            data.code.hcjg = [
                {
                    v: '',
                    t: '所有'
                },
                {
                    v: '正常',
                    t: '正常'
                },
                {
                    v: '异常',
                    t: '异常'
                }
            ];

        },
        error: function error(res) {
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
            else { alert('错误:' + ret.Message) }try{layer.close(index);}catch(e){}
            return;
        }
    });
}
function builddw1(data, pid) {
    var result = [], temp;
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