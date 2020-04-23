if (screen.height < 1080) {

    jQuery("*").css("font-size", "13px");

}
var layindex, layindex2, layindex3;
var popupwin;
var screenheight;
var warnmenuid;
var warnmenuobj;
var warnlayeridx;
var warnhtml = "";

var data = {
    user: JSON.parse(window.sessionStorage.getItem("user")),
    version: window.sessionStorage.getItem("VERSION"),
    menus: [
        {
            id: '0010000000',
            name: '首页',
            icon: '',
            url: ''
        },
        {
            id: '0020000000',
            name: '业务大厅',
            icon: '',
            url: ''
        },
        {
            id: '0030000000',
            name: '黑名单管理',
            icon: '',
            url: ''
        },
        {
            id: '0040000000',
            name: '下放业务管理',
            icon: '',
            url: ''
        },
        {
            id: '0050000000',
            name: '综合管理',
            icon: '',
            url: ''
        },
        {
            id: '0060000000',
            name: '预警管理',
            icon: '',
            url: ''
        },
        {
            id: '0070000000',
            name: '监督管理',
            icon: '',
            url: ''
        },
        {
            id: '0080000000',
            name: '系统管理',
            icon: '',
            url: ''
        },
        {
            id: '0080010000',
            name: '权限管理',
            icon: '',
            url: ''
        },
        {
            id: '0080010001',
            name: '部门管理',
            icon: '',
            url: 'app/sys/qxgl/bmgl.html'
        },
        {
            id: '0080010002',
            name: '用户管理',
            icon: '',
            url: 'app/sys/qxgl/user.html'
        },
        {
            id: '0080010003',
            name: '新增部门',
            icon: '',
            url: 'app/sys/qxgl/bmadd.html'
        },
        {
            id: '0010010000',
            name: '表单',
            icon: '',
            url: ''
        },
        {
            id: '0020020000',
            name: '业务办理',
            icon: '',
            url: ''
        },
        {
            id: '0020030000',
            name: '统计分析',
            icon: '',
            url: ''
        },
        {
            id: '0020020001',
            name: '模块管理',
            icon: '',
            url: ''
        },
        {
            id: '0020020002',
            name: '插件参数配置',
            icon: '',
            url: ''
        },
        {
            id: '0020030001',
            name: '模块管理1',
            icon: '',
            url: ''
        },
        {
            id: '0020030002',
            name: '插件参数配置1',
            icon: '',
            url: ''
        },
        {
            id: '0010010001',
            name: '表单1',
            icon: '',
            url: 'app/sys/csgl/menu.html'
        },
    ],
    MenuOneSelectEd: '',
    MenuTwoSelectEd: '',
    MenuThrSelectEd: '',
    fastmenu: [],
    MenuSwitch: {
        up: 1,
        left: 1
    }
}




var index = layer.load(0, { shade: [0.1, "#FFFFFF"] });
jQuery.ajax({
    async: true,
    type: "get",
    url: "/api/login/EnterMain",
    headers: {
        'Authorization': window.sessionStorage.getItem('token')
    },
    data: {

    },
    success: function (res) {
        data.menus = res.Data;
        let p = JSON.parse(data.user.FASTMENU);
        p.forEach(function (item) {
            let v = data.menus.find(function (item2) {
                return item2.ID == item;
            });
            data.fastmenu = data.fastmenu.concat(v);
        });


        //是否有预警权限
        warnmenuid = res.YJHCCDID;
        warnmenuobj = data.menus.filter(function (item) {
            return item.ID == warnmenuid;
        })
        //显示器最小高度
        screenheight = res.XSQZXGD;
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

var vm = new Vue({
    el: "#main",
    data: data,
    created: function () {
        //alert(this.MenuOneSelectEd);
    },
    mounted: function () {
        //alert(JSON.stringify(this.MenuThr));
    },
    computed: {
        MenuOne: function () {
            try {
                var obj = this.menus.filter(function (item) {
                    return item.PID == "R000000001";
                });
                this.MenuOneSelectEd = obj[0].ID;
                return obj;
            }
            catch (e) {
                return {};
            }
        },
        MenuTwo: function () {
            try {
                var v = this.MenuOneSelectEd
                var obj = this.menus.filter(function (item) {
                    return item.PID == v;
                });
                this.MenuTwoSelectEd = obj[0].ID;
                return obj;
            }
            catch (e) {

                return {};
            }
        },
        MenuThr: function () {
            try {
                var v = this.MenuTwoSelectEd;
                var obj = this.menus.filter(function (item) {
                    return item.PID == v;
                });
                return obj;
            }
            catch (e) {
                return {};
            }
        },


    },
    methods: {
        MenuOneClick: function (val) {
            try {

                //顶部菜单展开
                this.MenuSwitch.up = 1;
                this.MenuOneSelectEd = val;
                this.MenuTwoSelectEd = this.MenuTwo[0].ID;


            }
            catch (e) {
                this.MenuTwoSelectEd = "1234567890";
            }

            //alert(this.MenuOneSelectEd+"||"+this.MenuTwoSelectEd);
            //alert(JSON.stringify(this.MenuThr));
        },
        MenuTwoClick: function (val) {
            this.MenuTwoSelectEd = val;
        },
        MenuThrClick: function (id, name, url) {
            this.MenuThrSelectEd = id;
            var obj = this.menus.filter(function (item) {
                return item.ID == id;
            })[0];

            let w = window.innerWidth < obj.WIDTH && obj.AUTO == "1" ? "90%" : (obj.WIDTH + "px");
            let h = window.innerHeight < obj.HEIGHT && obj.AUTO == "1" ? "90%" : (obj.HEIGHT + "px");
            let scroll = (window.innerWidth < obj.WIDTH || window.innerHeight < obj.HEIGHT) && (obj.AUTO == "1") ? "yes" : "no";
            //alert(obj.url.indexOf('?'));
            layindex = layer.open({
                title: name,
                type: 2,
                area: [w, h],
                fixed: false, //不固定
                maxmin: true,
                content: [obj.URL + (obj.URL.indexOf('?') < 0 ? '?v=' : '&v=') + data.version, scroll]
            });
            if (obj.FSCREEN == "是") layer.full(layindex);
        },
        //顶部菜单收缩
        menuup: function () {
            this.MenuSwitch.up = 0;
        },
        //左侧菜单收缩
        MenuLeftHide: function () {
            this.MenuSwitch.left = 0;
        },
        //左侧菜单展开d
        MenuLeftShow: function () {
            this.MenuSwitch.left = 1;
        },
        xgmm: function () {
            layindex = layer.open({
                title: "密码修改",
                type: 2,
                area: ['400px', '300px'],
                fixed: false, //不固定
                maxmin: true,
                content: ['app/sys/qxgl/mmxg.html', "no"]
            });
        }
    }
});
function openwin() {
    layer.close(warnlayeridx);
    warnhtml = "";
    let obj = warnmenuobj[0];
    layindex = layer.open({
        title: name,
        type: 2,
        area: [obj.WIDTH + 'px', obj.HEIGHT + 'px'],
        fixed: false, //不固定
        maxmin: true,
        content: [obj.URL, "no"]
    });
    if (obj.FSCREEN == "是") layer.full(layindex);
}
// 注册消息事件监听，对来自 myIframe 框架的消息进行处理
window.addEventListener('message', function (e) {
    if (e.data.act == '退办告知打印完成') {
        jQuery("iframe")[1].contentWindow.postMessage({
            act: '退办告知打印完成',
            msg: {

            }
        }, '*');
    }
    else if (e.data.act == '红/黑名单审核完成') {
        jQuery("iframe")[1].contentWindow.postMessage({
            act: '红/黑名单审核完成',
            msg: {

            }
        }, '*');
    }
    else if (e.data.act == '机构参数设置完成') {
        jQuery("iframe")[2].contentWindow.postMessage({
            act: '机构参数设置完成',
            msg: {
                answer: e.data.msg.answer
            }
        }, '*');
    }
    else if (e.data.act == '系统参数设置完成') {
        jQuery("iframe")[1].contentWindow.postMessage({
            act: '系统参数设置完成',
            msg: {
                answer: e.data.msg.answer
            }
        }, '*');
    }
    else if (e.data.act == '预警核查完毕') {
        jQuery("iframe")[1].contentWindow.postMessage({
            act: '预警核查完毕',
            msg: {
                answer: e.data.msg.answer
            }
        }, '*');
    }
    else {
        alert(e.data.act);
    }
}, false);

/*******websocket******* */


var start = function start() {
    var wsImpl = window.WebSocket || window.MozWebSocket; // create a new websocket and connect

    window.ws = new wsImpl("ws://" + window.sessionStorage.getItem("rooturl") + ":9811/default/" + window.sessionStorage.getItem('token')); // when data is comming from the server, this metod is called

    ws.onmessage = function (evt) {
        var received_msg = evt.data;
        var m = received_msg.split("@");
        if (m[0] == "Warning" && m[1] != "" && m[1] != undefined && warnmenuobj.length > 0) {
            layer.close(warnlayeridx);
            warnhtml += "<br/>&nbsp;&nbsp;&nbsp;<a href='javascript:openwin();' style='color:red;'>" + m[1] + "</a>";
            warnlayeridx = layer.open({
                type: 1,
                title: '实时预警',
                area: ['400px', '300px'],
                offset: 'rb',
                shade: 0,
                content: warnhtml,  //这里content是一个普通的String
                cancel: function (index, layero) {
                    layer.close(index)
                    warnhtml = "";
                    return false;
                }
            });
        }
    }; // when the connection is established, this method is called


    ws.onopen = function () { }; // when the connection is closed, this method is called


    ws.onclose = function () {//inc.innerHTML = '.. connection closed';
    };

    ws.onerror = function () { };
};

window.onload = start;
