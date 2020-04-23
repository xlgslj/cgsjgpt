var AppData = JSON.parse(window.sessionStorage.getItem("AppData"))
var sort;
try {
    sort = parent.currentNode.children.length + 1
}
catch (e) {
    sort = 1;
}
var data = {
    pid: parent.currentNode.ID,
    pname: parent.currentNode.name,
    name:"",
    icon:"",
    openmode: "弹层",
    minwidth:800,
    width: 800,
    minheight:600,
    height:600,
    fscreen: "否",
    auto:1,
    url:"",
    sort: sort,
    memo:""
}
var vm = new Vue({
    el: "#root",
    data: data,
    methods: {
        save: function () {
            layer.confirm("真的保存数据吗", {
                btn: ["确定", "放弃"]
            },
                function (index) {
                    layer.close(index);
                    save1();
                },
                function () {
                    return;
                }
            )
        }
    }
})
function save1() {
    var index = layer.load(0, { shade: [0.1,"#FFFFFF"] });
    /*post方法,方便后端以dynamic类获取数据,
     * 1-contentType:"application/json",
     * 2-data必须stringify*/
    jQuery.ajax({
        async: true,
        type: "post",
        contentType: "application/json",
        url: "/api/SysCsMenu/MenuAdd",
        headers: {
            'Authorization': window.sessionStorage.getItem('token')
        },
        data: JSON.stringify(data),
        success: function (res) {
            let obj = Object.assign({}, data, { ID: res.memo1.ID, id: res.memo1.ID, pId: data.pid, name: data.name, SORT: res.memo1.SORT })
            parent.addnode(obj);
            layer.close(index);
            parent.layer.close(parent.layindex);
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