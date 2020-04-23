﻿var date = new Date();
date.setDate(date.getDate() - 3);
var data = {
    where: {
        zjhm: '',
        name: ''
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
        , { field: 'NAME', title: '名称', width: 200 }
        , { field: 'ZJHM', title: '证件号码', width: 200 }
        , { field: 'DLRNAME', title: '代理人名称', width: 200 }
        , { field: 'DLRZJHM', title: '代理人证件号码', width: 200 }
        , {
            field: 'ZT', title: '状态', width: 90, templet: function (res) {
                return res.ZT == "0" ? "正在制作" : "制作完毕"
            }
        }
        , { field: 'BTNZT', title: '操作', width: 140, templet: '#barDemo' }
    ]];
    //第一个实例
    table.render({
        elem: '#demo'
        , id: "table"
        , height: "full-55"
        , url: '/api/ZhglPzgl/GetPzInfo1' //数据接口
        , headers: { 'Authorization': window.sessionStorage.getItem('token') }
        , totalRow: false
        , page: false //开启分页
        , limits: [10, 14, 20, 30, 40, 50, 60, 70, 80, 90]
        , limit: 14
        , cols: cols
        , toolbar: false
        , where: data.where
        , parseData: function (res) { //将原始数据解析成 table 组件所规定的数据
            res.data.forEach(function (item) {
                Object.assign(item, { BTNZT: item.ZT })
            });
            let p = res.data;
            return {
                "code": res.code, //解析接口状态
                "count": res.count, //解析数据长度
                "data": p //解析数据列表
            };
        }
    });
    active = {
        reload: function reload() {
            //执行重载
            table.reload('table', {
                where: data.where,
                cols: cols
            });
        }
    };
    table.on('tool(test)', function (obj) {
        if (obj.event == "zzwc") {
            layer.confirm('确定该牌证制作完毕?', function (index) {
                edit(obj, 1);
                layer.close(index);
            });
        }
        else if (obj.event == "ly") {
            layer.confirm('确定已领取该牌证?', function (index) {
                edit(obj, 2);
                layer.close(index);
            });
        } else if (obj.event == "ql") {
            layer.confirm('确定弃领该牌证?', function (index) {
                edit(obj, 4);
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
function edit(obj, zt) {
    var index = layer.load(0, { shade: [0.1, "#FFFFFF"] });
    /*post方法,方便后端以dynamic类获取数据,
    * 1-contentType:"application/json",
    * 2-data必须stringify*/
    jQuery.ajax({
        async: true,
        type: "post",
        contentType: "application/json",
        url: "/api/ZhglPzgl/EditLicenseZt",
        headers: {
            'Authorization': window.sessionStorage.getItem('token')
        },
        data: JSON.stringify({
            id: obj.data.ID,
            zt: zt
        }),
        success: function (res) {
            if (zt == 2 || zt == 4) {
                obj.del();
            }
            else {
                obj.update(
                    {
                        ZT: zt,
                        BTNZT: zt
                    }
                )
            }
            active["reload"] ? active["reload"].call(this) : '';
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


