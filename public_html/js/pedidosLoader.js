"use strict";
///<reference path="../node_modules/@types/jquery/index.d.ts"/>
///<reference path="./model/pedidosHandler.ts"/>
///<reference path="./server.ts"/>
var laComanda;
(function (laComanda) {
    var pedidosLoader = /** @class */ (function () {
        function pedidosLoader() {
            this.server = new laComanda.server();
            this.elementsIndex = 1;
            this.pedidosHand = new laComanda.pedidosHandler();
            this.getPedidos();
        }
        pedidosLoader.prototype.addElemento = function () {
            var newElement = '';
            newElement += '<div class="form-row pedido-elemento mt-1" id="form-row-' + this.elementsIndex + '">';
            newElement += '<div class="col-7">';
            newElement += '<select class="form-control" id="select-' + this.elementsIndex + '" onchange="setPrecio()">';
            newElement += '<option>Vino tinto</option>';
            newElement += '<option>Vino blanco</option>';
            newElement += '<option>Cerveza rubia</option>';
            newElement += '<option>Cerveza negra</option>';
            newElement += '<option>Empanada</option>';
            newElement += '<option>Tarta</option>';
            newElement += '<option>Alfajor</option>';
            newElement += '<option>Torta</option>';
            newElement += '</select>';
            newElement += '<div class="invalid-feedback" id="errorEl-' + this.elementsIndex + '">El tipo de elemento seleccionado es invalid</div>';
            newElement += '</div>';
            newElement += '<div class="col-3">';
            newElement += '<input type="number" id="num-' + this.elementsIndex + '" required class="form-control" placeholder="Cantidad" oninput="setPrecio()">';
            newElement += '<div class="invalid-feedback" id="errorNum-' + this.elementsIndex + '">Indique el número</div>';
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
        pedidosLoader.prototype.setPrecio = function () {
            var newPrecio = this.getPrecio().toString();
            $('#precio-form').html(newPrecio);
        };
        pedidosLoader.prototype.getPrecio = function () {
            var precio = 0;
            var htmlElementos = $('.pedido-elemento');
            for (var i = 0; i < htmlElementos.length; i++) {
                var index = htmlElementos[i].id.replace('form-row-', '');
                var nombre = $('#select-' + index).val();
                var cantidad = $('#num-' + index).val();
                var precioUnidad = 0;
                if (cantidad != null && cantidad != 0) {
                    switch (nombre) {
                        case 'Vino tinto':
                            precioUnidad = 25;
                            break;
                        case 'Vino blanco':
                            precioUnidad = 20;
                            break;
                        case 'Cerveza rubia':
                        case 'Cerveza negra':
                            precioUnidad = 15;
                        case 'Tarta':
                        case 'Torta':
                            precioUnidad = 10;
                        case 'Empanada':
                        case 'Alfajor':
                            precioUnidad = 5;
                    }
                    precio += precioUnidad * Number(cantidad);
                }
            }
            return precio;
        };
        pedidosLoader.prototype.cargarPedido = function () {
            var _this = this;
            if (this.validatePedido()) {
                var htmlElementos = $('.pedido-elemento');
                var elementos = new Array();
                for (var i = 0; i < htmlElementos.length; i++) {
                    var index = htmlElementos[i].id.replace('form-row-', '');
                    var nombre = $('#select-' + index).val();
                    var cantidad = $('#num-' + index).val();
                    elementos.push(new laComanda.elemento(nombre, cantidad));
                }
                var nroMesa = $('#numeroMesa').val();
                var nombreCliente = $('#nombreCliente').val();
                this.pedidosHand.agregarPedido(nroMesa, nombreCliente, this.getPrecio(), elementos);
                var pedidosJson = JSON.stringify(this.pedidosHand);
                this.server.setPedidos(pedidosJson, function (rt) {
                    $("#pedidos-modal").modal('toggle');
                    _this.resetForm();
                });
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
                var index = elementos[i].id.replace('form-row-', '');
                var select = $('#select-' + index).val();
                if (select == null || select == '') {
                    isValid = false;
                    $('#errorEl-' + index).css('display', 'block');
                }
                else {
                    $('#errorEl-' + index).css('display', 'none');
                }
                var cantidad = $('#num-' + index).val();
                if (cantidad == null || cantidad == '' || Number(cantidad) <= 0) {
                    isValid = false;
                    $('#errorNum-' + index).css('display', 'block');
                }
                else {
                    $('#errorNum-' + index).css('display', 'none');
                }
            }
            return isValid;
        };
        pedidosLoader.prototype.resetForm = function () {
            this.elementsIndex = 0;
            var elementos = $('.pedido-elemento');
            for (var i = 0; i < elementos.length; i++) {
                elementos[i].remove();
            }
            this.addElemento();
            $('#numeroMesa').val('1');
            $('#numeroMesaError').css('display', 'none');
            $('#nombreCliente').val('');
            $('#nombreClienteError').css('display', 'none');
        };
        pedidosLoader.prototype.getPedidos = function () {
            var _this = this;
            this.server.getPedidos(function (ped) {
                _this.pedidosHand = laComanda.pedidosHandler.parse(JSON.parse(ped));
            });
        };
        return pedidosLoader;
    }());
    laComanda.pedidosLoader = pedidosLoader;
})(laComanda || (laComanda = {}));
var plObj;
window.onload = function () {
    plObj = new laComanda.pedidosLoader();
};
function setPrecio() {
    plObj.setPrecio();
}
function addElemento() {
    plObj.addElemento();
}
function removeElemento(index) {
    plObj.removeElemento(index);
}
function cargarPedido() {
    plObj.cargarPedido();
}
function resetForm() {
    plObj.resetForm();
}
