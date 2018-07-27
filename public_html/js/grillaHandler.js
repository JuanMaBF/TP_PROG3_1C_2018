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
            this.tipoUsuario = localStorage.getItem('user');
            this.getPedidos();
        }
        grillaHandler.prototype.getPedidos = function () {
            var _this = this;
            this.server.getPedidos(function (ped) {
                _this.pedidosHand = laComanda.pedidosHandler.parse(JSON.parse(ped));
                _this.initGrilla();
            });
        };
        grillaHandler.prototype.initGrilla = function () {
            if (this.tipoUsuario == 'mozo' || this.tipoUsuario == 'socio') {
                $('#agregar-pedido-btn').css('display', 'block');
            }
            else {
                if (this.tipoUsuario == 'bartender' || this.tipoUsuario == 'cerveceros') {
                    $('.cocina-only').css('display', 'none');
                }
                this.loadGrillaCocineros();
            }
        };
        grillaHandler.prototype.loadGrillaCocineros = function () {
            var filter = $("#select-filter").val();
            var elementos = this.getFiltredElementos();
            if (filter == "Activos") {
                elementos = elementos.filter(function (e) { return e.estado != "Terminado"; });
            }
            else if (filter != "Todos") {
                elementos = elementos.filter(function (e) { return e.estado == filter; });
            }
            var newHtml = "\n                <thead>\n                    <tr>\n                    <th scope=\"col\">Pedido</th>\n                    <th scope=\"col\">Cantidad</th>\n                    <th scope=\"col\">Estado</th>\n                    </tr>\n                </thead>\n                <tbody>";
            elementos.forEach(function (el) {
                var pendienteSel = el.estado == "Pendiente" ? 'selected' : '';
                var preparacionSel = el.estado == "En preparación" ? 'selected' : '';
                var listoSel = el.estado == "Listo para servir" ? 'selected' : '';
                var terminasoSel = el.estado == "Terminado" ? 'selected' : '';
                newHtml += "\n                    <tr>\n                        <td>" + el.nombre + "</td>\n                        <td>" + el.cantidad + "</td>\n                        <td>\n                            <select id=\"select-" + el.pedidoId + "-" + el.index + "\" class=\"form-control\" \n                            onchange=\"updateEstado('" + el.pedidoId + "', " + el.index + ")\">\n                                <option " + pendienteSel + ">Pendiente</option>\n                                <option " + preparacionSel + " class=\"enPreparacion\">En preparaci\u00F3n</option>\n                                <option " + listoSel + ">Listo para servir</option>\n                                <option " + terminasoSel + ">Terminado</option>\n                            </select>\n                        </td>\n                    </tr>";
            });
            newHtml += "</tbody>";
            $("#tabla-pedidos").html(newHtml);
            if (this.tipoUsuario == 'bartender' || this.tipoUsuario == 'cerveceros') {
                $('.enPreparacion').css('display', 'none');
            }
        };
        grillaHandler.prototype.getFiltredElementos = function () {
            var elementosList = new Array();
            var listaNombres = new Array();
            if (this.tipoUsuario = 'bartender') {
                listaNombres.push('Vino tinto');
                listaNombres.push('Vino blanco');
            }
            else if (this.tipoUsuario = 'cerveceros') {
                listaNombres.push('Cerveza rubia');
                listaNombres.push('Cerveza negra');
            }
            else if (this.tipoUsuario = 'cocineroCocina') {
                listaNombres.push('Tarta');
                listaNombres.push('Empanada');
            }
            else if (this.tipoUsuario = 'cocineroPostres') {
                listaNombres.push('Torta');
                listaNombres.push('Alfajor');
            }
            this.pedidosHand.pedidos.forEach(function (ped) {
                ped.elementos.filter(function (el) { return listaNombres.indexOf(el.nombre) > -1; }).forEach(function (e) {
                    e.index = ped.elementos.indexOf(e);
                    elementosList.push(e);
                });
            });
            return elementosList;
        };
        grillaHandler.prototype.updateEstado = function (id, index) {
            var newEstado = $("#select-" + id + "-" + index).val();
            this.pedidosHand.pedidos.filter(function (p) { return p.id == id; })[0].elementos[index].estado = newEstado;
            this.server.setPedidos(JSON.stringify(this.pedidosHand), function () {
                //this.reloadGrilla();
            });
        };
        return grillaHandler;
    }());
    laComanda.grillaHandler = grillaHandler;
})(laComanda || (laComanda = {}));
function updateEstado(id, index) {
    grillaObj.updateEstado(id, index);
}
function initGrilla() {
    grillaObj.initGrilla();
}
function getPedidos() {
    grillaObj.getPedidos();
}
