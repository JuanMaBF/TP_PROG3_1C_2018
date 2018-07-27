"use strict";
///<reference path="../node_modules/@types/jquery/index.d.ts"/>
///<reference path="./server.ts"/>
///<reference path="./model/pedidosHandler.ts"/>
var laComanda;
(function (laComanda) {
    var usuario = /** @class */ (function () {
        function usuario() {
            this.server = new laComanda.server();
            this.pedidosHand = new laComanda.pedidosHandler();
            this.currentPedido = '';
            this.getPedidos();
        }
        usuario.prototype.showParte = function (numero) {
            var numeros = new Array();
            numeros.push("1");
            numeros.push("2");
            numeros.push("3");
            numeros.splice(numeros.indexOf(numero), 1);
            $("#card-parte-" + numero).css("display", "block");
            numeros.forEach(function (n) {
                $("#card-parte-" + n).css("display", "none");
            });
        };
        usuario.prototype.validateDatosMesa = function () {
            var numeroMesa = $("#numeroMesa").val();
            var codigo = $("#codigo-txt").val();
            if (numeroMesa != "" && codigo != "") {
                if (this.pedidosHand.pedidos.some(function (p) { return p.numeroMesa.toString() == numeroMesa && p.id == codigo; })) {
                    this.mostrarPedido(codigo);
                    this.currentPedido = codigo;
                    this.showParte("2");
                }
                else {
                    alert("Informacion incorrecta. Chequee sus datos o consulte con el mozo");
                }
            }
            else {
                alert("Informacion incorrecta. Chequee sus datos o consulte con el mozo");
            }
        };
        usuario.prototype.mostrarPedido = function (codigo) {
            var _this = this;
            var newHtml = "";
            this.pedidosHand.pedidos.filter(function (p) { return p.id == codigo; })[0].elementos.forEach(function (e) {
                newHtml += "\n                    <tr>\n                        <th>" + e.nombre + " (" + e.cantidad + ")</th>\n                        <th>" + e.estado + "</th>\n                        <th>" + _this.getTiempoRestante(e) + "</th>\n                    </tr>\n                ";
            });
            $("#tbody-pedidos").html(newHtml);
        };
        usuario.prototype.getTiempoRestante = function (e) {
            var d = new Date();
            var minutos = d.getMinutes() + (d.getHours() * 60);
            var minutosEl = e.minutos + (e.hora * 60);
            var tiempoTranscurrido = minutos - minutosEl;
            var dif = parseInt(e.tiempoEstimado) - tiempoTranscurrido;
            var horasFal = 0;
            while (dif > 59) {
                horasFal++;
                dif = dif - 60;
            }
            return "Faltan " + horasFal + " horas y " + dif + " minutos";
        };
        usuario.prototype.getPedidos = function (callback) {
            var _this = this;
            this.server.getPedidos(function (ped) {
                _this.pedidosHand = laComanda.pedidosHandler.parse(JSON.parse(ped));
                if (callback != undefined) {
                    callback(_this.currentPedido);
                }
            });
        };
        usuario.prototype.actualizar = function () {
            this.getPedidos(this.mostrarPedido.bind(this));
        };
        return usuario;
    }());
    laComanda.usuario = usuario;
})(laComanda || (laComanda = {}));
var usrObj;
window.onload = function () {
    usrObj = new laComanda.usuario();
};
function validateDatosMesa() {
    usrObj.validateDatosMesa();
}
function actualizar() {
    usrObj.actualizar();
}
