"use strict";
var server;
(function (server_1) {
    var server = /** @class */ (function () {
        function server() {
        }
        server.prototype.connection = function (data, callback) {
            var _this = this;
            $.ajax({
                url: "./php/server.php",
                type: "post",
                data: data,
                success: function (response) {
                    callback(_this.deserializeData(response));
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.log(textStatus, errorThrown);
                }
            });
        };
        server.prototype.deserializeData = function (data) {
            return data;
        };
        return server;
    }());
    server_1.server = server;
})(server || (server = {}));
