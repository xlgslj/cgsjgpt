var hashtree = false;
var setting = {
    edit: {
        enable: false,
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
    },
    callback: {
        onClick: zTreOnClick,
        onExpand: zTreOnExpand,
        onCollapse: zTreeOnCollapse

    }
};
var zNodes = [
    { id: "5104000000", pId: "0000000000", name: "攀枝花市公安局交通警察支队", ID: "5104000000", PID: "0000000000", NAME: "攀枝花市公安局交通警察支队", open: true },
];

init();
function init() {

    //var index = layer.load(0, { shade: [0.1, "#FFFFFF"] });
    /*post方法,方便后端以dynamic类获取数据,
     * 1-contentType:"application/json",
     * 2-data必须stringify*/
    jQuery.ajax({
        async: true,
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
            //layer.close(index);
            for (var i in res.Data) {
                let obj = Object.assign({}, res.Data[i], { id: res.Data[i].ID, pId: res.Data[i].PID, name: res.Data[i].NAME })
                zNodes.push(obj)
            }
            $.fn.zTree.init($("#treeDemo"), setting, zNodes);
            hashtree = true;
            typeof setinitdata === "function" ? setinitdata() : null;//初始化外部数据
        },
        error: function (res) {
            //layer.alert(res.responseText, { icon: 2 });
            //layer.close(index);
        }
    });
}
function zTreOnClick(event, treeid, treeNode) {
    data.bmmc = treeNode.NAME
    data.bmno = treeNode.ID
    data.showtree = false;
}
function zTreOnExpand(event, treeid, treeNode) {
    data.divheight = (jQuery("#treeDemo").height() + 10) + "px";
}
function zTreeOnCollapse(event, treeId, treeNode) {
    data.divheight = (jQuery("#treeDemo").height() + 10) + "px";
};