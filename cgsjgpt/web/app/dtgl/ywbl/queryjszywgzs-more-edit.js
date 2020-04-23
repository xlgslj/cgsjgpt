var LODOP;
var data = {
    xh: GetUrlPara()[0].value,
    notice: {},
    files: [],
    code: {
        ywlxs: [],
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
            return this.files.length;
        }
    },
    watch: {
        'notice.YWLXNO': function (nv, ov) {
            this.notice.YWLX = this.code.ywlxs.filter(function (item) {
                return item.CODE1 == nv;
            })[0].NAME;
        }
    },
    methods: {
        saveandprint: function saveandprint() {
            let msg = "";
            LODOP = getLodop();
            if (LODOP == undefined) {
                msg += '没有安装打印机，此次操作无效，请按页面上方提示安装打印机后重试！<br/>';
            }
            if (msg.length > 0) {
                layer.alert(msg, { icon: 2 })
                return;
            }
            layer.confirm('确定保存吗？', {
                btn: ['确定', '放弃'] //按钮

            }, function (index) {
                layer.close(index);
                _saveandprint();
            }, function () {
                return;
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
        url: "/api/DtglYwbl/GetNotice",
        headers: {
            'Authorization': window.sessionStorage.getItem('token')
        },
        data: {
            id: data.xh
        },
        success: function success(res) {
            data.notice = res.memo1;
            data.files = JSON.parse(data.notice.FILES);
            data.code.ywlxs = res.jszywlx;
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
function _saveandprint() {
    var index = layer.load(0, {
        shade: [0.1, "#FFFFFF"]
    });
    data.notice.FILES = JSON.stringify(data.files);
    /*post方法,方便后端以dynamic类获取数据,
    * 1-contentType:"application/json",
    * 2-data必须stringify
    *单个实体作为参数
    尝试成功，也就是说，两种写法都是可行的。如果你指定了contentType为application / json，则必须要传递序列化过的对象；如果使用post请求的默认参数类型，则前端直接传递json类型的对象即可*/
    jQuery.ajax({
        async: true,
        type: "post",
        contentType: "application/json",
        url: "/api/DtglYwbl/NoticeEdit",
        headers: {
            'Authorization': window.sessionStorage.getItem('token')
        },
        data: JSON.stringify(data.notice),
        success: function success(res) {
            layer.close(index);
            layer.msg('保存成功，正在打印......', {
                icon: 6,
                time: 5000,
                shade: [0.1, "#FFFFFF"]
            }, function () {
                window.parent.layer.close(window.parent.layindex2);
            });
            CreatePrintPage(data.notice);
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
    LODOP.PRINT_INITA(0, 0, "297mm", "210mm", "机动车驾驶证业务告知书");
    LODOP.SET_PRINT_PAGESIZE(2, 2100, 2970, "");
    LODOP.ADD_PRINT_TEXT(33, 66, 200, 29, "机动车驾驶证业务告知书");
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
    LODOP.ADD_PRINT_TEXT(188, 82, 229, 20, notice.ZJCX);
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
    LODOP.SET_PRINT_STYLEA(0, "Underline", 1);
    LODOP.SET_PRINT_STYLEA(0, "SpacePatch", 1);
    LODOP.SET_PRINT_STYLEA(0, "LineSpacing", 10);
    LODOP.ADD_PRINT_TEXT(188, 8, 74, 20, "准驾车型：");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
    LODOP.ADD_PRINT_TEXT(220, 101, 205, 20, " " + notice.SFZMHM);
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
    LODOP.SET_PRINT_STYLEA(0, "Underline", 1);
    LODOP.SET_PRINT_STYLEA(0, "SpacePatch", 1);
    LODOP.SET_PRINT_STYLEA(0, "LineSpacing", 10);
    LODOP.ADD_PRINT_TEXT(220, 8, 100, 20, "身份证明号码：");
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
    LODOP.ADD_PRINT_TEXT(33, 599, 200, 29, "机动车驾驶证业务告知书");
    LODOP.SET_PRINT_STYLEA(0, "FontName", "幼圆");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 12);
    LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    LODOP.ADD_PRINT_TEXT(78, 777, 120, 24, "NO:" + notice.BH);
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
    LODOP.ADD_PRINT_BARCODE(76, 549, 212, 24, "Code39", notice.BH);
    LODOP.ADD_PRINT_TEXT(110, 373, 117, 20, "    " + notice.NAME);
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
    LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
    LODOP.SET_PRINT_STYLEA(0, "Underline", 1);
    LODOP.SET_PRINT_STYLEA(0, "SpacePatch", 1);
    LODOP.ADD_PRINT_TEXT(110, 493, 117, 20, "同志,您好!");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
    LODOP.ADD_PRINT_TEXT(130, 373, 187, 20, "   您申请办理的机动车驾驶证");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
    LODOP.ADD_PRINT_TEXT(130, 551, 202, 20, "  " + notice.YWLX);
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
    LODOP.SET_PRINT_STYLEA(0, "Underline", 1);
    LODOP.SET_PRINT_STYLEA(0, "SpacePatch", 1);
    LODOP.ADD_PRINT_TEXT(130, 750, 130, 20, "业务（身份证明号码");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
    LODOP.ADD_PRINT_TEXT(130, 876, 208, 20, "   " + notice.SFZMHM);
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
    LODOP.SET_PRINT_STYLEA(0, "Underline", 1);
    LODOP.SET_PRINT_STYLEA(0, "SpacePatch", 1);
    LODOP.ADD_PRINT_TEXT(150, 552, 194, 20, "），经我所初步审核，已备齐第");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
    LODOP.ADD_PRINT_TEXT(150, 737, 139, 20, "  " + bq.join(","));
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
    LODOP.SET_PRINT_STYLEA(0, "Underline", 1);
    LODOP.SET_PRINT_STYLEA(0, "SpacePatch", 1);
    LODOP.ADD_PRINT_TEXT(150, 871, 113, 20, "项资料，还缺少第");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
    LODOP.ADD_PRINT_TEXT(150, 980, 116, 20, " " + qs.join(","));
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
    LODOP.SET_PRINT_STYLEA(0, "Underline", 1);
    LODOP.SET_PRINT_STYLEA(0, "SpacePatch", 1);
    LODOP.ADD_PRINT_TEXT(150, 356, 76, 20, "，档案编号");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
    LODOP.ADD_PRINT_TEXT(150, 431, 122, 20, "  " + notice.DABH);
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
    LODOP.SET_PRINT_STYLEA(0, "Underline", 1);
    LODOP.SET_PRINT_STYLEA(0, "SpacePatch", 1);
    LODOP.ADD_PRINT_TEXT(170, 356, 531, 20, "项资料，因此，暂不能受理您申请的业务。请补齐所缺资料后，再重新取号办理业务。");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
    var i = 0;
    var yesorno = "";
    noticefiles.forEach(function (item, index) {
        if (index < 10) {
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
    //LODOP.PRINT_DESIGN();
}

;