// 基于准备好的dom，初始化echarts实例
var myChart = echarts.init(document.getElementById('main')); // 指定图表的配置项和数据
var CVR_IDCard;
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
    lshisnull: '',
    bllx: "本人业务",
    zjlx: zjlx,
    zjlx1: zjlx,
    name: "",
    name1: "",
    zjhm: "",
    zjhm1: "",
    dbcs: 0,
    idcard: null,
    field: null,
    showloadgif: false
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
        data.lshisnull = res.Data[0].LSHISNULL
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
                var br = (this.bllx == "本人业务" && (((this.name == null || this.name == undefined || this.name.trim() == "") && this.zjlx == "居民身份证") ? false : true) && (this.zjlx != "居民身份证" && (this.zjhm == null ? false : this.zjhm.trim() != "") || this.zjlx == "居民身份证" && this.zjhm.length == 18));
                var dlr = (this.bllx == "代理人业务" && (((this.name == null || this.name == undefined || this.name.trim() == "") && this.zjlx == "居民身份证") ? false : true) && (this.name1 == null ? false : this.name1.trim() != "") && (this.zjlx != "居民身份证" && (this.zjhm == null ? false : this.zjhm.trim() != "") || this.zjlx == "居民身份证" && this.zjhm.length == 18) && (this.zjlx1 != "居民身份证" && (this.zjhm1 == null ? false : this.zjhm1.trim() != "") || this.zjlx1 == "居民身份证" && this.zjhm1.length == 18));
                //alert(br);
                //alert(((this.name == null && this.zjlx == "居民身份证") ? false : true));
                return br || dlr;
                //return (this.bllx == "本人业务" && (this.name == null ? false : this.name.trim() != "") && (this.zjlx != "居民身份证" && (this.zjhm == null ? false : this.zjhm.trim() != "") || this.zjlx == "居民身份证" && this.zjhm.length == 18)) || (this.bllx == "代理人业务" && (this.name == null ? false : this.name.trim() != "") && (this.name1 == null ? false : this.name1.trim() != "") && (this.zjlx != "居民身份证" && (this.zjhm == null ? false : this.zjhm.trim() != "") || this.zjlx == "居民身份证" && this.zjhm.length == 18) && (this.zjlx1 != "居民身份证" && (this.zjhm1 == null ? false : this.zjhm1.trim() != "") || this.zjlx1 == "居民身份证" && this.zjhm1.length == 18));

            },
            zjhmComputed: {
                get: function () {
                    return this.zjhm;
                },
                set: function (val) {
                    this.zjhm = val.toUpperCase();
                }
            },
            zjhm1Computed: {
                get: function () {
                    return this.zjhm1;
                },
                set: function (val) {
                    this.zjhm1 = val.toUpperCase();
                }
            }
        },
        watch: {
            zjhm1: function (v) {
                /*if (this.zjlx1 == "居民身份证" && this.zjhm1.length == 18) {
                    getAgents(this.zjhm1);
                }*/
                getAgents(this.zjhm1);
            },
            bllx: function bllx(newv, oldv) {
                this.dbcs = 0;
                if (newv == "本人业务") this.zjhm1 = "";
            },
            ywlx: function ywlx(newv, oldv) {
                this.code = this.ywlxs.filter(function (item) {
                    return item.NAME == newv;
                })[0].CODE;
                this.lshisnull = this.ywlxs.filter(function (item) {
                    return item.NAME == newv;
                })[0].LSHISNULL;

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
                var obj = _readidcard(field);

            }
        }
    });
}
function getAgents(zjhm) {
    /*post方法,方便后端以dynamic类获取数据,
    * 1-contentType:"application/json",
    * 2-data必须stringify*/
    data.showloadgif = true;
    jQuery.ajax({
        async: true,
        type: "get",
        contentType: "application/json",
        url: "/api/HmdglRyhmd/GetPersonAgents",
        headers: {
            'Authorization': window.sessionStorage.getItem('token')
        },
        data: {
            zjhm: zjhm
        },
        success: function success(res) {
            data.dbcs = res.data
            data.showloadgif = false;
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
            data.ywlx = data.ywlxs[0].NAME;
            data.bllx = "本人业务";
            data.dbcs = 0;
            layer.close(index);
            var l1 = layer.msg('正在打印...', {
                icon: 10
                , shade: 0.01
            });
            CreatePrintPage(res);
            layer.close(l1);
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
function _readidcard(lx) {
    var isIE = (navigator.userAgent.indexOf('MSIE') >= 0) || (navigator.userAgent.indexOf('Trident') >= 0);
    if (!isIE) {
        strHtml = "<br><font color='#FF00FF'>此页面需使用IE浏览器</font>";
        document.body.innerHTML = strHtml;
        return;
    }
    CVR_IDCard = document.getElementById("CVR_IDCard");
    var ret;
    try {
        ret = CVR_IDCard.ReadCard();
        if (ret != "0") {
            top.layer.alert("读取失败，原因" + ret + "!", { icon: 2 });
            return;
        }
        var name = CVR_IDCard.Name;
        var sex = CVR_IDCard.Sex;
        var cardid = CVR_IDCard.CardNo;
        if (lx == 1) {
            data.name = name;
            data.zjhm = cardid;
        }
        else if (lx == 2) {
            data.name1 = name;
            data.zjhm1 = cardid;
        }

    }
    catch (e) {
        strHtml = "<br><font color='#FF00FF'>二代证读卡器未安装!请按以下步骤安装:</br>1、点击这里<a href='../../../js/idcard/ftdi_ft232_drive.exe' target='_self'>执行USB驱动安装；</a></br>2、点击这里<a href='../../../js/idcard/HxgcIDReader.exe' target='_self'>执行读卡器IE控件驱动安装；</a></br>3、安装后请刷新页面或重新进入。</font>";
        document.body.innerHTML = strHtml;
        return;

    }
}
function CreatePrintPage(res) {
    let px = res.pdxx;
    let waits = res.waits;
    let qhsj = res.qhsj;
    LODOP = getLodop();
	LODOP.PRINT_INITA(0,0,"74.98mm","74.98mm","机动车登记/业务告知书");
	LODOP.SET_PRINT_PAGESIZE(1,750,750,"");
	LODOP.ADD_PRINT_TEXT(28,39,215,47,"排 号 单");
	LODOP.SET_PRINT_STYLEA(0,"FontName","黑体");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",32);
	LODOP.SET_PRINT_STYLEA(0,"Bold",1);
	LODOP.ADD_PRINT_TEXT(3,71,141,20,"攀枝花市车管所欢迎您！");
	LODOP.ADD_PRINT_TEXT(89,7,143,17,"业务类型：" + px.YWLXMC);
	LODOP.SET_PRINT_STYLEA(0,"FontSize",10);
	LODOP.ADD_PRINT_TEXT(115,73,82,36,px.PDHM);
	LODOP.SET_PRINT_STYLEA(0,"FontSize",25);
	LODOP.SET_PRINT_STYLEA(0,"Bold",1);
	LODOP.ADD_PRINT_TEXT(159,9,184,21,"排号时间：" +qhsj);
	LODOP.ADD_PRINT_TEXT(228,8,270,20,"叫号信息和语音叫号信息，按照叫号信息及时到");
	LODOP.ADD_PRINT_TEXT(210,8,80,20,"温馨提示：");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",10);
	LODOP.SET_PRINT_STYLEA(0,"Bold",1);
	LODOP.ADD_PRINT_TEXT(210,78,191,20,"领取排号单后，请注意大屏幕上的");
	LODOP.ADD_PRINT_TEXT(184,8,70,20,"您前面还有");
	LODOP.ADD_PRINT_TEXT(173,80,50,31,waits);
	LODOP.SET_PRINT_STYLEA(0,"FontSize",24);
	LODOP.SET_PRINT_STYLEA(0,"Bold",1);
	LODOP.ADD_PRINT_TEXT(184,123,145,20,"人未办理，请耐心等候。");
	LODOP.ADD_PRINT_TEXT(125,8,70,20,"排队号码：");
	LODOP.ADD_PRINT_TEXT(248,8,117,20,"对应窗口办理业务。");
	LODOP.ADD_PRINT_TEXT(242,118,19,24,"3");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",19);
	LODOP.SET_PRINT_STYLEA(0,"Bold",1);
	LODOP.ADD_PRINT_TEXT(248,134,141,20,"次叫号后仍未到窗口办理");
	LODOP.ADD_PRINT_TEXT(267,8,275,20,"的，将视为过号，需重新到值日警官处排号办理。");

    LODOP.PRINT(); // LODOP.PREVIEW();
    //LODOP.PRINT_DESIGN();
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
