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
        onRename: onRename
    }
};

var zNodes = [
    { id: "R000000001", pId: "0000000000", name: "根ROOT", ID: "R000000001", PID: "0000000000", NAME: "根ROOT", open: true },
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
        url: "/api/SysCsMenu/MenuGet",
        headers: {
            'Authorization': window.sessionStorage.getItem('token')
        },
        data:
        {
        },
        success: function (res) {
            layer.close(index);
            res.Data.forEach(function (item) {
                let obj = Object.assign({}, item, { id: item.ID, pId: item.PID, name: item.NAME })
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
    currentNode = treeNode;
    layindex = layer.open({
        title: '添加',
        type: 2,
        area: ['800px', '450px'],
        fixed: false, //不固定
        maxmin: true,
        content: ['menuedit.html', "no"]
    });
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
    var treeObj = $.fn.zTree.getZTreeObj("treeDemo");
    alert(JSON.stringify(treeObj.getNodes()))
}
function onRename(e, treeId, treeNode, isCancel) {

}
function showRemoveBtn(treeId, treeNode) {
    //return !treeNode.isFirstNode;
    /*let exitchildren;
    try {
        let i = treeNode.children.length
        exitchildren = true;
    }
    catch (e) {
        exitchildren = false;
    }
    return treeNode.getParentNode() != null & !exitchildren;*/

    return !treeNode.isParent;

}
function showRenameBtn(treeId, treeNode) {
    return treeNode.getParentNode() != null
}

var newCount = 1;
function addHoverDom(treeId, treeNode) {

    var sObj = $("#" + treeNode.tId + "_span");
    if (treeNode.editNameFlag || $("#addBtn_" + treeNode.tId).length > 0) return;
    var addStr = "";
    var addStr1 = "";
    var addStr2 = "";

    if (!treeNode.isFirstNode) {
        addStr1 = "<span id='upBtn_" + treeNode.tId
            + "' title='上移' onfocus='this.blur();' >&nbsp;↑&nbsp;</span>";

    }
    if (!treeNode.isLastNode) {
        addStr2 = "<span id='downBtn_" + treeNode.tId
            + "' title='下移' onfocus='this.blur();'>&nbsp;↓&nbsp;</span>";
    }
    if (treeNode.level <= 3) {
        addStr = "<span class='button add' id='addBtn_" + treeNode.tId
            + "' title='新增' onfocus='this.blur();'></span>";
    }


    sObj.after(addStr + addStr1 + addStr2);
    var btn = $("#addBtn_" + treeNode.tId);
    if (btn) {
        if (treeNode.level < 3) {
            btn.bind("click", function () {
                currentNode = treeNode;
                layindex = layer.open({
                    title: '添加',
                    type: 2,
                    area: ['800px', '450px'],
                    fixed: false, //不固定
                    maxmin: true,
                    content: ['menuadd.html', "no"]
                });
                return false;
            });
        }
        else {
            btn.bind("click", function () {
                alert("只能添加3级菜单")
                return false;
            });
        }
    }
    var upbtn = $("#upBtn_" + treeNode.tId);
    if (upbtn) upbtn.bind("click", function () {
        if (confirm("确认上移--" + treeNode.name + " 吗？")) {
            return !resort(treeNode, treeNode.getPreNode(), "prev");
        }

    });
    var downbtn = $("#downBtn_" + treeNode.tId);
    if (downbtn) downbtn.bind("click", function () {
        if (confirm("确认下移--" + treeNode.name + " 吗？")) {

            return !resort(treeNode, treeNode.getNextNode(), "next");
        }

    });
    return false;
};
function removeHoverDom(treeId, treeNode) {

    $("#addBtn_" + treeNode.tId).unbind().remove();
    $("#upBtn_" + treeNode.tId).unbind().remove();
    $("#downBtn_" + treeNode.tId).unbind().remove();
};
function addnode(node) {
    var zTree = $.fn.zTree.getZTreeObj("treeDemo");
    zTree.addNodes(currentNode, node);
}
function removenode(treeNode) {
    var index = layer.load(0, { shade: [0.1, "#FFFFFF"] });
    var ret1;
    /*post方法,方便后端以dynamic类获取数据,
     * 1-contentType:"application/json",
     * 2-data必须stringify*/
    jQuery.ajax({
        async: false,
        type: "post",
        contentType: "application/json",
        url: "/api/SysCsMenu/DelMenu",
        headers: {
            'Authorization': window.sessionStorage.getItem('token')
        },
        data: JSON.stringify({
            id: treeNode.id
        }),
        success: function (res) {
            layer.close(index);
            ret1 = true;
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

            ret1 = false;
        }
    });
    return ret1;
}
function resort(node1, node2, mode) {
    var index = layer.load(0, { shade: [0.1, "#FFFFFF"] });
    var ret;
    /*post方法,方便后端以dynamic类获取数据,
     * 1-contentType:"application/json",
     * 2-data必须stringify*/
    jQuery.ajax({
        async: false,
        type: "post",
        contentType: "application/json",
        url: "/api/SysCsMenu/ReSort",
        headers: {
            'Authorization': window.sessionStorage.getItem('token')
        },
        data: JSON.stringify({
            id1: node1.id,
            sort1: node1.SORT,
            id2: node2.id,
            sort2: node2.SORT,

        }),
        success: function (res) {
            layer.close(index);
            var treeObj = $.fn.zTree.getZTreeObj("treeDemo");
            treeObj.moveNode(node2, node1, mode);
            let s1 = node1.SORT;
            node1.SORT = node2.SORT;
            node2.SORT = s1;
            treeObj.cancelSelectedNode();
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
//----------------/
var data = {
    formmode: false,
    pname: "",
    bmno: "1234",
    bmmc: "",
    bajgno: "",
    bajgmc: "",
    bmjb: "",
    lxr: "",
    lxdh: "",
    fzjg: "",
    fax: "",
    lxdz: "",
    memo: "",
}
var vm = new Vue({
    el: "#info",
    data: data,
    computed: {
        pagemode: function () {
            return !this.formmode;
        }
    }
})
