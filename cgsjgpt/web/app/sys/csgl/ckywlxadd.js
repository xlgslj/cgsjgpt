
var data = {
    name: "",
    code: "",
    lshisnull: '否',
    memo:""
}
var vm = new Vue({
    el: "#root",
    data: data,
    computed: {
        upcode: {
            get: function () {
                return this.code
            },
            set: function (val) {
                this.code =val.toUpperCase()
            }
        }
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
function save1() {
    var index = layer.load(0, { shade: [0.1,"#FFFFFF"] });
    /*post方法,方便后端以dynamic类获取数据,
     * 1-contentType:"application/json",
     * 2-data必须stringify*/
    jQuery.ajax({
        async: true,
        type: "post",
        contentType: "application/json",
        url: "/api/SysCsYwlx/AddCodeYwlx",
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