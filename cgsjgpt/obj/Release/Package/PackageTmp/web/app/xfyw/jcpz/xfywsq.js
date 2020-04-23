var pagecolor = jQuery(".headtop", window.parent.document).css("background-color");
var active;
var sourceData, tableData;
var checkrows = [];
var currentNOde = {};

var data = {
    ptlb: "",
    xtlb: "",
    ywlx: "",
    ywyy: "",
    blms: "",
    code: {
        ptlbs: [],
        xtlbs: [],
        blmss: []
    },
    dbclicked: false
}
layui.use(['layer', 'table', 'jquery'], function () {
    var layer = layui.layer,
        table = layui.table;

    //获取源数据
    jQuery.ajax({
        async: false,
        type: "get",
        contentType: "application/json",
        url: "/api/XfywJcpz/QueryBusinessBase",
        headers: {
            'Authorization': window.sessionStorage.getItem('token')
        },
        data: {
            page: 1,
            limit: 1000,
            ptlb: "",
            xtlb: "",
            ywlx: "",
            ywyy: "",
            blms: ""
        },
        success: function (res) {
            res.data.forEach(function (item) {
                Object.assign(item, { LAY_CHECKED: false })
            });
            sourceData = JSON.parse(JSON.stringify(res.data));
            tableData = JSON.parse(JSON.stringify(res.data));
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
    })

    var cols = [[ //表头
        { type: 'checkbox', title: '序号' }
        , { field: 'PTLB', title: '平台类别', width: 150 }
        , { field: 'XTLB', title: '系统类别', width: 100 }
        , { field: 'YWLX', title: '业务类型', width: 150 }
        , { field: 'YWYY', title: '业务原因', width: 200 }
        , { field: 'SHMS', title: '审核模式', width: 150 }
        , { field: 'BLMS', title: '办理模式', width: 210 }
        , { field: '', title: '操作', width: 140, templet: '#barDemo' }
    ]];
    //第一个实例
    table.render({
        elem: '#demo'
        , id: "table"
        , height: "full-60"
        , data: tableData
        , totalRow: false
        , page: false //开启分页
        , limits: [10, 14, 20, 30, 40, 50, 60, 70, 80, 90]
        , limit: 1000
        , cols: cols
        , toolbar: false

    });
    active = {
        reload: function () {
            checkrows.forEach(function (item) {
                tableData.forEach(function (item1) {
                    if (item1.ID == item) {
                        Object.assign(item1, { LAY_CHECKED: true });
                    }
                });
            });
            //执行重载
            table.reload('table', {
                data: tableData
            });
        },
        getCheckData: function () { //获取选中数据
            var checkStatus = table.checkStatus('table')
                , data = checkStatus.data;
            tableData.forEach(function (item) {
                let p = data.filter(function (item2) {
                    return item.ID == item2.ID;
                })
                let i = checkrows.indexOf(item.ID);
                //console.log(checkrows,item.ID,p.length,i)
                if (p.length == 0) {
                    i < 0 ? null : checkrows.splice(i, 1);

                }
                else {
                    i >= 0 ? null : checkrows.push(item.ID)
                }
            })
        }
    };
    table.on('tool(test)', function (obj) {
        if (obj.event == "show") {
            window.parent.layindex2 = window.parent.layer.open({
                title: "详细信息",
                type: 2,
                area: ["1000px", "800px"],
                fixed: false, //不固定
                maxmin: true,
                content: ["app/xfyw/jcpz/showbusiness.html?id=" + obj.data.ID, "no"]
            });
        }
    });
})

var vm = new Vue({
    el: "#app",
    data: data,
    beforeCreate: function () {
        init();
    },
    computed: {
        xtlbs1: function () {
            let p = data.code.xtlbs.filter(function (item) {
                return item.XTLB == data.ptlb;
            })
            return [{ CODE1: "", NAME: "" }].concat(p)
        }
    },
    watch: {

    },
    methods: {
        query: function () {
            active["getCheckData"].call(this);
            tableData = JSON.parse(JSON.stringify(sourceData));
            if (data.ptlb != "") {
                tableData = tableData.filter(function (item) {
                    return item.PTLB == data.ptlb;
                });
            }
            if (data.xtlb != "") {
                tableData = tableData.filter(function (item) {
                    return item.XTLB == data.xtlb;
                });
            }
            active["reload"] ? active["reload"].call(this) : '';

        },
        save: function () {
            layer.confirm("授权给<br/>&nbsp;&nbsp;&nbsp;&nbsp;<font color='red'>" + currentNOde.NAME + "</font><br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;确定吗?", {
                btn: ["确定", "放弃"]
            },
                function (index) {
                    layer.close(index);
                    save();
                },
                function () {
                    return;
                }
            )
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
            lb: "['全局@全局@平台类别','全局@ALL@系统类别','全局@全局@办理模式']"
        },
        success: function (res) {
            data.code.ptlbs = [{ CODE1: "", NAME: "" }].concat(res.Data)
            data.code.xtlbs = res.Data1
            data.code.blmss = [{ CODE1: "", NAME: "" }].concat(res.Data2)

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
    })
}
function save() {
    active["getCheckData"].call(this);
    var index = layer.load(0, { shade: [0.1, "#FFFFFF"] });
    /*post方法,方便后端以dynamic类获取数据,
     * 1-contentType:"application/json",
     * 2-data必须stringify*/
    jQuery.ajax({
        async: true,
        type: "post",
        contentType: "application/json",
        url: "/api/XfywJcpz/BusinessBmQxSave",
        headers: {
            'Authorization': window.sessionStorage.getItem('token')
        },
        data: JSON.stringify({
            dw: currentNOde,
            bids: checkrows
        }),
        success: function (res) {
            layer.close(index);
            layer.alert('保存成功！', { icon: 1 });

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


}

// 定义一个名为 button-counter 的新组件

Vue.component('lj-tree', {
    props: ['initnodes'],
    data: function (nodes) {
        return {
            setting: {
                edit: {
                    enable: false,
                    editNameSelectAll: false
                },
                key: {
                    name: "NAME"
                },
                simpleData: {
                    enable: true,
                    idKey: "ID",
                    pIdKey: "PID",
                    rootPId: "0000000000"
                },
                data: {
                    simpleData: {
                        enable: true
                    }
                },
                view: {
                    selectedMulti: false
                },
                callback: {
                    onDblClick: zTreeOnDblClick,
                }
            },
            zNodes: this.initnodes
        }
    },
    mounted: function () {
        $.fn.zTree.init($("#treeDemo"), this.setting, this.zNodes);
    },
    methods: {

    },
    template: '<ul id="treeDemo" class="ztree"></ul>'
})
function zTreeOnDblClick(event, treeId, treeNode) {
    data.dbclicked = true;
    currentNOde = treeNode;
    checkrows = [];
    var index = layer.load(0, { shade: [0.1, "#FFFFFF"] });
    /*post方法,方便后端以dynamic类获取数据,
     * 1-contentType:"application/json",
     * 2-data必须stringify*/
    jQuery.ajax({
        async: true,
        type: "get",
        contentType: "application/json",
        url: "/api/XfywJcpz/BusinessBmQxGet",
        headers: {
            'Authorization': window.sessionStorage.getItem('token')
        },
        data: {
            dwno: treeNode.ID
        },
        success: function (res) {
            layer.close(index);
            tableData = JSON.parse(JSON.stringify(sourceData));

            if (res.data === "nodata") {
                console.log(1)
                active["reload"].call(this)
                return;
            }
            res.data.forEach(function (item) {
                tableData.forEach(function (item1) {
                    if (item1.ID == item) {
                        //Object.assign(item1,{LAY_CHECKED:true});
                        checkrows.push(item1.ID)
                    }
                });
            });

            active["reload"].call(this)


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
}
var data1 = {
    nodes: []
}
var vm1 = new Vue({
    el: '#bmtree',
    data: data1,
    beforeCreate: function () {
        jQuery.ajax({
            async: false,
            type: "get",
            contentType: "application/json",
            url: "/api/SysQxBm/BmGet",
            headers: {
                'Authorization': window.sessionStorage.getItem('token')
            },
            data:
            {
            },
            success: function (res) {
                /*for (var i in res.Data) {
                    var obj = Object.assign({}, res.Data[i], { id: res.Data[i].ID, pId: res.Data[i].PID, name: res.Data[i].NAME })
                    data1.nodes.push(obj)
                }*/
                res.Data.forEach(function (item) {

                    var obj = Object.assign({}, item, { id: item.ID, pId: item.PID, name: item.NAME })
                    data1.nodes.push(obj)
                });

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
    }
})
