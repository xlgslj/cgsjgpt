var AppData =JSON.parse(window.sessionStorage.getItem("AppData"))

var data = {
    src:""
}
var vm = new Vue({
    el: "#root",
    data: data,
    methods: {
        photo: function () {
            window.open("http://192.168.2.189/3.html?" + window.sessionStorage.getItem('token'), "newwindow", "height=600, width=600, top=220, left=220, toolbar=yes, menubar=yes, scrollbars=no, resizable=no,location=no, status=no")//写成一行
        }
    }
})
var start = function () {
    var wsImpl = window.WebSocket || window.MozWebSocket;
    // create a new websocket and connect
    window.ws = new wsImpl("ws://" + window.sessionStorage.getItem("rooturl") + ":9811/image/" + window.sessionStorage.getItem('token'));

    // when data is comming from the server, this metod is called
    ws.onmessage = function (evt) {
        var received_msg = evt.data;
        data.src = received_msg;

    };

    // when the connection is established, this method is called
    ws.onopen = function () {

    };

    // when the connection is closed, this method is called
    ws.onclose = function () {
        //inc.innerHTML = '.. connection closed';
    };
    ws.onerror = function () {

    };
}
window.onload = start;