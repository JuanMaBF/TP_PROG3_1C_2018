"use strict";
var laComanda;
(function (laComanda) {
    var pedidosHandler = /** @class */ (function () {
        function pedidosHandler() {
            this.pedidos = new Array();
        }
        pedidosHandler.prototype.agregarPedido = function (numeroMesa, nombreCliente, precio, elementos) {
            var id = '';
            var caracteres = this.pedidos.length.toString().length;
            for (var i = 0; i < 5 - caracteres; i++) {
                id = id + '0';
            }
            id += this.pedidos.length.toString();
            var newPedido = new pedido(id, numeroMesa, nombreCliente, 'Pendiente', precio, elementos);
            this.pedidos.push(newPedido);
        };
        pedidosHandler.parse = function (json) {
            var pedHan;
            var pedidos = new Array();
            json['pedidos'].forEach(function (ped) {
                pedidos.push(pedido.parse(ped));
            });
            pedHan = new pedidosHandler();
            pedHan.pedidos = pedidos;
            return pedHan;
        };
        return pedidosHandler;
    }());
    laComanda.pedidosHandler = pedidosHandler;
    var pedido = /** @class */ (function () {
        function pedido(id, numeroMesa, nombreCliente, estado, precio, elementos) {
            this.id = id;
            this.numeroMesa = numeroMesa;
            this.nombreCliente = nombreCliente;
            this.estado = estado;
            this.precio = precio;
            this.elementos = elementos != null ? elementos : new Array();
        }
        pedido.parse = function (json) {
            var ped;
            var id = json['id'];
            var numeroMesa = json['id'];
            var nombreCliente = json['id'];
            var estado = json['id'];
            var precio = json['id'];
            var elementos = new Array();
            json['elementos'].forEach(function (el) {
                elementos.push(elemento.parse(el));
            });
            ped = new pedido(id, numeroMesa, nombreCliente, estado, precio, elementos);
            return ped;
        };
        return pedido;
    }());
    laComanda.pedido = pedido;
    var elemento = /** @class */ (function () {
        function elemento(nombre, cantidad) {
            this.nombre = nombre;
            this.cantidad = cantidad;
            this.estado = 'Pendiente';
        }
        elemento.parse = function (json) {
            var el;
            var nombre = json['nombre'];
            var cantidad = json['cantidad'];
            el = new elemento(nombre, cantidad);
            el.estado = json['estado'];
            return el;
        };
        return elemento;
    }());
    laComanda.elemento = elemento;
})(laComanda || (laComanda = {}));
