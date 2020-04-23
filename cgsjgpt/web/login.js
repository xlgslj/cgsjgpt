window.sessionStorage.clear();
var height = $(window).height();
var width = $(window).width();
$(".login").css("padding-top", height / 2 - $(".login").height() / 2);
$(".login").css("padding-left", $(window).width() / 2 - $(".login").width() / 2);
$(window).resize(function () {
    $(".login").css("padding-top", $(window).height() / 2 - $(".login").height() / 2);
    $(".login").css("padding-left", $(window).width() / 2 - $(".login").width() / 2); //alert($(window).width()/2 - $(".loginpanel").width()/2);
});
var url = document.location.toString();
var rootUrl = url.split("//")[1];
rootUrl = rootUrl.indexOf(":") >= 0 ? rootUrl.split(":")[0] : rootUrl.split("/")[0];
console.log(rootUrl);
window.sessionStorage.setItem('rooturl', rootUrl); // 注册一个全局自定义指令 `v-focus`
// 注册一个全局自定义指令 `v-focus`
Vue.directive('focus', {
    // 当被绑定的元素插入到 DOM 中时……
    inserted: function (el, obj) {  //这是需要页面刚加载就能进行聚焦操作使用的钩子函数,可以省略的，视具体需求而定
        //console.log(obj);
        if (obj.value) { //对值进行判断
            // 聚焦元素
            el.focus()
        }
    },
    // 当指令所在组件的 VNode 及其子 VNode 全部更新后调用
    componentUpdated: function (el, obj) {  //这是每当绑定的值发生改变时触发的钩子函数
        //console.log(obj);  //可以打印看一下
        if (obj.value) {
            el.focus()
        }
    }
})

var data = {
    focusIndex: 0, //用来存放下一个应该聚焦的index值
    focusobj: 'pwd',
    name: window.localStorage.getItem("name"),
    pwd: window.localStorage.getItem("pwd"),
    saved: window.localStorage.getItem("saved") == null ? false : window.localStorage.getItem("saved")
};
var vm = new Vue({
    el: "#login",
    data: data,
    methods: {
        next: function (event) {
            let id = event.target.id;
            if (id == "name") {
                this.focusIndex = 1;
            }
            else if (id == "pwd") {
                this.login();
            }
        },
        login: function login() {
            this.focusobj = '';

            if (this.name.trim().length == 0 || this.pwd.trim().length == 0) {
                layer.alert("用户名和密码不能为空", {
                    icon: 2
                });
                return false;
            }

            var index = layer.load(0, {
                shade: [0.1, "#FFFFFF"]
            });
            jQuery.ajax({
                async: true,
                type: "get",
                url: "/api/login/Login",
                headers: {
                    'Authorization': 'admin'
                },
                data: {
                    LoginName: this.name,
                    Pwd: this.pwd
                },
                success: function success(res) {
                    if (res.Msg == "0") {
                        window.sessionStorage.setItem('token', res.memo1);
                        window.sessionStorage.setItem('user', JSON.stringify(res.Data[0]));
                        window.sessionStorage.setItem('AppData', JSON.stringify(AppData));
                        window.sessionStorage.setItem("ConfigBm", JSON.stringify(res.CONFIGBM))
                        window.localStorage.setItem("ConfigBm", JSON.stringify(res.CONFIGBM))
                        let version = res.VERSION;
                        window.sessionStorage.setItem("VERSION", version);
                        window.localStorage.setItem("VERSION", version);
                        if (data.saved) {
                            window.localStorage.setItem("name", data.name);
                            window.localStorage.setItem("pwd", data.pwd);
                            window.localStorage.setItem("saved", data.saved);

                        }
                        else {
                            window.localStorage.clear();
                        }
                        window.location = "main.html?v=" + version;
                    } else {
                        layer.alert('错误:' + res.memo1, {
                            icon: 2
                        });
                        window.sessionStorage.clear();
                    }

                    layer.close(index);
                },
                error: function error(res) {
                    var ret = JSON.parse(res.responseText);
                    layer.alert('错误:' + ret.Message + "(请检查用户名/密码)", {
                        icon: 2
                    });

                    if (ret.Message == "Token 不存在或过期") {
                        window.sessionStorage.clear();
                    }

                    layer.close(index);
                }
            });
        }
    }
});

