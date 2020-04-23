var AppData = JSON.parse(window.sessionStorage.getItem("AppData"))
var data = {
    pid: parent.currentNode.ID,
    pname: parent.currentNode.NAME,
    bmno: "",
    bmmc: "",
    bajgno: "",
    bajgmc: "",
    bmjb: "",
    lxr: "",
    lxdh: "",
    fzjg: "",
    fax: "",
    lxdz: "",
    sfjg:"1",
    memo: "",
    PFzjg: AppData.Fzjg
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
        url: "/api/SysQxBm/BmAdd",
        headers: {
            'Authorization': window.sessionStorage.getItem('token')
        },
        data: JSON.stringify(data),
        success: function (res) {
            let obj = Object.assign({}, data, { ID: res.memo1,id: res.memo1, pId: data.pid, name: data.bmmc })
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