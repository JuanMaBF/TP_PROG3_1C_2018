"use strict";
var pedidosHandler;
(function (pedidosHandler_1) {
    var pedidosHandler = /** @class */ (function () {
        function pedidosHandler() {
            this.pedidos = new Array();
        }
        pedidosHandler.prototype.addPedido = function (numeroMesa, nombreCliente, precio) {
            var id = '';
            var caracteres = this.pedidos.length.toString().length;
            for (var i = 0; i < 5 - caracteres; i++) {
                id = id + '0';
            }
            id += this.pedidos.length.toString();
            var newPedido = new pedido(id, numeroMesa, nombreCliente, 'Pendiente', precio);
            this.pedidos.push(newPedido);
        };
        return pedidosHandler;
    }());
    pedidosHandler_1.pedidosHandler = pedidosHandler;
    var pedido = /** @class */ (function () {
        function pedido(id, numeroMesa, nombreCliente, estado, precio) {
            this.id = id;
            this.numeroMesa = numeroMesa;
            this.nombreCliente = nombreCliente;
            this.estado = estado;
            this.precio = precio;
            this.elementos = new Array();
        }
        pedido.prototype.addElemento = function (nombre) {
            this.elementos.push(new elemento(nombre, 'Pendiente'));
        };
        return pedido;
    }());
    pedidosHandler_1.pedido = pedido;
    var elemento = /** @class */ (function () {
        function elemento(nombre, estado) {
            this.nombre = nombre;
            this.estado = estado;
        }
        return elemento;
    }());
    pedidosHandler_1.elemento = elemento;
})(pedidosHandler || (pedidosHandler = {}));
