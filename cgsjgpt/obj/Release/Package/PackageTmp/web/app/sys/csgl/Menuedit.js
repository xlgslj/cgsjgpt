var AppData = JSON.parse(window.sessionStorage.getItem("AppData"))

var data = {
    id: parent.currentNode.ID,
    pid: "",
    pname:"",
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
    sort: 0,
    memo:""
}
var vm = new Vue({
    el: "#root",
    data: data,
    beforeCreate: function () {
        init();
    },
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
function init() {
    var index = layer.load(0, { shade: [0.1, "#FFFFFF"] });
    /*post方法,方便后端以dynamic类获取数据,
     * 1-contentType:"application/json",
     * 2-data必须stringify*/
    jQuery.ajax({
        async: true,
        type: "get",
        contentType: "application/json",
        url: "/api/SysCsMenu/MenuGet",
        headers: {
            'Authorization': window.sessionStorage.getItem('token')
        },
        data: {
            id:data.id
        },
        success: function (res) {
            let d = res.data;
            data.pid = d.PID;
            data.pname = d.PNAME;
            data.name = d.NAME;
            data.icon = d.ICON;
            data.openmode = d.OPENMODE;
            data.minwidth = d.MINWIDTH;
            data.width = d.WIDTH;
            data.minheight = d.MINHEIGHT;
            data.height = d.HEIGHT;
            data.fscreen = d.FSCREEN;
            data.auto = d.AUTO;
            data.url = d.URL;
            data.sort = d.SORT;
            data.memo = d.MENO;
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
function save1() {
    var index = layer.load(0, { shade: [0.1,"#FFFFFF"] });
    /*post方法,方便后端以dynamic类获取数据,
     * 1-contentType:"application/json",
     * 2-data必须stringify*/
    jQuery.ajax({
        async: true,
        type: "post",
        contentType: "application/json",
        url: "/api/SysCsMenu/MenuEdit",
        headers: {
            'Authorization': window.sessionStorage.getItem('token')
        },
        data: JSON.stringify(data),
        success: function (res) {
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