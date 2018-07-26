"use strict";
var laComanda;
(function (laComanda) {
    var server = /** @class */ (function () {
        function server() {
        }
        server.prototype.login = function (user, pass, callback) {
            var data = {
                "user": user,
                "pass": pass,
                "action": "login"
            };
            this.connection(data, callback);
        };
        server.prototype.getPedidos = function (callback) {
            var data = {
                "action": "getPedidos"
            };
            this.connection(data, callback);
        };
        server.prototype.setPedidos = function (pedidos, callback) {
            var data = {
                "action": "setPedidos",
                "pedidos": pedidos
            };
            this.connection(data, callback);
        };
        server.prototype.connection = function (data, callback) {
            $("#spinner-modal").modal('toggle');
            $.ajax({
                url: "./php/server.php",
                type: "post",
                data: data,
                success: function (response) {
                    setTimeout(function () {
                        $("#spinner-modal").modal('toggle');
                        callback(response);
                    }, 500);
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.log(textStatus, errorThrown);
                }
            });
        };
        return server;
    }());
    laComanda.server = server;
})(laComanda || (laComanda = {}));
