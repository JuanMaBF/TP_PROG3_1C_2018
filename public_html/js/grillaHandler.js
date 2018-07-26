"use strict";
///<reference path="../node_modules/@types/jquery/index.d.ts"/>
///<reference path="./model/pedidosHandler.ts"/>
///<reference path="./server.ts"/>
var laComanda;
(function (laComanda) {
    var grillaHandler = /** @class */ (function () {
        function grillaHandler() {
            this.server = new laComanda.server();
            this.pedidosHand = new laComanda.pedidosHandler();
            this.getPedidos();
        }
        grillaHandler.prototype.getPedidos = function () {
            var _this = this;
            this.server.getPedidos(function (ped) {
                _this.pedidosHand = laComanda.pedidosHandler.parse(JSON.parse(ped));
            });
        };
        return grillaHandler;
    }());
    laComanda.grillaHandler = grillaHandler;
})(laComanda || (laComanda = {}));
