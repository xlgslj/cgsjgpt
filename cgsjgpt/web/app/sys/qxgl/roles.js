var layindex;
var active;
layui.use(['layer', 'table', 'jquery'], function () {
    var table = layui.table;
    let jQuery = layui.$;
    let $ = layui.$;

    //第一个实例
    table.render({
        elem: '#demo'
        , id: "table"
        , height: "full-60"
        , url: '/api/SysQxRole/GetRoles' //数据接口
        , headers: { 'Authorization': window.sessionStorage.getItem('token') }
        , page: true //开启分页
        , cols: [[ //表头
            { field: 'ID', title: 'ID', width: 120, sort: true, fixed: 'left' }
            , { field: 'NAME', title: '用户名', width: 200 }
            , { field: 'ZT', title: '状态', width: 150 }
            , { fixed: 'right', width: 200, align: 'center', toolbar: '#barDemo' }
        ]]
        , toolbar: false
        , where: {

        }
    });
    active = {
        reload: function () {
            //执行重载
            table.reload('table', {
                page: {
                    curr: 1 //重新从第 1 页开始
                }
                , where: {

                }
            });
        }
    };

    jQuery("#query").click(function () {
        var type = $(this).data('type');
        active[type] ? active[type].call(this) : '';
    })

    jQuery("#add").click(function () {
        parent.layindex2 = parent.layer.open({
            title: '添加',
            type: 2,
            area: ['1200px', '800px'],
            fixed: false, //不固定
            maxmin: true,
            content: ['app/sys/qxgl/rolesadd.html', "no"]
        });
    })
    //监听工具条
    table.on('tool(test)', function (obj) {
        var data = obj.data;
        if (obj.event === 'del') {
            layer.confirm('真的删角色么', function (index) {
                delrow(obj);
                layer.close(index);
            });
        } else if (obj.event === 'edit') {
            data.CurrentRowObj = obj
            window.parent.layindex2 = window.parent.layer.open({
                title: "申请信息",
                type: 2,
                area: ["1300px", "800px"],
                fixed: false, //不固定
                maxmin: true,
                content: ["app/sys/qxgl/rolesedit.html?id=" + obj.data.ID, "no"]
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
        url: "/api/SysQxRole/RoleDel",
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
            else { alert('错误:' + ret.Message) }try{layer.close(index);}catch(e){}
            return;
        }
    });
}
// 注册消息事件监听，对来自 myIframe 框架的消息进行处理
window.addEventListener('message', function (e) {
    if (e.data.act == '红/黑名单审核完成') {
        active["reload"].call(this);
    }
}, false);

