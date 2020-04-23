var AppData = JSON.parse(window.sessionStorage.getItem("AppData"))

var data = {
    ip: '0.0.0.0',
    cxlx: "机动车信息",
    hpzlno: '02',
    hpzls: [],
    hphm: '川D',
    sfzhm: '',
    driver: "",
    vehicle: "",
    rblist: []

}
var vm = new Vue({
    el: "#root",
    data: data,
    watch: {
        hphm: function (nv) {
            this.hphm = nv.toUpperCase();
        }
    },
    beforeCreate: function () {
        init();
    },
    updated: function () {
        //$('select.select').select();
    },
    methods: {
        query: function () {
            if (data.cxlx == "驾驶人信息" && data.sfzhm.length != 18) {
                layer.alert("身份证号码不正确", { icon: 2 });
                return;
            }
            if (data.cxlx == "机动车信息" && data.hphm.length < 7) {
                layer.alert("号牌号码不正确", { icon: 2 });
                return;
            }
            query();
        }
    }
})
function init() {
    jQuery.ajax({
        async: true,
        type: "get",
        contentType: "application/json",
        url: "/api/SysPublicMethod/GetCode",
        headers: {
            'Authorization': window.sessionStorage.getItem('token')
        },
        data: {
            lb: "['综合平台业务@ALL@号牌种类']"
        },
        success: function (res) {
            data.hpzls = res.Data

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
    })
}
function query() {
    tab("jbxx");
    var index = layer.load(0, { shade: [0.1, "#FFFFFF"] });
    let data1 = { lx: data.cxlx, sfzhm: data.sfzhm, hpzl: data.hpzlno, hphm: data.hphm, ip: data.ip }
    /*post方法,方便后端以dynamic类获取数据,
     * 1-contentType:"application/json",
     * 2-data必须stringify*/
    jQuery.ajax({
        async: true,
        type: "get",
        contentType: "application/json",
        url: "/api/HmdglYwcx/QueryTrffAndHmd",
        headers: {
            'Authorization': window.sessionStorage.getItem('token')
        },
        data: data1,
        success: function (res) {
            if (data.cxlx == "驾驶人信息") {
                if (res.memo1 == null) {
                    data.driver = null;
                }
                else if (res.memo1 == "nodata") {
                    data.driver = {};
                    Object.assign(data.driver, { 'root': { 'body': '' } })
                }
                else {
                    data.driver = JSON.parse(res.memo1)
                }
                data.rblist = res.Data
            }
            else {
                if (res.memo1 == null) {
                    data.vehicle = null;
                }
                else if (res.memo1 == "nodata") {
                    data.vehicle = {};
                    Object.assign(data.vehicle, { 'root': { 'body': '' } })

                }
                else {
                    data.vehicle = JSON.parse(res.memo1)
                }
            }
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
            else { alert('错误:' + ret.Message) }try{layer.close(index);}catch(e){}
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
/************* */
/*
var RTCPeerConnection = window.RTCPeerConnection || window.webkitRTCPeerConnection || window.mozRTCPeerConnection;
if (RTCPeerConnection) (function () {
    var rtc = new RTCPeerConnection({ iceServers: [] });
    if (1 || window.mozRTCPeerConnection) {
        rtc.createDataChannel('', { reliable: false });
    };

    rtc.onicecandidate = function (evt) {
        if (evt.candidate) grepSDP("a=" + evt.candidate.candidate);
    };
    rtc.createOffer(function (offerDesc) {
        grepSDP(offerDesc.sdp);
        rtc.setLocalDescription(offerDesc);
    }, function (e) { console.warn("offer failed", e); });


    var addrs = Object.create(null);
    addrs["0.0.0.0"] = false;
    function updateDisplay(newAddr) {
        if (newAddr in addrs) return;
        else addrs[newAddr] = true;
        var displayAddrs = Object.keys(addrs).filter(function (k) { return addrs[k]; });
        for (var i = 0; i < displayAddrs.length; i++) {
            if (displayAddrs[i].length > 16) {
                displayAddrs.splice(i, 1);
                i--;
            }
        }
        console.log(displayAddrs[0]);      //打印出内网ip
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
})();
else {
    console.log("请使用主流浏览器：chrome,firefox,opera,safari");
}*/
/************************ */
