"use strict";
///<reference path="../node_modules/@types/jquery/index.d.ts"/>
///<reference path="./server.ts"/>
var pedidosLoader;
(function (pedidosLoader_1) {
    var pedidosLoader = /** @class */ (function () {
        function pedidosLoader() {
            this.server = new server.server();
            this.elementsIndex = 1;
        }
        pedidosLoader.prototype.addElemento = function () {
            var newElement = '';
            newElement += '<div class="form-row pedido-elemento mt-1" id="form-row-' + this.elementsIndex + '">';
            newElement += '<div class="col-7">';
            newElement += '<select class="form-control">';
            newElement += '<option>Vino tinto</option>';
            newElement += '<option>Vino blanco</option>';
            newElement += '<option>Cerveza rubia</option>';
            newElement += '<option>Cerveza negra</option>';
            newElement += '<option>Empanada</option>';
            newElement += '<option>Tarta</option>';
            newElement += '<option>Alfajor</option>';
            newElement += '<option>Torta</option>';
            newElement += '</select>';
            newElement += '</div>';
            newElement += '<div class="col-3">';
            newElement += '<input type="number" class="form-control" placeholder="Cantidad">';
            newElement += '</div>';
            newElement += '<div class="col col-2">';
            newElement += '<button type="button" class="btn btn-secondary" onclick="removeElemento(' + this.elementsIndex + ')">X</button>';
            newElement += '</div>';
            newElement += '</div>';
            $('#lista-elementos').append(newElement);
            this.elementsIndex++;
        };
        pedidosLoader.prototype.removeElemento = function (index) {
            $('#form-row-' + index).remove();
        };
        pedidosLoader.prototype.cargarPedido = function () {
            if (this.validatePedido()) {
                var data = {
                    "action": "test"
                };
                this.server.connection(data, function (rta) {
                    alert(rta);
                });
                this.elementsIndex = 0;
                var elementos = $('.pedido-elemento');
                for (var i = 0; i < elementos.length; i++) {
                    elementos[i].remove();
                }
                this.addElemento();
            }
        };
        pedidosLoader.prototype.validatePedido = function () {
            var isValid = true;
            var nroMesa = $('#numeroMesa').val();
            if (nroMesa == null || nroMesa == '') {
                isValid = false;
                $('#numeroMesaError').css('display', 'block');
            }
            else {
                $('#numeroMesaError').css('display', 'none');
            }
            var nombreCliente = $('#nombreCliente').val();
            if (nombreCliente == null || nombreCliente == '') {
                isValid = false;
                $('#nombreClienteError').css('display', 'block');
            }
            else {
                $('#nombreClienteError').css('display', 'none');
            }
            var elementos = $('.pedido-elemento');
            for (var i = 0; i < elementos.length; i++) {
                elementos[i].remove();
            }
            return isValid;
        };
        return pedidosLoader;
    }());
    pedidosLoader_1.pedidosLoader = pedidosLoader;
})(pedidosLoader || (pedidosLoader = {}));
var plObj;
window.onload = function () {
    plObj = new pedidosLoader.pedidosLoader();
};
function cargarPedido() {
    plObj.cargarPedido();
}
function addElemento() {
    plObj.addElemento();
}
function removeElemento(index) {
    plObj.removeElemento(index);
}
