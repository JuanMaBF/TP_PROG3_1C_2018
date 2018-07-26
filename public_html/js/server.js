"use strict";
var laComanda;
(function (laComanda) {
    var server = /** @class */ (function () {
        function server() {
        }
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
            $.ajax({
                url: "./php/server.php",
                type: "post",
                data: data,
                success: function (response) {
                    callback(response);
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
