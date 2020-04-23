var pagecolor = jQuery(".headtop", window.parent.document).css("background-color");
var AppData = JSON.parse(window.sessionStorage.getItem("AppData"));
var active;
var date = new Date();
date.setDate(date.getDate() - 3);
Vue.component('treeselect', VueTreeselect.Treeselect);
var data = {
    user: JSON.parse(window.sessionStorage.getItem("user")),
    customcolor: pagecolor,
    newcolor: "rgba(" + pagecolor.substring(pagecolor.indexOf("(") + 1, pagecolor.indexOf(")")) + ",0.8)",
    rqfw: date.Format("yyyy-MM-dd") + " - " + new Date().Format("yyyy-MM-dd"),
    bmmc: null,
    bmno: null,
    sqr: "",
    hpzlno: "",
    hpzl: "",
    hphm: "",
    ywlxno: "",
    ywlx: "",
    jbr: "",
    tblx:"",
    rq1: date.Format("yyyy-MM-dd"),
    rq2: new Date().Format("yyyy-MM-dd"),
    dws: [],
    dws1: [],
    code: {
        hpzls: [],
        ywlxs: [],
        tblx:[''].concat(AppData.Tblx)
    }
};
layui.use(['laydate', 'layer', 'table', 'jquery'], function () {
    var laydate = layui.laydate,
        layer = layui.layer,
        table = layui.table;
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
    var cols = [[//表头
        {
            type: 'numbers',
            title: '序号'
        }, {
            field: 'DWMC',
            title: '所属部门',
            width: 220
        }, {
            field: 'TBLX',
            title: '退办类型',
            width: 120
        }, {
            field: 'NAME',
            title: '申请人',
            width: 80,
            event: 'zs'
        }, {
            field: 'YWLX',
            title: '业务类型',
            width: 100
        }, {
            field: 'HPZL',
            title: '号牌种类',
            width: 100
        }, {
            field: 'HPHM',
            title: '号牌号码',
            width: 100
        }, {
            field: 'FILES',
            title: '缺少项',
            width: 390
        }, {
            field: 'JBR',
            title: '退办人',
            width: 100
        }, {
            field: 'GZRQ',
            title: '退办时间',
            width: 150
        }, {
            field: '',
            title: '查看',
            width: 70,
            toolbar: '#barDemo'
        }]]; //第一个实例

    table.render({
        elem: '#demo',
        id: "table",
        height: "full-85",
        url: '/api/DtglYwbl/QueryJdcywGzs' //数据接口
        ,
        headers: {
            'Authorization': window.sessionStorage.getItem('token')
        },
        totalRow: false,
        page: true //开启分页
        ,
        limits: [10, 14, 20, 30, 40, 50, 60, 70, 80, 90],
        limit: 14,
        cols: cols,
        toolbar: true,
        where: {
            dwno: data.bmno,
            sqr: data.sqr,
            hpzlno: data.hpzlno,
            hphm: data.hphm,
            ywlxno: data.ywlxno,
            tblx: data.tblx,
            jbr: data.jbr,
            rq1: data.rq1,
            rq2: data.rq2
        },
        parseData: function parseData(res) {
            //将原始数据解析成 table 组件所规定的数据
            res.data.forEach(function (item) {
                var qsx = [];
                var files = JSON.parse(item.FILES);
                files.forEach(function (it) {
                    if (it.qs) qsx.push(it.NAME);
                    if (it.CONTENT != "" && it.CONTENT != undefined) qsx.push("其他:" + it.CONTENT);
                });
                Object.assign(item, {
                    FILES: qsx.join("，")
                });
            });
        }
    });
    active = {
        reload: function reload() {
            //执行重载
            table.reload('table', {
                where: {
                    dwno: data.bmno,
                    sqr: data.sqr,
                    hpzlno: data.hpzlno,
                    hphm: data.hphm,
                    ywlxno: data.ywlxno,
                    tblx: data.tblx,
                    jbr: data.jbr,
                    rq1: data.rq1,
                    rq2: data.rq2
                },
                cols: cols
            });
        }
    };
    table.on('tool(test)', function (obj) {
        if (obj.event == "show") {
            window.parent.layindex2 = window.parent.layer.open({
                title: "详细信息",
                type: 2,
                area: [parent.window.innerWidth >= 1000 ? "1000px" : "90%", parent.window.innerHeight >= 900 ? "900px" : "90%"],
                fixed: false,
                //不固定
                maxmin: true,
                content: ["app/dtgl/ywbl/queryjdcywgzs-more.html?id=" + obj.data.ID, (parent.window.innerWidth >= 1000 && parent.window.innerHeight >=900 ? "no" : "yes")]
            });
        }
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
        rqfw: function rqfw(nv) {
            this.rq1 = nv.split(" - ")[0];
            this.rq2 = nv.split(" - ")[1];
        }
    },
    methods: {

        query: function query() {
            active["reload"] ? active["reload"].call(this) : '';
        },
        onselect: function (node, instanceId) {
            this.bmmc = node.label;
        },
    }
});

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
            lb: "['ALL@ALL@号牌种类','综合平台业务@机动车@业务类型']"
        },
        success: function success(res) {
            data.code.hpzls = [{
                CODE1: "",
                NAME: ""
            }].concat(res.Data);
            data.code.ywlxs = [{
                CODE1: "",
                NAME: ""
            }].concat(res.Data1);
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