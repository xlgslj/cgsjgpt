var LODOP;
var isIE = (navigator.userAgent.indexOf('MSIE') >= 0) || (navigator.userAgent.indexOf('Trident') >= 0);
var data = {
    xh: GetUrlPara()[0].value,
    pdxx: {},
    ywlxcode: "",
    ywlx: "",
    hpzlcode: "",
    hpzl: "",
    hphm: "",
    clsbhm: "",
    tblx:"",
    code: {
        ywlxs: [],
        hpzls: [],
        filelxs: [],
        tblx: AppData.Tblx
    }
};
var vm = new Vue({
    el: '#root',
    data: data,
    beforeCreate: function beforeCreate() {
        init();
    },
    computed: {
        filescount: function filescount() {
            return this.code.filelxs.length;
        }
    },
    watch: {
        ywlxcode: function ywlxcode(nv, ov) {
            this.ywlx = this.code.ywlxs.filter(function (item) {
                return item.CODE1 == nv;
            })[0].NAME;
        },
        hpzlcode: function hpzlcode(nv, ov) {
            this.hpzl = this.code.hpzls.filter(function (item) {
                return item.CODE1 == nv;
            })[0].NAME;
        }
    },
    methods: {
        selected: function selected(index, lx) {
            var obj = data.code.filelxs[index];
            if (lx == "bq") {
                !isIE ? obj.bq = !obj.bq : null;
                if (obj.bq) obj.qs = false;
            }

            if (lx == "qs") {
                !isIE ? obj.qs = !obj.qs : null;
                if (obj.qs) obj.bq = false;
            }

            Vue.set(data.code.filelxs, index, obj);
        },
        saveandprint: function saveandprint() {
            let msg = "";
            LODOP = getLodop();
            if (LODOP == undefined) {
                msg += '没有安装打印机，此次操作无效，请按页面上方提示安装打印机后重试！<br/>';
            } 
            if (data.hphm.length < 7) msg += "号牌号码输入错误!";
            if (msg.length>0) {
                layer.alert(msg, { icon: 2 })
                return;
            }

            layer.confirm('确定保存并打印告知书吗？', {
                btn: ['确定', '放弃'] //按钮

            }, function (index) {
                layer.close(index);
                /*var count = 0;
                data.code.filelxs.forEach(function (item) {
                    item.qs ? count++ : count;
                });*/
                if (data.tblx == "") {
                    layer.alert("退办类型必选", {
                        icon: 2
                    });
                    return false;
                }
                /*if (count == 0) {
                    layer.alert("没有选择缺少项", {
                        icon: 2
                    });
                    return false;
                }*/

                _saveandprint();
            }, function () {
                return;
            });
        },
        reset: function reset() {
            data.code.filelxs.forEach(function (item, index) {
                Vue.set(data.code.filelxs, index, Object.assign(item, {
                    bq: false,
                    qs: false
                }));
            });
        }
    }
});

function init() {
    var index = layer.load(0, {
        shade: [0.1, "#FFFFFF"]
    });
    jQuery.ajax({
        async: true,
        type: "get",
        contentType: "application/json",
        url: "/api/DtglYwbl/PdjhJdcywGzs",
        headers: {
            'Authorization': window.sessionStorage.getItem('token')
        },
        data: {
            xh: data.xh
        },
        success: function success(res) {
            layer.close(index);
            data.pdxx = res.memo2;
            data.code.ywlxs = res.Data;
            data.ywlxcode = res.Data[0].CODE1;
            data.ywlx = res.Data[0].NAME;
            data.code.hpzls = res.Data1;
            data.hpzlcode = res.Data1[0].CODE1;
            data.hpzl = res.Data1[0].NAME;
            var files = res.Data2;
            files.forEach(function (item) {
                //Object.assign(item, { CODE1: item.CODE1, NAME: item.NAME, bq: false, qs: false })
                data.code.filelxs.push({
                    CODE1: item.CODE1,
                    NAME: item.NAME,
                    bq: false,
                    qs: false
                });
            });
            data.code.filelxs.push({
                CODE1: data.code.filelxs.length + 1,
                NAME: '其他',
                CONTENT: ''
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
            else { alert('错误:' + ret.Message) }try{layer.close(index);}catch(e){}
            return;
        }
    });
}

function _saveandprint() {
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
        url: "/api/DtglYwbl/NoticeAdd",
        headers: {
            'Authorization': window.sessionStorage.getItem('token')
        },
        data: JSON.stringify({
            lb: "机动车登记/业务告知书",
            pdxx: data.pdxx,
            ywlxno: data.ywlxcode,
            ywlx: data.ywlx,
            hpzlno: data.hpzlcode,
            hpzl: data.hpzl,
            hphm: data.hphm,
            clsbhm: data.clsbhm,
            files: data.code.filelxs,
            tblx: data.tblx
        }),
        success: function success(res) {
            layer.close(index);
            window.parent.postMessage({
                act: '退办告知打印完成',
                msg: {
                    answer: '我接收到啦！'
                }
            }, '*');
            layer.msg('保存成功，正在打印......', {
                icon: 6,
                time: 5000,
                shade: [0.1, "#FFFFFF"]
            }, function () {
                window.parent.layer.close(window.parent.layindex2);
            });
            CreatePrintPage(res.memo1);
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
            else { alert('错误:' + ret.Message) }try{layer.close(index);}catch(e){}
            return;
        }
    });
}

function CreatePrintPage(notice) {
    LODOP = getLodop();
    var bq = [];
    var qs = [];
    var noticefiles = JSON.parse(notice.FILES);
    noticefiles.forEach(function (item) {
        if (item.bq) {
            bq.push(item.CODE1);
        }

        if (item.qs) {
            qs.push(item.CODE1);
        }
    });
    LODOP.PRINT_INITA(0, 0, "297mm", "210mm", "机动车登记/业务告知书");
    LODOP.SET_PRINT_PAGESIZE(2, 2100, 2970, "");
    LODOP.ADD_PRINT_TEXT(33, 66, 189, 29, "机动车登记/业务告知书");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "幼圆");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 12);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_TEXT(72, 64, 220, 24, "(存根联)     NO:" + notice.BH);
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
    LODOP.ADD_PRINT_TEXT(106, 21, 61, 20, "申请人：");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
    LODOP.ADD_PRINT_TEXT(106, 82, 229, 70, " " + notice.NAME);
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
    LODOP.SET_PRINT_STYLEA(0, "Underline", 1);
    LODOP.SET_PRINT_STYLEA(0, "SpacePatch", 1);
    LODOP.SET_PRINT_STYLEA(0, "LineSpacing", 10);
    LODOP.ADD_PRINT_TEXT(188, 82, 229, 20, notice.HPZL);
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
    LODOP.SET_PRINT_STYLEA(0, "Underline", 1);
    LODOP.SET_PRINT_STYLEA(0, "SpacePatch", 1);
    LODOP.SET_PRINT_STYLEA(0, "LineSpacing", 10);
    LODOP.ADD_PRINT_TEXT(188, 8, 74, 20, "号牌种类：");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
    LODOP.ADD_PRINT_TEXT(220, 82, 229, 20, " " + notice.HPHM);
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
    LODOP.SET_PRINT_STYLEA(0, "Underline", 1);
    LODOP.SET_PRINT_STYLEA(0, "SpacePatch", 1);
    LODOP.SET_PRINT_STYLEA(0, "LineSpacing", 10);
    LODOP.ADD_PRINT_TEXT(220, 8, 74, 20, "号牌号码：");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
    LODOP.ADD_PRINT_TEXT(254, 8, 174, 20, "暂不受理原因：缺少第");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
    LODOP.ADD_PRINT_TEXT(284, 8, 302, 20, qs.join(','));
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
    LODOP.SET_PRINT_STYLEA(0, "Underline", 1);
    LODOP.SET_PRINT_STYLEA(0, "SpacePatch", 1);
    LODOP.SET_PRINT_STYLEA(0, "LineSpacing", 10);
    LODOP.ADD_PRINT_TEXT(314, 8, 302, 20, "项申请资料,或应当补齐的其他资料");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
    LODOP.SET_PRINT_STYLEA(0, "SpacePatch", 1);
    LODOP.SET_PRINT_STYLEA(0, "LineSpacing", 10);
    LODOP.ADD_PRINT_TEXT(341, 8, 302, 45, " " + noticefiles[noticefiles.length - 1].CONTENT);
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
    LODOP.SET_PRINT_STYLEA(0, "Underline", 1);
    LODOP.SET_PRINT_STYLEA(0, "SpacePatch", 1);
    LODOP.SET_PRINT_STYLEA(0, "LineSpacing", 10);
    LODOP.ADD_PRINT_TEXT(397, 21, 61, 20, "经办人:");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
    LODOP.ADD_PRINT_TEXT(397, 82, 229, 20, notice.JBR);
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
    LODOP.SET_PRINT_STYLEA(0, "Underline", 1);
    LODOP.SET_PRINT_STYLEA(0, "SpacePatch", 1);
    LODOP.SET_PRINT_STYLEA(0, "LineSpacing", 10);
    LODOP.ADD_PRINT_TEXT(425, 2, 81, 20, "申请人签名:");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
    LODOP.ADD_PRINT_TEXT(425, 82, 229, 20, " ");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
    LODOP.SET_PRINT_STYLEA(0, "Underline", 1);
    LODOP.SET_PRINT_STYLEA(0, "SpacePatch", 1);
    LODOP.SET_PRINT_STYLEA(0, "LineSpacing", 10);
    LODOP.ADD_PRINT_TEXT(453, 15, 68, 20, "告知日期:");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
    LODOP.ADD_PRINT_TEXT(453, 82, 229, 20, LODOP.FORMAT("TIME:YYYY年MM月DD日", notice.GZRQ));
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
    LODOP.SET_PRINT_STYLEA(0, "SpacePatch", 1);
    LODOP.SET_PRINT_STYLEA(0, "LineSpacing", 10);
    LODOP.ADD_PRINT_BARCODE(484, 19, 289, 60, "Code39", notice.BH);
    LODOP.ADD_PRINT_LINE(700, 330, 40, 330, 3, 1);
    LODOP.ADD_PRINT_TEXT(33, 599, 189, 29, "机动车登记/业务告知书");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "幼圆");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 12);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_TEXT(78, 777, 120, 24, "NO:" + notice.BH);
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
    LODOP.ADD_PRINT_BARCODE(76, 549, 212, 24, "Code39", notice.BH);
    LODOP.ADD_PRINT_TEXT(110, 373, notice.NAME.length * 15, 20, "    " + notice.NAME);
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
    LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
    LODOP.SET_PRINT_STYLEA(0, "Underline", 1);
    LODOP.SET_PRINT_STYLEA(0, "SpacePatch", 1);
    LODOP.ADD_PRINT_TEXT(110, (notice.NAME.length * 15 + 373), 117, 20, "同志,您好!");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
    LODOP.ADD_PRINT_TEXT(130, 373, 279, 20, "   您（单位）申请办理的机动车（号牌号码：");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
    LODOP.ADD_PRINT_TEXT(130, 641, 110, 20, "  " + notice.HPHM);
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
    LODOP.SET_PRINT_STYLEA(0, "Underline", 1);
    LODOP.SET_PRINT_STYLEA(0, "SpacePatch", 1);
    LODOP.ADD_PRINT_TEXT(130, 751, 95, 20, ",车辆识别代码");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
    LODOP.ADD_PRINT_TEXT(130, 843, 230, 20, "   " + notice.CLSBHM);
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
    LODOP.SET_PRINT_STYLEA(0, "Underline", 1);
    LODOP.SET_PRINT_STYLEA(0, "SpacePatch", 1);
    LODOP.ADD_PRINT_TEXT(130, 1072, 16, 20, ")");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
    LODOP.ADD_PRINT_TEXT(150, 355, 151, 20, "    " + notice.YWLX);
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
    LODOP.SET_PRINT_STYLEA(0, "Underline", 1);
    LODOP.SET_PRINT_STYLEA(0, "SpacePatch", 1);
    LODOP.ADD_PRINT_TEXT(150, 506, 204, 20, "业务，经我所初步审核，已备齐第");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
    LODOP.ADD_PRINT_TEXT(150, 708, 142, 20, "  " + bq.join(","));
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
    LODOP.SET_PRINT_STYLEA(0, "Underline", 1);
    LODOP.SET_PRINT_STYLEA(0, "SpacePatch", 1);
    LODOP.ADD_PRINT_TEXT(150, 849, 113, 20, "项资料，还缺少第");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
    LODOP.ADD_PRINT_TEXT(150, 960, 124, 20, "  " + qs.join(","));
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
    LODOP.SET_PRINT_STYLEA(0, "Underline", 1);
    LODOP.SET_PRINT_STYLEA(0, "SpacePatch", 1);
    LODOP.ADD_PRINT_TEXT(170, 356, 531, 20, "项资料，因此，暂不能受理您申请的业务。请补齐所缺资料后，再重新取号办理业务。");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
    var i = 0;
    var yesorno = "";
    noticefiles.forEach(function (item, index) {
        if (index < 20) {
            yesorno = item.bq ? "√" : item.qs ? "×" : "";

            if (index % 2 == 0) {
                LODOP.ADD_PRINT_TEXT(190 + i * 20, yesorno == "" ? 356 : 343, 357, 20, yesorno + item.CODE1 + "、" + item.NAME);
                LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
            } else {
                LODOP.ADD_PRINT_TEXT(190 + i * 20, yesorno == "" ? 729 : 716, 350, 20, yesorno + item.CODE1 + "、" + item.NAME);
                LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
            }

            i = (index + 1) % 2 == 0 ? i + 1 : i;
        } else if (index < noticefiles.length - 1) {
            yesorno = item.bq ? "√" : item.qs ? "×" : "";
            LODOP.ADD_PRINT_TEXT(190 + i * 20, yesorno == "" ? 356 : 343, 600, 20, yesorno + item.CODE1 + "、" + item.NAME);
            LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
            i++;
        } else {
            LODOP.ADD_PRINT_TEXT(190 + i * 20, 356, 62, 20, item.CODE1 + "、" + item.NAME);
            LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
        }
    });
    LODOP.ADD_PRINT_TEXT(190 + i * 20, 414, 660, 40, noticefiles[noticefiles.length - 1].CONTENT);
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
    LODOP.SET_PRINT_STYLEA(0, "FontColor", "#FF0000");
    LODOP.SET_PRINT_STYLEA(0, "Underline", 1);
    LODOP.SET_PRINT_STYLEA(0, "SpacePatch", 1);
    LODOP.SET_PRINT_STYLEA(0, "LineSpacing", 5);
    i++;
    LODOP.ADD_PRINT_TEXT(190 + i * 20, 356, 700, 20, "退办类型:" + notice.TBLX);
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
    LODOP.SET_PRINT_STYLEA(0, "FontColor", "#FF0000");
    i++;
    i++;
    LODOP.ADD_PRINT_TEXT(190 + i * 20, 356, 700, 20, "谢谢您对车管工作的支持！               联系电话：" + notice.KEY1 + "               监督电话：" + notice.KEY2);
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
    i++;
    LODOP.ADD_PRINT_TEXT(190 + i * 20, 356, 700, 20, "经办人签字/签章：" + notice.JBR + "                                                  " + LODOP.FORMAT("TIME:YYYY年MM月DD日", notice.GZRQ));
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
    i++;
    LODOP.ADD_PRINT_TEXT(190 + i * 20, 356, 700, 20, "业务领导签字/签章：                     （单位业务印章）                 " + LODOP.FORMAT("TIME:YYYY年MM月DD日", notice.GZRQ));
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
    LODOP.PRINT(); // LODOP.PREVIEW();
    // LODOP.PRINT_DESIGN();
}

;