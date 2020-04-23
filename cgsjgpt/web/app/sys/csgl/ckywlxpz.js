var layindex;
layui.use(['layer', 'table', 'jquery'], function () {
    var table = layui.table;
    let jQuery = layui.$;
    let $ = layui.$;

    //第一个实例
    table.render({
        elem: '#demo'
        , id: "table"
        , height: "full-60"
        , url: '/api/SysCsYwlx/GetCodeYwlx' //数据接口
        , headers: { 'Authorization': window.sessionStorage.getItem('token') }
        , page: true //开启分页
        , cols: [[ //表头
            { field: 'ID', title: 'ID', width: 120, sort: true, fixed: 'left' }
            , { field: 'NAME', title: '用户名', width: 200 }
            , { field: 'CODE', title: 'EN', width: 50 }
            , { field: 'LSHISNULL', title: '流水号是否可为空', width: 150 }
            , { field: 'MEMO', title: '备注', width: 400 }
            , { fixed: 'right', width: 200, align: 'center', toolbar: '#barDemo' }
        ]]
        , toolbar: false
        , where: {
            first: false
        }
    });
    var active = {
        reload: function () {
            //执行重载
            table.reload('table', {
                page: {
                    curr: 1 //重新从第 1 页开始
                }
                , where: {
                    first: false
                }
            });
        }
    };

    jQuery("#query").click(function () {
        var type = $(this).data('type');
        active[type] ? active[type].call(this) : '';
    })
    jQuery("#add").click(function () {
        layindex = layer.open({
            title: '添加',
            type: 2,
            area: ['900px', '450px'],
            fixed: false, //不固定
            maxmin: true,
            content: ['ckywlxadd.html', "no"]
        });
    })
    //监听工具条
    table.on('tool(test)', function (obj) {
        var data = obj.data;
        if (obj.event === 'detail') {
            obj.update({
                NAME: '123'

            });
            layer.msg(data.ID);
        } else if (obj.event === 'del') {
            layer.confirm('真的删除行么', function (index) {
                delrow(obj);
                layer.close(index);
            });
        } else if (obj.event === 'edit') {
            window.parent.layindex2 = window.parent.layer.open({
                title: "详细信息",
                type: 2,
                area: [parent.window.innerWidth >= 1000 ? "1000px" : "90%", parent.window.innerHeight >= 600 ? "600px" : "90%"],
                fixed: false,
                //不固定
                maxmin: true,
                content: ["app/sys/csgl/ckywlxpz-edit.html?id=" + obj.data.ID, (parent.window.innerWidth >= 1000 && parent.window.innerHeight >= 600 ? "no" : "yes")]
            });
        }
    });
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
        url: "/api/SysCsYwlx/DelCodeYwlx",
        headers: {
            'Authorization': window.sessionStorage.getItem('token')
        },
        data: JSON.stringify({
            id: obj.data.ID
        }),
        success: function (res) {
            obj.del();
            layer.close(index);
            ret = true;
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
            ret = false;
        }
    });
}
function updaterow(obj, value) {
    var index = layer.load(0, { shade: [0.1, "#FFFFFF"] });
    /*post方法,方便后端以dynamic类获取数据,
    * 1-contentType:"application/json",
    * 2-data必须stringify*/
    jQuery.ajax({
        async: true,
        type: "post",
        contentType: "application/json",
        url: "/api/SysCsYwlx/EditCodeYwlx",
        headers: {
            'Authorization': window.sessionStorage.getItem('token')
        },
        data: JSON.stringify({
            id: obj.data.ID,
            name:value
        }),
        success: function (res) {
            obj.update({
                NAME: value

            });
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
 
        }
    });
}
