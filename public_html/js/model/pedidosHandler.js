"use strict";
var laComanda;
(function (laComanda) {
    var pedidosHandler = /** @class */ (function () {
        function pedidosHandler() {
            this.pedidos = new Array();
        }
        pedidosHandler.prototype.agregarPedido = function (numeroMesa, nombreCliente, precio, elementos) {
            var id = '';
            if (this != null) {
                var caracteres = this.pedidos.length.toString().length;
                for (var i = 0; i < 5 - caracteres; i++) {
                    id = id + '0';
                }
                id += this.pedidos.length.toString();
                var newPedido = new pedido(id, numeroMesa, nombreCliente, 'Pendiente', precio, elementos);
                if (elementos != null) {
                    elementos.forEach(function (el) { return el.pedidoId = id; });
                }
                this.pedidos.push(newPedido);
            }
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
            var numeroMesa = json['numeroMesa'];
            var nombreCliente = json['nombreCliente'];
            var estado = json['estado'];
            var precio = json['precio'];
            var elementos = new Array();
            json['elementos'].forEach(function (el) {
                elementos.push(elemento.parse(el));
            });
            ped = new pedido(id, numeroMesa, nombreCliente, estado, precio, elementos);
            elementos.forEach(function (el) { return el.pedidoId = id; });
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
            this.pedidoId = '';
            this.index = 0;
            this.tomadoPor = '';
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
    var lasMesas = /** @class */ (function () {
        function lasMesas() {
            this.mesas = new Array();
            this.mesas.push(new mesa('1'));
            this.mesas.push(new mesa('2'));
            this.mesas.push(new mesa('3'));
            this.mesas.push(new mesa('4'));
            this.mesas.push(new mesa('5'));
        }
        lasMesas.parse = function (json) {
            var lm = new lasMesas();
            lm.mesas = new Array();
            json['mesas'].forEach(function (mes) {
                lm.mesas.push(mesa.parse(mes));
            });
            return lm;
        };
        return lasMesas;
    }());
    laComanda.lasMesas = lasMesas;
    var mesa = /** @class */ (function () {
        function mesa(numero) {
            this.numero = numero;
            this.estado = 'Con cliente esperando pedido';
        }
        mesa.parse = function (json) {
            var mes = new mesa(json['numero']);
            mes.estado = json['estado'];
            return mes;
        };
        return mesa;
    }());
    laComanda.mesa = mesa;
})(laComanda || (laComanda = {}));
