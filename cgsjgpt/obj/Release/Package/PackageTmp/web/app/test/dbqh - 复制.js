// 基于准备好的dom，初始化echarts实例
var myChart = echarts.init(document.getElementById('main')); // 指定图表的配置项和数据

var labelOption = {
    show: true,
    position: 'insideBottom',
    distance: 15,
    align: 'insideBottom',
    verticalAlign: 'middle',
    rotate: 90,
    formatter: '{c}  {name|{a}}',
    fontSize: 16,
    rich: {
        name: {
            textBorderColor: '#fff'
        }
    }
};
var option = {
    //color: [ '#1065a7', '#0092a8', '#d04626', '#c12c20'],
    color: ['#c12c20', '#2a5699', '#435a69', '#227447', '#1065a7', '#0092a8', '#d04626', '#3b3f4e'],
    title: {
        text: ''
    },
    tooltip: {},
    legend: {// data: ['销量','销量1','销量2']
    },
    grid: {
        left: '5%',
        right: '2%',
        bottom: '2%'
    },
    xAxis: {
        data: ["等候数量"]
    },
    yAxis: {},
    series: [
        /*{
        name: '销量',
        type: 'bar',
        data: [5]
        },
        {
        name: '销量1',
        type: 'bar',
        data: [5]
        },
        {
        name: '销量2',
        type: 'bar',
        data: [5]
        }*/
    ]
}; // 使用刚指定的配置项和数据显示图表。

myChart.setOption(option);
GetData();

function GetData() {
    /*post方法,方便后端以dynamic类获取数据,
     * 1-contentType:"application/json",
     * 2-data必须stringify*/
    jQuery.ajax({
        async: true,
        type: "get",
        contentType: "application/json",
        url: "/api/DtglYwbl/GetPdInfo",
        headers: {
            'Authorization': window.sessionStorage.getItem('token')
        },
        data: {},
        success: function success(res) {
            for (var i in res.series) {
                Object.assign(res.series[i], {
                    label: labelOption
                });
            } // 填入数据


            myChart.setOption({
                legend: {
                    data: res.legend
                },
                series: res.series
            });
        },
        error: function error(res) {
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
/*-----------Vue-------------*/


var AppData = JSON.parse(window.sessionStorage.getItem("AppData"));
var zjlx = AppData.Zjlx[0];
var data = {
    ywlxs: [],
    bllxs: ["本人业务", "代理人业务"],
    zjlxs: AppData.Zjlx,
    ywlx: "",
    code: "",
    bllx: "本人业务",
    zjlx: zjlx,
    zjlx1: zjlx,
    name: "111",
    name1: "",
    zjhm: "",
    zjhm1: "",
    idcard: null,
    field: null,
};
jQuery.ajax({
    async: true,
    type: "get",
    contentType: "application/json",
    url: "/api/DtglYwbl/GetYwlx",
    headers: {
        'Authorization': window.sessionStorage.getItem('token')
    },
    data: {},
    success: function success(res) {
        data.ywlxs = res.Data;
        data.ywlx = res.Data[0].NAME;
        data.code = res.Data[0].CODE;
        VueInit();
    },
    error: function error(res) {
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

function VueInit() {
    var vm = new Vue({
        el: "#app",
        data: data,
        computed: {
            showdlr: function showdlr() {
                return this.bllx == "代理人业务";
            },
            allowsubmit: function allowsubmit() {
                return (this.bllx == "本人业务" && (this.name == null ? false : this.name.trim() != "") && (this.zjlx != "居民身份证" && (this.zjhm == null ? false : this.zjhm.trim() != "") || this.zjlx == "居民身份证" && this.zjhm.length == 18)) || (this.bllx == "代理人业务" && (this.name == null ? false : this.name.trim() != "") && (this.name1 == null ? false : this.name1.trim() != "") && (this.zjlx != "居民身份证" && (this.zjhm == null ? false : this.zjhm.trim() != "") || this.zjlx == "居民身份证" && this.zjhm.length == 18) && (this.zjlx1 != "居民身份证" && (this.zjhm1 == null ? false : this.zjhm1.trim() != "") || this.zjlx1 == "居民身份证" && this.zjhm1.length == 18));

            }
        },
        watch: {
            bllx: function bllx(newv, oldv) {
                if (newv == "本人业务") this.zjhm1 = "";
            },
            ywlx: function ywlx(newv, oldv) {
                this.code = this.ywlxs.filter(function (item) {
                    return item.NAME == newv;
                })[0].CODE;
            },
            idcard: function idcard(nv, oldv) {
                if (nv.msg == 1) {
                    data[this.field] = nv.sfid;
                }
                else {
                    var msg = "读取身份信息失败，原因可能如下：</br>1、设备问题；</br>2、身份证需要翻面；";
                    layer.alert(msg, { icon: 2 })
                }
                console.log(1);
                this.idcard = null; JSON.parse(JSON.stringify("{}"));
            },
            zjlx: function () {
                this.name = "";
                this.zjhm = "";
            },
            zjlx1: function () {
                this.name1 = "";
                this.zjhm1 = "";
            }
        },
        methods: {
            save: function save() {
                _save();
            },
            readidcard: function (field) {
                this.field = field;
                var obj = _readidcard();

            }
        }
    });
}

function _save() {
    var index = layer.load(0, {
        shade: [0.1, "#FFFFFF"]
    });
    /*post方法,方便后端以dynamic类获取数据,
    * 1-contentType:"application/json",
    * 2-data必须stringify*/

    jQuery.ajax({
        async: true,
        type: "post",
        contentType: "application/json",
        url: "/api/DtglYwbl/Qh",
        headers: {
            'Authorization': window.sessionStorage.getItem('token')
        },
        data: JSON.stringify(data),
        success: function success(res) {
            data.zjhm = "";
            data.zjhm1 = "";
            data.name = "";
            data.name1 = "";
            layer.close(index);
        },
        error: function error(res) {
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
var g_iPort;
function _readidcard() {
    var index = layer.load(0, {
        shade: [0.1, "#FFFFFF"]
    });
    var ret;
    setTimeout(function () {
        g_iPort = getport();
        var iResult;
        var info = { msg: 0 };
        iResult = objActiveX.hxgc_OpenReader(g_iPort); //打开设备

        if (iResult != 0) {
            alert("打开设备失败，错误代码：" + iResult + ".");
        }
        else {
            iResult = objActiveX.hxgc_ReadIDCard(g_iPort); //读二代证

            if (iResult == 0) {
                info["msg"] = 1;
                info["name"] = objActiveX.hxgc_GetName();   //姓名           
                info["sfid"] = objActiveX.hxgc_GetIDCode();            //身份证号      

            }
            iResult = objActiveX.hxgc_CloseReader(g_iPort); //关闭设备
        }
        layer.close(index);
        data.idcard = info;
        // return info;
    }, 100);

}
function getport() {
    var isIE = (navigator.userAgent.indexOf('MSIE') >= 0) || (navigator.userAgent.indexOf('Trident') >= 0);
    if (!isIE) {
        strHtml = "<br><font color='#FF00FF'>此页面需使用IE浏览器</font>";
        document.body.innerHTML = strHtml;
        return;
    }
    var port = "";
    var zt = "";
    var mid = "";
    if (isIE) {
        try {
            port = _loadStorage("g_iPort");
            if (port == null) {
                return scan_port();
            }
            zt = objActiveX.hxgc_OpenReader(port);
            if (zt == "0") {
                mid = objActiveX.hxgc_GetSamIdToStr(port); //获取SAMID
                objActiveX.hxgc_CloseReader(port);
                if (mid != "") {
                    return port;
                }
                else {
                    return scan_port();
                }
            }
            else {
                return scan_port();
            }
        }
        catch (e) {
            strHtml = "<br><font color='#FF00FF'>二代证读卡器未安装!请按以下步骤安装:</br>1、点击这里<a href='../../../js/idcard/ftdi_ft232_drive.exe' target='_self'>执行USB驱动安装；</a></br>2、点击这里<a href='../../../js/idcard/HxgcIDReader.exe' target='_self'>执行读卡器IE控件驱动安装；</a></br>3、安装后请刷新页面或重新进入。</font>";
            document.body.innerHTML = strHtml;
            return;
        }
    }

}
function scan_port() {
    var zt, mid;
    for (var i = 1; i <= 16; i++) {
        try {
            zt = objActiveX.hxgc_OpenReader(i);
            if (zt == "0") {
                mid = objActiveX.hxgc_GetSamIdToStr(i); //获取SAMID
                objActiveX.hxgc_CloseReader(i); //关闭设备
                if (mid != "") {

                    _saveStorage("g_iPort", i);
                    return i;
                }

            }


        }
        catch (e) {
            strHtml = "<br><font color='#FF00FF'>二代证读卡器未安装!请按以下步骤安装:</br>1、点击这里<a href='../../../js/idcard/ftdi_ft232_drive.exe' target='_self'>执行USB驱动安装；</a></br>2、点击这里<a href='../../../js/idcard/HxgcIDReader.exe' target='_self'>执行读卡器IE控件驱动安装；</a></br>3、安装后请刷新页面或重新进入。</font>";
            document.body.innerHTML = strHtml;
            return;
        }
    }
    for (var i = 1001; i <= 1016; i++) {
        try {
            //alert(i);
            zt = objActiveX.hxgc_OpenReader(i);
            if (zt == "0") {
                mid = objActiveX.hxgc_GetSamIdToStr(i); //获取SAMID
                objActiveX.hxgc_CloseReader(i); //关闭设备
                if (mid != "") {
                    _saveStorage("g_iPort", i);
                    return i;
                }
                //break;
            }
        }
        catch (e) {
            strHtml = "<br><font color='#FF00FF'>二代证读卡器未安装!请按以下步骤安装:</br>1、点击这里<a href='../../../js/idcard/ftdi_ft232_drive.exe' target='_self'>执行USB驱动安装；</a></br>2、点击这里<a href='../../../js/idcard/HxgcIDReader.exe' target='_self'>执行读卡器IE控件驱动安装；</a></br>3、安装后请刷新页面或重新进入。</font>";
            document.body.innerHTML = strHtml;
            return;
        }
    }

}
/*
 * html5获取本地存储
 */
function _loadStorage(attr) {
    var str = localStorage.getItem(attr);
    return str;
}
/*
 * HTML5本地存储 
 */
function _saveStorage(key, value) {
    var self = this;
    localStorage.setItem(key, value);
}
var start = function start() {
    var wsImpl = window.WebSocket || window.MozWebSocket; // create a new websocket and connect

    window.ws = new wsImpl("ws://" + window.sessionStorage.getItem("rooturl") + ":9811/default/" + window.sessionStorage.getItem('token')); // when data is comming from the server, this metod is called

    ws.onmessage = function (evt) {
        var received_msg = evt.data;

        if (received_msg == "DataUpdate") {
            GetData();
        }
    }; // when the connection is established, this method is called


    ws.onopen = function () { }; // when the connection is closed, this method is called


    ws.onclose = function () {//inc.innerHTML = '.. connection closed';
    };

    ws.onerror = function () { };
};

window.onload = start;
