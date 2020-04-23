var date = new Date();
date.setDate(date.getDate() - 3);
Vue.component('treeselect', VueTreeselect.Treeselect);
var data = {
    user: JSON.parse(window.sessionStorage.getItem("user")),
    bmmc: null,
    bmno: null,
    dws: [],
    dws1: [],
    code: {

    },
    where: {
        loginname: '',
        name: '',
        bmno: '',
        include: true
    }
};
layui.use(['laydate', 'layer', 'table', 'jquery'], function () {
    var laydate = layui.laydate,
        layer = layui.layer,
        table = layui.table;
    jQuery = layui.$;
    $ = layui.$; //日期范围


    var cols = [[ //表头
        { type: 'numbers', title: '序号' }
        , { field: 'DWNAME', title: '单位', width: 250 }
        , { field: 'LOGINNAME', title: '警号', width: 100 }
        , { field: 'NAME', title: '姓名', width: 150 }
        , { field: 'SFZHM', title: '身份证号码', width: 200 }
        , { field: 'TEL', title: '联系电话', width: 120 }
        , { field: 'STATE', title: '状态', width: 100 }
        , { field: '', title: '操作', width: 170, toolbar: '#barDemo' }
    ]];
    //第一个实例
    table.render({
        elem: '#demo'
        , id: "table"
        , height: "full-55"
        , url: '/api/SysQxUser/GetUsers' //数据接口
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
        if (obj.event == "show") {
            window.parent.layindex2 = window.parent.layer.open({
                title: "详细信息",
                type: 2,
                area: ["1300px", "800px"],
                fixed: false,
                //不固定
                maxmin: true,
                content: ["app/sys/qxgl/useredit.html?id=" + obj.data.ID, "no"]
            });
        }
        else if (obj.event == "del") {
            layer.confirm('真的删用户么', function (index) {
                delrow(obj);
                layer.close(index);
            });
        }
        else if (obj.event == "mmcz") {
            layer.confirm('真的要重置密码么?', function (index) {
                mmcz(obj);
                layer.close(index);
            });
        }
    });
});
var vm = new Vue({
    el: "#app",
    data: data,
    beforeCreate: function beforeCreate() {
        treeinit();
    },
    watch: {
        bmno: function (nv) {
            this.where.bmno = nv == undefined ? "" : nv;
        }
    },
    methods: {
        query: function () {
            active["reload"] ? active["reload"].call(this) : '';
        },
        add: function () {
            window.parent.layindex2 = window.parent.layer.open({
                title: "增加用户",
                type: 2,
                area: ["1300px", "800px"],
                fixed: false, //不固定
                maxmin: true,
                content: ["app/sys/qxgl/user.html", "no"]
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
        url: "/api/SysQxUser/UserDel",
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
function mmcz(obj) {
    var index = layer.load(0, { shade: [0.1, "#FFFFFF"] });
    /*post方法,方便后端以dynamic类获取数据,
    * 1-contentType:"application/json",
    * 2-data必须stringify*/
    jQuery.ajax({
        async: true,
        type: "post",
        contentType: "application/json",
        url: "/api/SysQxUser/ResetPwd",
        headers: {
            'Authorization': window.sessionStorage.getItem('token')
        },
        data: JSON.stringify({
            id: obj.data.ID
        }),
        success: function (res) {
            obj.del();
            layer.alert("重置成功!", { icon: 1 });
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
