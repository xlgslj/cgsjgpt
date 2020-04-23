var pagecolor = jQuery(".headtop", window.parent.document).css("background-color");
var ConfigBm = JSON.parse(window.sessionStorage.getItem("ConfigBm"));
var user = JSON.parse(window.sessionStorage.getItem("user"));
var interval, interval2;
var data = {
    customcolor: pagecolor,
    newcolor: "rgba(" + pagecolor.substring(pagecolor.indexOf("(") + 1, pagecolor.indexOf(")")) + ",0.9)",
    isck: false,
    mode: "waiting",
    //wait 未叫号,procing,办理中
    ip: "0.0.0.0",
    ckmc: "",
    ckinfo: {},
    newno: "",
    newnoxh: "",
    currno: "",
    currxh: "",
    currjhcs: 0,
    curropid: "",
    currpdxxjhqkxh: "",
    lshisnull: "",
    second: 0,
    PJYWBLSJBZXZ: ConfigBm.filter(function (item) {
        return item.KEYWORD == "PJYWBLSJBZXZ";
    })[0].V1 * 60,
    JHBFYYCS: ConfigBm.filter(function (item) {
        return item.KEYWORD == "JHBFYYCS";
    })[0].V1
    /************* */

};
var RTCPeerConnection = window.RTCPeerConnection || window.webkitRTCPeerConnection || window.mozRTCPeerConnection;
if (RTCPeerConnection) (function () {
    var rtc = new RTCPeerConnection({
        iceServers: []
    });

    if (1 || window.mozRTCPeerConnection) {
        rtc.createDataChannel('', {
            reliable: false
        });
    }

    ;

    rtc.onicecandidate = function (evt) {
        if (evt.candidate) grepSDP("a=" + evt.candidate.candidate);
    };

    rtc.createOffer(function (offerDesc) {
        grepSDP(offerDesc.sdp);
        rtc.setLocalDescription(offerDesc);
    }, function (e) {
        console.warn("offer failed", e);
    });
    var addrs = Object.create(null);
    addrs["0.0.0.0"] = false;

    function updateDisplay(newAddr) {
        if (newAddr in addrs) return; else addrs[newAddr] = true;
        var displayAddrs = Object.keys(addrs).filter(function (k) {
            return addrs[k];
        });

        for (var i = 0; i < displayAddrs.length; i++) {
            if (displayAddrs[i].length > 16) {
                displayAddrs.splice(i, 1);
                i--;
            }
        }

        console.log(displayAddrs[0]); //打印出内网ip

        data.ip = displayAddrs[0];
    }

    function grepSDP(sdp) {
        var hosts = [];
        sdp.split('\r\n').forEach(function (line, index, arr) {
            if (~line.indexOf("a=candidate")) {
                var parts = line.split(' '),
                    addr = parts[4],
                    type = parts[7];
                if (type === 'host') updateDisplay(addr);
            } else if (~line.indexOf("c=")) {
                var parts = line.split(' '),
                    addr = parts[2];
                updateDisplay(addr);
            }
        });
    }
})(); else {
    // console.log("请使用主流浏览器：chrome,firefox,opera,safari");
    try {
        data.ip = getieip();
    }
    catch (e) {
    }
}

/************************ */
// 基于准备好的dom，初始化echarts实例

var myChart = echarts.init(document.getElementById('main'), 'uimaker'); // 指定图表的配置项和数据

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
    color: ['#63869e', '#0092a8', '#d04626', '#3b3f4e'],
    tooltip: {
        trigger: 'item',
        textStyle: {
            fontSize: 14
        },
        axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'

        }
    },
    grid: {
        x: 60,
        x2: 40,
        y: 10,
        height: 400
    },
    calculable: true,
    xAxis: [{
        type: 'category',
        data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月'],
        axisLabel: {
            interval: 0,
            rotate: 40
        }
    }],
    yAxis: [{
        type: 'value'
    }],
    series: [{
        name: '直接访问',
        type: 'bar',
        data: [320, 332, 301, 334, 390, 330, 320]
    }, {
        name: '邮件营销',
        type: 'bar',
        stack: '广告',
        data: [120, 132, 101, 134, 90, 230, 210]
    }, {
        name: '联盟广告',
        type: 'bar',
        stack: '广告',
        data: [220, 182, 191, 234, 290, 330, 310]
    }, {
        name: '视频广告',
        type: 'bar',
        stack: '广告',
        data: [150, 232, 201, 154, 190, 330, 410]
    }, {
        name: '搜索引擎',
        type: 'bar',
        data: [862, 1018, 964, 1026, 1679, 1600, 1570],
        markLine: {
            itemStyle: {
                normal: {
                    lineStyle: {
                        type: 'dashed'
                    }
                }
            },
            data: [[{
                type: 'min'
            }, {
                type: 'max'
            }]]
        }
    }, {
        name: '百度',
        type: 'bar',
        barWidth: 5,
        stack: '搜索引擎',
        data: [620, 732, 701, 734, 1090, 1130, 1120]
    }, {
        name: '谷歌',
        type: 'bar',
        stack: '搜索引擎',
        data: [120, 132, 101, 134, 290, 230, 220]
    }, {
        name: '必应',
        type: 'bar',
        stack: '搜索引擎',
        data: [60, 72, 71, 74, 190, 130, 110]
    }, {
        name: '其他',
        type: 'bar',
        stack: '搜索引擎',
        data: [62, 82, 91, 84, 109, 110, 120]
    }]
}; // 使用刚指定的配置项和数据显示图表。
//myChart2.setOption(option2);
//myChart3.setOption(option2);

GetCkProcCount();

function GetCkProcCount() {
    jQuery.ajax({
        async: true,
        type: "get",
        contentType: "application/json",
        url: "/api/DtData/CkProcCount",
        headers: {
            'Authorization': window.sessionStorage.getItem('token')
        },
        data: {
            dwno: user.DWNO
        },
        success: function success(res) {
            option.xAxis[0].data = res.xAxis;
            option.series = res.series;
            myChart.setOption(option); //console.log(option)
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
            else { alert('错误:' + ret.Message) } try { layer.close(index); } catch (e) { } try { layer.close(index); } catch (e) { }
            return;
        }
    });
}
/*******************/

var vm = new Vue({
    el: "#root",
    data: data,
    mounted: function mounted() {
        isck(this.ip);
        isexittask();
    },
    computed: {
        worktime: function worktime() {
            return formatSeconds(this.second);
        }
    },
    methods: {
        reLed: function () {
            reled1();
        },
        stopLed: function () {
            stopled1();
        },
        btnjh: function btnjh() {
            //询问框
            layer.confirm('确定呼叫第' + this.newno + '号？', {
                btn: ['确定', '放弃'] //按钮

            }, function (index) {
                jh(data.newnoxh, data.newno, data.ckmc);
                layer.close(index);
            }, function () {
                return;
            });
        },
        btnth: function btnth() {
            layer.prompt({
                title: '输入特呼号码，并确认',
                formType: 0
            }, function (value, index) {
                th(value, data.ckmc);
                layer.close(index);
            });
        },
        btnbj: function btnbj() {
            var html = "<span id='bjinfo'>"
                + "<span style='display:block;margin:10px;'>业务系统流水号:</span>"
                + "<span style='display:block;margin:10px;'><input name='lsh' type='text' class='forminput inputstyle' placeholder='例：2190717033049' style='width:90%'></span>"
                + "<span style='display:block;margin:10px;'>是否制作牌证:</span>"
                + "<span style='display:block;margin:10px;'><input type='radio' value='否'  name='pzzz'  style='margin:10px;'>否<input type='radio' value='是' name='pzzz' style='margin:10px;'>是</span>"
                + "</span>";
            layer.open({
                type: 1,
                title: '办结',
                btn: ['确定'],
                area: ['400px', '300px'],
                content: data.lshisnull === "是" ? "" :html,
                yes: function (index) {
                    if (data.lshisnull === "是") {
                        end(data.currxh, data.curropid, data.currpdxxjhqkxh, "办结", "办结", lsh, data.second, sfzzpz);
                        layer.close(index);
                    }
                    else {
                        var lsh = jQuery("#bjinfo input[name=lsh]").val().trim();
                        var sfzzpz = jQuery("#bjinfo input[name=pzzz]:checked").val();
                        let msg = "";
                        if (!(lsh.length == 13 && lsh)) msg += "必须输入13位流水号<br/>";
                        if (!sfzzpz) {
                            msg += "请选择是否制作牌证";
                        }
                        if (msg.length > 0) {
                            layer.alert(msg, {
                                icon: 2
                            });
                        }
                        else {

                            end(data.currxh, data.curropid, data.currpdxxjhqkxh, "办结", "办结", lsh, data.second, sfzzpz);
                            layer.close(index);
                        }
                    }
                }
            });
        },
        btnkh: function btnkh() {
            //询问框
            layer.confirm('确定空号吗？', {
                btn: ['确定', '放弃'] //按钮

            }, function (index) {
                end(data.currxh, data.curropid, data.currpdxxjhqkxh, "空号", "空号", "", data.second, "");
                layer.close(index);
            }, function () {
                return;
            });
        },
        btntuih: function btntuih() {
            //询问框
            var xh = data.currxh;
            layer.confirm('请选择打印告知书类别？', {
                area: ['450px', '200px'],
                btn: ['打印机动车登记/业务告知书', '打印机动车驾驶证业务告知书'] //按钮

            }, function (index) {
                window.parent.layindex2 = window.parent.layer.open({
                    title: "详细信息",
                    type: 2,
                    area: [parent.window.innerWidth >= 1000 ? "1000px" : "90%", parent.window.innerHeight >= 900 ? "900px" : "90%"],
                    fixed: false,
                    //不固定
                    maxmin: true,
                    content: ["app/dtgl/ywbl/pdjh-jdcywgzs.html?xh=" + xh, (parent.window.innerWidth >= 1000 && parent.window.innerHeight >= 900 ? "no" : "yes")]
                });
                layer.close(index);
            }, function (index) {
                window.parent.layindex2 = window.parent.layer.open({
                    title: "详细信息",
                    type: 2,
                    area: [parent.window.innerWidth >= 1000 ? "1000px" : "90%", parent.window.innerHeight >= 800 ? "800px" : "90%"],
                    fixed: false,
                    //不固定
                    maxmin: true,
                    content: ["app/dtgl/ywbl/pdjh-jszywgzs.html?xh=" + xh, (parent.window.innerWidth >= 1000 && parent.window.innerHeight >= 800 ? "no" : "yes")]
                });
                layer.close(index);
                return;
            });
        }
    },
    watch: {
        ip: function ip(newip) {
            isck(newip);
        },
        mode: function mode(nv) {
            data1.mode = nv;

            if (nv == "waiting") {
                if (interval2) clearInterval(interval2); //停止

                jQuery("#main").show();
            } else if (nv == "procing") {
                interval2 = setInterval(time, 1000);
                jQuery("#main").hide();
            }
        },
        currxh: function currxh(nv) {
            data1.currxh = nv;

        }
    }
});

function isck(ip) {
    // var index = layer.load(0, { shade: [0.1, "#FFFFFF"] });
    jQuery.ajax({
        async: true,
        type: "get",
        contentType: "application/json",
        url: "/api/SysCsCkset/IsCk",
        headers: {
            'Authorization': window.sessionStorage.getItem('token')
        },
        data: {
            ip: ip
        },
        success: function success(res) {
            if (res.Msg != "0") {
                var newnoinfo = JSON.parse(res.Msg);
                data.isck = true;
                data.newno = newnoinfo.pdhm;
                data.newnoxh = newnoinfo.xh;
                data.ckmc = res.memo1.CKMC;
                data.ckinfo = res.memo1;

                /*if (!interval) {
                    interval = setInterval(isck, 1000,ip)
                }*/
            } //layer.close(index);

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
            else { alert('错误:' + ret.Message) } try { layer.close(index); } catch (e) { } try { layer.close(index); } catch (e) { }

        }
    });
}
//重发语音
function reled1() {
    var index = layer.load(0, { shade: [0.1, "#FFFFFF"] });
    jQuery.ajax({
        async: true,
        type: "post",
        contentType: "application/json",
        url: "/api/DtglYwbl/ReLed/" + data.currxh,
        headers: {
            'Authorization': window.sessionStorage.getItem('token')
        },
        data: {

        },
        success: function success(res) {
            layer.close(index);
            data.currjhcs = 0;
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
            else { alert('错误:' + ret.Message) } try { layer.close(index); } catch (e) { } try { layer.close(index); } catch (e) { }
            return;
        }
    });
}
//重发语音
function stopled1() {
    var index = layer.load(0, { shade: [0.1, "#FFFFFF"] });
    jQuery.ajax({
        async: true,
        type: "post",
        contentType: "application/json",
        url: "/api/DtglYwbl/StopLed/" + data.currxh,
        headers: {
            'Authorization': window.sessionStorage.getItem('token')
        },
        data: {

        },
        success: function success(res) {
            layer.close(index);
            data.currjhcs = data.JHBFYYCS;
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
            else { alert('错误:' + ret.Message) } try { layer.close(index); } catch (e) { } try { layer.close(index); } catch (e) { }
            return;
        }
    });
}
//叫号


function jh(xh, no, ckmc) {
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
        url: "/api/DtglYwbl/Jh",
        headers: {
            'Authorization': window.sessionStorage.getItem('token')
        },
        data: JSON.stringify({
            xh: xh,
            ckmc: ckmc
        }),
        success: function success(res) {
            layer.close(index);

            if (res.Msg == "0") {
                layer.alert("此号失效", {
                    icon: 2
                });
            } else {
                data.mode = "procing";
                data.currno = no;
                data.currxh = xh;
                data.currjhcs = 0;
                data.curropid = res.Msg;
                data.currpdxxjhqkxh = res.memo1;
                data.lshisnull = res.lshisnull
            }
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
            else { alert('错误:' + ret.Message) } try { layer.close(index); } catch (e) { } try { layer.close(index); } catch (e) { }
            return;
        }
    });
}
//特呼
function th(pdhm, ckmc) {
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
        url: "/api/DtglYwbl/Th",
        headers: {
            'Authorization': window.sessionStorage.getItem('token')
        },
        data: JSON.stringify({
            pdhm: pdhm,
            ckmc: ckmc
        }),
        success: function success(res) {
            layer.close(index);

            if (res.msg != "0") {
                layer.alert(res.msg, {
                    icon: 2
                });
            } else {
                data.mode = "procing";
                data.currno = res.no;
                data.currxh = res.xh;
                data.currjhcs = 0;
                data.curropid = res.opid;
                data.currpdxxjhqkxh = res.jhxh;
                data.lshisnull = res.lshisnull
            }
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
            else { alert('错误:' + ret.Message) } try { layer.close(index); } catch (e) { } try { layer.close(index); } catch (e) { }
            return;
        }
    });
}

function end(xh, opid, jhqkxh, pdxxzt, opzt, memo, second, zzpz) {
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
        url: "/api/DtglYwbl/End",
        headers: {
            'Authorization': window.sessionStorage.getItem('token')
        },
        data: JSON.stringify({
            xh: xh,
            opid: opid,
            jhqkxh: jhqkxh,
            pdxxzt: pdxxzt,
            opzt: opzt,
            memo: memo,
            second: second,
            zzpz: zzpz
        }),
        success: function success(res) {
            layer.close(index);

            if (res.Msg == "0") {
                layer.alert("操作失败", {
                    icon: 2
                });
            } else {
                data.mode = "waiting";
                data.currno = "";
                data.currxh = "";
                data.currjhcs = 0;
                data.curropid = "";
                data.currpdxxjhqkxh = "";
                data.second = 0;
            }
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
            else { alert('错误:' + ret.Message) } try { layer.close(index); } catch (e) { } try { layer.close(index); } catch (e) { }
            return;
        }
    });
}

function time() {
    data.second++;
}
//判断是否存在未完成任务


function isexittask() {
    data.mode = "reading";
    var index = layer.load(0, {
        shade: [0.1, "#FFFFFF"]
    });
    jQuery.ajax({
        async: true,
        type: "get",
        contentType: "application/json",
        url: "/api/DtglYwbl/NoCompleteTask",
        headers: {
            'Authorization': window.sessionStorage.getItem('token')
        },
        data: {},
        success: function success(res) {
            layer.close(index);

            if (res.Msg == "1") {
                data.mode = "procing";
                data.currno = res.Data[0];
                data.currxh = res.Data[1];
                data.curropid = res.Data[2];
                data.currpdxxjhqkxh = res.Data[3];
                data.second = res.Data[4] * 1;
                data.currjhcs = res.Data[5];
                data.lshisnull = res.Data[6]

            } else {
                data.mode = "waiting";
            }
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
            else { alert('错误:' + ret.Message) } try { layer.close(index); } catch (e) { } try { layer.close(index); } catch (e) { }
            return;
        }
    });
}

/*----------------------------------------*/


var data1 = {
    statue: "querying",
    mode: data.mode,
    currxh: "",
    driverandvehicle: {
        pdxx: {},
        driver1: {},
        rblist1: {},
        vehicles1: [],
        driver2: {},
        rblist2: {},
        vehicles2: []
    }
};
var vm1 = new Vue({
    el: '#root1',
    data: data1,
    watch: {
        currxh: function currxh(nv) {
            if (nv != "") QueryVehicleAndDriver(this.currxh);
        }
    },
    methods: {
        queryDwba: function () {
            var dm = this.driverandvehicle.pdxx.BRZJHM;
            window.parent.layindex2 = window.parent.layer.open({
                title: "备案信息",
                type: 2,
                area: [parent.window.innerWidth >= 1300 ? "1300px" : "90%", parent.window.innerHeight >= 1200 ? "1200px" : "90%"],
                fixed: false, //不固定
                maxmin: true,
                content: ["app/zhgl/bagl/bainfo.html?zzjgdm=" + dm, (parent.window.innerWidth >= 1300 && parent.window.innerHeight >= 1200 ? "no" : "yes")]
            });
        }
    }
});

function QueryVehicleAndDriver(xh) {
    data1.statue = "querying";
    var index = layer.load(0, {
        shade: 0
    });
    jQuery.ajax({
        async: true,
        type: "get",
        contentType: "application/json",
        url: "/api/SysPublicMethod/QueryVehicleAndDriverForPdjh",
        headers: {
            'Authorization': window.sessionStorage.getItem('token')
        },
        data: {
            xh: xh
        },
        success: function success(res) {

            data1.driverandvehicle.pdxx = res;
            let drvandveh = JSON.parse(res.DRVANDVEHINFO);
            data1.driverandvehicle.driver1 = drvandveh.driver1;
            data1.driverandvehicle.driver2 = drvandveh.driver2;
            data1.driverandvehicle.rblist1 = drvandveh.rblist1;
            data1.driverandvehicle.rblist2 = drvandveh.rblist2;
            data1.driverandvehicle.vehicles1 = drvandveh.vehicles1;
            data1.driverandvehicle.vehicles2 = drvandveh.vehicles2;
            data1.statue = "completed";
            layer.close(index);
        }
    });
}

var data2 = {
    waitinfo: null
}
var vm2 = new Vue({
    el: '#root2',
    data: data2,
    beforeCreate: function () {
        getwaitinfo();
    }
});
function getwaitinfo() {
    jQuery.ajax({
        async: true,
        type: "get",
        contentType: "application/json",
        url: "/api/DtglYwbl/GetWaitInfo",
        headers: {
            'Authorization': window.sessionStorage.getItem('token')
        },
        data: {},
        success: function success(res) {
            data2.waitinfo = res.data;
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
            else { alert('错误:' + ret.Message) } try { layer.close(index); } catch (e) { } try { layer.close(index); } catch (e) { }
            return;
        }
    });
}

$(".tab > li").click(function () {
    $(".tab > li").removeClass("tabcurrent");
    $(this).addClass("tabcurrent");
    $(".website,.userinfo").hide();
    $("#" + $(".tab >li.tabcurrent").attr("name")).show();
});

function tab(id) {
    $(".tab > li").removeClass("tabcurrent");
    $(".tab > li[name=" + id + "]").addClass("tabcurrent");
    $(".website,.userinfo").hide();
    $("#" + id).show();
}
/**  
* 将秒数换成时分秒格式   
*/


function formatSeconds(value) {
    var theTime = parseInt(value); // 秒  

    var theTime1 = 0; // 分  

    var theTime2 = 0; // 小时  

    if (theTime > 60) {
        theTime1 = parseInt(theTime / 60);
        theTime = parseInt(theTime % 60);

        if (theTime1 > 60) {
            theTime2 = parseInt(theTime1 / 60);
            theTime1 = parseInt(theTime1 % 60);
        }
    }

    var result = "" + parseInt(theTime) + "秒";

    if (theTime1 > 0) {
        result = "" + parseInt(theTime1) + "分" + result;
    }

    if (theTime2 > 0) {
        result = "" + parseInt(theTime2) + "小时" + result;
    }

    return result;
}

function formatSeconds2(a) {
    var hh = parseInt(a / 3600);
    if (hh < 10) hh = "0" + hh;
    var mm = parseInt((a - hh * 3600) / 60);
    if (mm < 10) mm = "0" + mm;
    var ss = parseInt((a - hh * 3600) % 60);
    if (ss < 10) ss = "0" + ss;
    var length = hh + ":" + mm + ":" + ss;

    if (a > 0) {
        return length;
    } else {
        return "NaN";
    }
}

var start = function start() {
    var wsImpl = window.WebSocket || window.MozWebSocket; // create a new websocket and connect

    window.ws = new wsImpl("ws://" + window.sessionStorage.getItem("rooturl") + ":9811/default/" + window.sessionStorage.getItem('token')); // when data is comming from the server, this metod is called

    ws.onmessage = function (evt) {
        var received_msg = evt.data;
        var m = received_msg.split("@");
        if (m[0] == "DataUpdate") {
            isck(data.ip);
            GetCkProcCount();
            getwaitinfo();
        }
        if (m[0] == "Led") {
            data.currjhcs = m[1] == data.currxh ? m[2] : data.currjhcs;
        }

    }; // when the connection is established, this method is called


    ws.onopen = function () { }; // when the connection is closed, this method is called


    ws.onclose = function () {//inc.innerHTML = '.. connection closed';
    };

    ws.onerror = function () { };
};

window.onload = start; // 注册消息事件监听，对来自 myIframe 框架的消息进行处理

window.addEventListener('message', function (e) {
    if (e.data.act == '退办告知打印完成') {
        end(data.currxh, data.curropid, data.currpdxxjhqkxh, "退办", "退办", "", data.second, "");
    }
}, false);

function getieip() {//网络信息
    var locator = new ActiveXObject("WbemScripting.SWbemLocator");
    var service = locator.ConnectServer(".");
    var properties = service.ExecQuery("SELECT * FROM win32_networkadapterconfiguration");
    var e = new Enumerator(properties);
    for (; !e.atEnd(); e.moveNext()) {
        var p = e.item();
        if (p.IPAddress == null) {
            continue;
        }

        /* document.write("<tr>");
         document.write("<td>" + p.Caption + "</td>");
         document.write("<td>" + p.IPAddress(0) + "</td>");
         document.write("<td>" + p.MACAddress + "</td>");
         document.write("</tr>");*/
        //alert(p.IPAddress(0));
        return p.IPAddress(0);
    }

}


