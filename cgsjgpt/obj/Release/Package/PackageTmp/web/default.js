if (screen.height < 1080) {

    jQuery("*").css("font-size", "13px");

}
var ConfigBm = JSON.parse(window.sessionStorage.getItem("ConfigBm"));
var user = JSON.parse(window.sessionStorage.getItem("user"));
var DDYWBLRSBZXZ, PJYWBLSJBZXZ;

try {
    PJYWBLSJBZXZ = ConfigBm.filter(function (item) {
        return item.KEYWORD == "PJYWBLSJBZXZ";
    })[0].V1;
    DDYWBLRSBZXZ = ConfigBm.filter(function (item) {
        return item.KEYWORD == "DDYWBLRSBZXZ";
    })[0].V1;
} catch (e) {
    console.log("localread");
    ConfigBm = JSON.parse(window.localStorage.getItem('ConfigBm'));
    PJYWBLSJBZXZ = ConfigBm.filter(function (item) {
        return item.KEYWORD == "PJYWBLSJBZXZ";
    })[0].V1;
    DDYWBLRSBZXZ = ConfigBm.filter(function (item) {
        return item.KEYWORD == "DDYWBLRSBZXZ";
    })[0].V1;
}

var data1 = {
    icon: ['&#xe6da;', '&#xe648;', '&#xe619;', '&#xe6c9;', '&#xe624;', '&#xe6bf;'],
    ywlxgroup: []
};
var vm1 = new Vue({
    el: '#app1',
    data: data1,
    methods: {
        formattime: function formattime(v) {
            return formatSeconds(v);
        }
    }
});
/*--------------------------大厅实时等候人数-------------------------------*/
// 基于准备好的dom，初始化echarts实例

var myChart = echarts.init(document.getElementById('chart1')); // 指定图表的配置项和数据

var option1 = {
    tooltip: {
        formatter: "{a} <br/>{b} : {c}"
    },
    series: [{
        name: '业务大厅',
        type: 'gauge',
        "center": ["50%", "50%"],
        radius: '100%',
        detail: {
            formatter: '{value}',
            textStyle: {
                fontSize: 20
            }
        },
        axisLine: {
            // 坐标轴线  
            lineStyle: {
                // 属性lineStyle控制线条样式  
                color: [[DDYWBLRSBZXZ / 200, '#91c7ae'], [DDYWBLRSBZXZ / 100, '#63869e'], [1, '#c23531']]
            }
        },
        data: [{
            value: 50,
            name: '人数'
        }]
    }]
};
getwaitcount();

function getwaitcount() {
    jQuery.ajax({
        async: true,
        type: "get",
        contentType: "application/json",
        url: "/api/DtData/GetWaitCount",
        headers: {
            'Authorization': window.sessionStorage.getItem('token')
        },
        data: {
            dwno: user.DWNO
        },
        success: function success(res) {
            option1.series[0].data[0].value = res;
            myChart.setOption(option1, true);
        },
        error: function error(res) {
            option1.series[0].data[0].value = 100;
            myChart.setOption(option1, true);
        }
    });
}
/***********各时段等候处理量 */
// 基于准备好的dom，初始化echarts实例


var myChart1 = echarts.init(document.getElementById('chart2'), 'uimaker'); // 指定图表的配置项和数据

var option = {
    color: ['#c23531', '#91c7ae'],
    tooltip: {
        formatter: "{a}  : {c}"
    },
    legend: {
        data: ['等候量', '处理量']
    },
    calculable: true,
    xAxis: [{
        type: 'category',
        boundaryGap: false,
        data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
    }],
    grid: {
        x: 60,
        x2: 40,
        y: 10,
        height: 140
    },
    yAxis: [{
        type: 'value'
    }],
    series: [{
        name: '等候量',
        type: 'line',
        smooth: true,
        itemStyle: {
            normal: {
                areaStyle: {
                    type: 'default'
                }
            }
        },
        data: [500, 12, 21, 54, 260, 830, 710]
    }, {
        name: '处理量',
        type: 'line',
        smooth: true,
        itemStyle: {
            normal: {
                areaStyle: {
                    type: 'default'
                }
            }
        },
        data: [30, 182, 434, 791, 390, 30, 10]
    }]
}; // 使用刚指定的配置项和数据显示图表。

WaitAndProcCount();

function WaitAndProcCount() {
    jQuery.ajax({
        async: true,
        type: "get",
        contentType: "application/json",
        url: "/api/DtData/WaitAndProcCount",
        headers: {
            'Authorization': window.sessionStorage.getItem('token')
        },
        data: {
            dwno: user.DWNO
        },
        success: function success(res) {
            option.xAxis[0].data = res.xAxis;
            option.series[0].data = res.series[0].data;
            option.series[1].data = res.series[1].data;
            myChart1.setOption(option); //console.log(option)
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
           // layer.close(index);
            return;
        }
    });
} // 基于准备好的dom，初始化echarts实例


var myChart2 = echarts.init(document.getElementById('chart3'), 'uimaker'); // 指定图表的配置项和数据
// 指定图表的配置项和数据

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
option2 = {
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
        height: 140
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
            option2.xAxis[0].data = res.xAxis;
            option2.series = res.series;
            myChart2.setOption(option2); //console.log(option)
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
            //layer.close(index);
            return;
        }
    });
}

window.addEventListener("resize", function () {
    myChart.resize();
    myChart1.resize();
    myChart2.resize();
});
/*********Vue********* */

var data = {
    icon: ['&#xe6da;', '&#xe648;', '&#xe619;', '&#xe6c9;', '&#xe624;', '&#xe6bf;'],
    PJYWBLSJBZXZ: PJYWBLSJBZXZ * 60,
    second: 0,
    second1: 0,
    ywlxgroup: [],
    procdata: [],
    warndata: [],
    rightAndBottom:null
};
var vm = new Vue({
    el: '#app',
    data: data,
    computed: {
        ywhzsj: function () {
            let d = {
                zs: 0,
                cs:0
            }
            if (this.rightAndBottom != null) {
                this.rightAndBottom.forEach(function (item) {
                    d.zs += item.zs;
                    d.cs += item.blcsrs;
                })
            }
            return d;
        }
    },
    methods: {
        formattime: function formattime(v) {
            return formatSeconds(v);
        }
    }
});
setInterval(function () {
    data.second++;
}, 1000);
GetYwlxGroup();

function GetYwlxGroup() {
    jQuery.ajax({
        async: true,
        type: "get",
        contentType: "application/json",
        url: "/api/DtData/GetYwlxGroup",
        headers: {
            'Authorization': window.sessionStorage.getItem('token')
        },
        data: {
            dwno: user.DWNO
        },
        success: function success(res) {
            data1.ywlxgroup = JSON.parse(res);
            data1.ywlxgroup.forEach(function (item, index) {
                data1.ywlxgroup[index] = JSON.parse(item);
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
            
            return;
        }
    });
}

GetListData();

function GetListData() {
    jQuery.ajax({
        async: true,
        type: "get",
        contentType: "application/json",
        url: "/api/DtData/GetListDataToDefault",
        headers: {
            'Authorization': window.sessionStorage.getItem('token')
        },
        data: {
            dwno: user.DWNO
        },
        success: function success(res) {
            data.procdata = res.Data;
            data.second = 0;
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
           // layer.close(index);
            return;
        }
    });
}

QueryWarn();

function QueryWarn() {
    jQuery.ajax({
        async: true,
        type: "get",
        contentType: "application/json",
        url: "/api/DtData/CheckWarn",
        headers: {
            'Authorization': window.sessionStorage.getItem('token')
        },
        data: {
            dwno: user.DWNO
        },
        success: function success(res) {
            data.warndata = res.Data;
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
            //layer.close(index);
            return;
        }
    });
}
function getRightAndBottom() {
    jQuery.ajax({
        async: true,
        type: "get",
        contentType: "application/json",
        url: "/api/DtData/ywblTj1",
        headers: {
            'Authorization': window.sessionStorage.getItem('token')
        },
        data: {
            dwno: user.DWNO
        },
        success: function success(res) {
            data.rightAndBottom = res.data;
          
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
            //layer.close(index);
            return;
        }
    });
}
getRightAndBottom();
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
/*******websocket******* */


var start = function start() {
    var wsImpl = window.WebSocket || window.MozWebSocket; // create a new websocket and connect

    window.ws = new wsImpl("ws://" + window.sessionStorage.getItem("rooturl") + ":9811/default/" + window.sessionStorage.getItem('token')); // when data is comming from the server, this metod is called

    ws.onmessage = function (evt) {
        var received_msg = evt.data;

        if (received_msg == "DataUpdate") {
            GetYwlxGroup();
            getwaitcount();
            WaitAndProcCount();
            GetCkProcCount();
            GetListData();
            getRightAndBottom();
        }

        if (received_msg == "Warning") {
            QueryWarn();
        }
    }; // when the connection is established, this method is called


    ws.onopen = function () { }; // when the connection is closed, this method is called


    ws.onclose = function () {//inc.innerHTML = '.. connection closed';
    };

    ws.onerror = function () { };
};

window.onload = start;