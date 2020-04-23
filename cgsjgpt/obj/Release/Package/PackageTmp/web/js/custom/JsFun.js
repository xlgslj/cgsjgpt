//获取url参数
function GetUrlPara() {
    var url = document.location.toString();
    var arrUrl = url.split("?");
    var p = arrUrl[1].split("&");
    var paras = [];
    p.some(function (item) {
        paras.push({
            name: item.split("=")[0],
            value: item.split("=")[1]
        });
    });
    return paras;
}
