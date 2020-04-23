

var AppData = JSON.parse(window.sessionStorage.getItem("AppData"))
var layindex, currentNode;
Vue.component('treeselect', VueTreeselect.Treeselect);

/////////laytable/////
layui.use(['layer', 'table'], function () {
    var table = layui.table;
    var jQuery = layui.$;

    //第一个实例
    table.render({
        elem: '#demo'
        , id: "table"
        , height: "full-60"
        , url: '/api/SysCsCkset/GetCkSet' //数据接口
        , headers: { 'Authorization': window.sessionStorage.getItem('token') }
        , page: true //开启分页
        , limits: [10, 14, 20, 30, 40, 50, 60, 70, 80, 90]
        , limit: 14
        , cols: [[ //表头
            { type: 'numbers' }
            , { field: 'BMMC', title: '部门名称', width: 180 }
            , { field: 'CKMC', title: '窗口名称', width: 100 }
            , { field: 'IP', title: 'IP地址', width: 100 }
            , {
                field: 'YWLX', title: '业务类型', templet: function (d) {
                    let nv = [];
                    JSON.parse(d.YWLXS).forEach(function (item) {
                        nv.push(item.NAME)
                    })
                    return nv.join(",")
                }, width: 400
            }
            , { field: 'CZRY', title: '操作人员', width: 100 }
            , { field: 'CZSJ', title: '操作时间', width: 120 }
            , { field: 'KZKDZ', title: '控制卡地址', width: 100 }
            , { field: 'ZT', title: '状态', width: 80 }
            , { title: '操作', fixed: 'right', width: 70, align: 'center', toolbar: '#barDemo' }
        ]]
        , toolbar: false
        , where: {
            first: false,
            bmmc: "",
            ckmc: ""
        }
    });
    table.on('tool(test)', function (obj) {
        if (obj.event == "edit") {
            data.CurrentRowObj = obj
            window.parent.layindex2 = window.parent.layer.open({
                title: "预警核查",
                type: 2,
                area: ["900px", "600px"],
                fixed: false, //不固定
                maxmin: true,
                content: ["app/sys/csgl/ckEdit.html?id=" + obj.data.ID, "no"]
            });
        }
    });
});
///////////vue////////
var data = {
    user: JSON.parse(window.sessionStorage.getItem("user")),
    bmmc: null,
    bmno: null,
    ckmc: "",
    dws: [],
    dws1: []
}
var vm = new Vue({
    el: "#app",
    data: data,
    beforeCreate: function () {
        treeinit();
    },
    mounted: function () {

    },
    methods: {
        add: function () {
            layindex = layer.open({
                title: '添加',
                type: 2,
                area: ['900px', '600px'],
                fixed: false, //不固定
                maxmin: true,
                content: ['ckadd.html', "no"]
            });
        }
    }

})
function treeinit() {
    var index = layer.load(0, { shade: [0.1, "#FFFFFF"] });
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



