var AppData = JSON.parse(window.sessionStorage.getItem("AppData"))
var layindex, currentNode;
var setting = {
    edit: {
        enable: true,
        editNameSelectAll: true,
        showRemoveBtn: showRemoveBtn,
        showRenameBtn: showRenameBtn
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
        addHoverDom: addHoverDom,
        removeHoverDom: removeHoverDom,
        selectedMulti: false
    },
    callback: {
        beforeDrag: beforeDrag,
        beforeEditName: beforeEditName,
        beforeRemove: beforeRemove,
        beforeRename: beforeRename,
        onRemove: onRemove,
        onRename: onRename,
        onClick: zTreeOnClick

    }
};

var zNodes = [
    //{ id: "0000000001", pId: "0000000000", name: "攀枝花市公安局交通警察支队", ID: "5104000000", PID: "0000000000", NAME: "攀枝花市公安局交通警察支队", open: true },
];

init();
function init() {
    var index = layer.load(0, { shade: [0.1, "#FFFFFF"] });
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
            layer.close(index);
            res.Data.forEach(function (item) {

                var obj = Object.assign({}, item, { id: item.ID, pId: item.PID, name: item.NAME })
                zNodes.push(obj)
            });
            $.fn.zTree.init($("#treeDemo"), setting, zNodes);
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
function beforeDrag(treeId, treeNodes) {
    return false;
}
function beforeEditName(treeId, treeNode) {

    alert("edit")
    return false;
}
function beforeRemove(treeId, treeNode) {
    if (confirm("确认删除--" + treeNode.name + " 吗？")) {
        return removenode(treeNode);

    }
    else {
        return false;
    }
}
function onRemove(e, treeId, treeNode) {

}
function beforeRename(treeId, treeNode, newName, isCancel) {

}
function onRename(e, treeId, treeNode, isCancel) {

}
function zTreeOnClick(event, treeId, treeNode) {
    data.bminfo = {};
    var dwno = treeNode.id
    if (dwno != "5104000000") {
        getBm(dwno);
    }
    else {
        data.bminfo = { ID: '5104000000' }
    }
};
function showRemoveBtn(treeId, treeNode) {
    //return !treeNode.isFirstNode;
    let exitchildren;
    try {
        let i = treeNode.children.length
        exitchildren = true;
    }
    catch (e) {
        exitchildren = false;
    }
    return treeNode.getParentNode() != null & !exitchildren;
}
function showRenameBtn(treeId, treeNode) {
    return treeNode.getParentNode() != null
}

var newCount = 1;
function addHoverDom(treeId, treeNode) {
    var sObj = $("#" + treeNode.tId + "_span");
    if (treeNode.editNameFlag || $("#addBtn_" + treeNode.tId).length > 0) return;
    var addStr = "<span class='button add' id='addBtn_" + treeNode.tId
        + "' title='add node' onfocus='this.blur();'></span>";
    sObj.after(addStr);
    var btn = $("#addBtn_" + treeNode.tId);
    if (btn) btn.bind("click", function () {
        currentNode = treeNode;
        layindex = layer.open({
            title: '部门添加',
            type: 2,
            area: ['800px', '450px'],
            fixed: false, //不固定
            maxmin: true,
            content: ['bmadd.html', "no"]
        });
        return false;
    });
};
function removeHoverDom(treeId, treeNode) {
    $("#addBtn_" + treeNode.tId).unbind().remove();
};
function addnode(node) {
    var zTree = $.fn.zTree.getZTreeObj("treeDemo");
    zTree.addNodes(currentNode, node);
}
function removenode(treeNode) {
    var index = layer.load(0, { shade: [0.1, "#FFFFFF"] });
    var ret;
    /*post方法,方便后端以dynamic类获取数据,
     * 1-contentType:"application/json",
     * 2-data必须stringify*/
    jQuery.ajax({
        async: false,
        type: "post",
        contentType: "application/json",
        url: "/api/SysQxBm/BmDel",
        headers: {
            'Authorization': window.sessionStorage.getItem('token')
        },
        data: JSON.stringify({
            id: treeNode.id
        }),
        success: function (res) {
            layer.close(index);
            data.bminfo = {};
            ret = true;
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
            ret = false;
        }
    });
    return ret;
}
function getBm(id) {
    var index = layer.load(0, { shade: [0.1, "#FFFFFF"] });
    /*post方法,方便后端以dynamic类获取数据,
     * 1-contentType:"application/json",
     * 2-data必须stringify*/
    jQuery.ajax({
        async: false,
        type: "get",
        contentType: "application/json",
        url: "/api/SysQxBm/GetSingBm",
        headers: {
            'Authorization': window.sessionStorage.getItem('token')
        },
        data: {
            id: id
        },
        success: function (res) {
            layer.close(index);
            data.bminfo = res.Data;
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
function EditSave() {
    var index = layer.load(0, { shade: [0.1, "#FFFFFF"] });
    /*post方法,方便后端以dynamic类获取数据,
     * 1-contentType:"application/json",
     * 2-data必须stringify*/
    jQuery.ajax({
        async: false,
        type: "post",
        contentType: "application/json",
        url: "/api/SysQxBm/BmEdit",
        headers: {
            'Authorization': window.sessionStorage.getItem('token')
        },
        data: JSON.stringify(data.bminfo),
        success: function (res) {
            layer.close(index);
            data.bminfo = {};
            layer.alert("修改成功", { icon: 1 });
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
//----------------/
var data = {
    bminfo: { ID: '5104000000' },
    PFzjg: AppData.Fzjg
}
var vm = new Vue({
    el: "#info",
    data: data,
    computed: {
        pagemode: function () {
            return !this.formmode;
        }
    },
    methods: {
        edit: function () {
            layer.confirm("确定？", {
                btn: ["确定", "放弃"]
            },
                function (index) {
                    layer.close(index);
                    EditSave();
                },
                function () {
                    return;
                }
            )
        },
        ywcs: function () {
            window.parent.layindex2 = window.parent.layer.open({
                title: "部门业务参数",
                type: 2,
                area: ["1300px", "800px"],
                fixed: false, //不固定
                maxmin: true,
                content: ["app/sys/csgl/bmywcslist.html?id=" + data.bminfo.ID, "no"]
            });
        }

    }
})
