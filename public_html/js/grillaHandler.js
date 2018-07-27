"use strict";
///<reference path="../node_modules/@types/jquery/index.d.ts"/>
///<reference path="./model/pedidosHandler.ts"/>
///<reference path="./server.ts"/>
var laComanda;
(function (laComanda) {
    var grillaHandler = /** @class */ (function () {
        function grillaHandler() {
            this.server = new laComanda.server();
            this.tipoUsuario = localStorage.getItem('tipoUser');
            this.username = localStorage.getItem('tipoUser');
            this.pedidosHand = new laComanda.pedidosHandler();
            this.getPedidos();
            this.mesas = new laComanda.lasMesas();
        }
        grillaHandler.prototype.getPedidos = function () {
            var _this = this;
            this.server.getPedidos(function (ped) {
                _this.pedidosHand = laComanda.pedidosHandler.parse(JSON.parse(ped));
                _this.initGrilla();
            });
        };
        grillaHandler.prototype.initGrilla = function () {
            var _this = this;
            if (this.tipoUsuario == 'mozo' || this.tipoUsuario == 'socio') {
                $('#agregar-pedido-btn').css('display', 'block');
                this.server.getMesas(function (mes) {
                    _this.mesas = laComanda.lasMesas.parse(JSON.parse(mes));
                    _this.loadGrillaMesas();
                });
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
                newHtml += "\n                    <tr>\n                        <td>" + el.nombre + "</td>\n                        <td>" + el.cantidad + "</td>\n                        <td>\n                            <select id=\"select-" + el.pedidoId + "-" + el.index + "\" class=\"form-control\" \n                            onchange=\"updateEstado('" + el.pedidoId + "', " + el.index + ")\">\n                                <option " + pendienteSel + ">Pendiente</option>\n                                <option " + preparacionSel + ">En preparaci\u00F3n</option>\n                                <option " + listoSel + ">Listo para servir</option>\n                                <option " + terminasoSel + ">Terminado</option>\n                            </select>\n                        </td>\n                    </tr>";
            });
            newHtml += "</tbody>";
            $("#tabla-pedidos").html(newHtml);
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
            this.pedidosHand.pedidos.filter(function (p) { return p.id == id; })[0].elementos[index].tomadoPor = this.username;
            this.updateEstadoPedido(this.pedidosHand.pedidos.filter(function (p) { return p.id == id; })[0]);
            this.server.setPedidos(JSON.stringify(this.pedidosHand), function () { });
        };
        grillaHandler.prototype.updateEstadoPedido = function (ped) {
            var isPendiente = !ped.elementos.some(function (e) { return e.estado != 'Pendiente'; });
            var isEnPrep = !ped.elementos.some(function (e) { return e.estado != 'En preparación'; });
            var isListo = !ped.elementos.some(function (e) { return e.estado != 'Listo para servir'; });
            var isTer = !ped.elementos.some(function (e) { return e.estado != 'Terminado'; });
            if (isPendiente) {
                ped.estado = 'Pendiente';
            }
            else if (isEnPrep) {
                ped.estado = 'En preparación';
            }
            else if (isListo) {
                ped.estado = 'Listo para servir';
            }
            else if (isTer) {
                ped.estado = 'Terminado';
            }
        };
        grillaHandler.prototype.loadGrillaMesas = function () {
            var newHtml = "\n                <thead>\n                    <tr>\n                        <th scope=\"col\">Numero de mesa</th>\n                        <th scope=\"col\">Estado</th>\n                        <th scope=\"col\">Detalles</th>\n                    </tr>\n                </thead>\n                <tbody>";
            this.mesas.mesas.forEach(function (m) {
                var espEst = m.estado == "Con cliente esperando pedido" ? 'selected' : '';
                var comEst = m.estado == "Con clientes comiendo" ? 'selected' : '';
                var pagEst = m.estado == "Con clientes pagando" ? 'selected' : '';
                var cerrEst = m.estado == "Cerrada" ? 'selected' : '';
                newHtml += "\n                    <tr>\n                        <th>" + m.numero + "</th>\n                        <th>\n                            <select onchange=\"cambiarEstadoMesa('" + m.numero + "')\" \n                            class=\"form-control\" id=\"estado-mesa-" + m.numero + "\">\n                                <option " + espEst + ">Con cliente esperando pedido</option>\n                                <option " + comEst + ">Con clientes comiendo</option>\n                                <option " + pagEst + ">Con clientes pagando</option>\n                                <option " + cerrEst + ">Cerrada</option>\n                            </select>\n                        </th>\n                        <th>\n                            <button class=\"btn btn-secondary\" data-toggle=\"modal\" data-target=\"#mesaModal\"\n                            onclick=\"loadMesaModalData('" + m.numero + "=')\">\n                                Ver\n                            </button>\n                        </th>\n                    </tr>";
            });
            newHtml += '</tbody>';
            $("#tabla-pedidos").html(newHtml);
        };
        grillaHandler.prototype.loadMesaModalData = function (numero) {
        };
        grillaHandler.prototype.cambiarEstadoMesa = function (numero) {
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
function loadMesaModalData(numero) {
    grillaObj.loadMesaModalData(numero);
}
function cambiarEstadoMesa(numero) {
    grillaObj.cambiarEstadoMesa(numero);
}
