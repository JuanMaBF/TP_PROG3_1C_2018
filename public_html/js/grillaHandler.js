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
            this.username = localStorage.getItem('username');
            if (this.username == '') {
                $(location).attr('href', './login.html');
            }
            this.pedidosHand = new laComanda.pedidosHandler();
            this.mesas = new laComanda.lasMesas();
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
            var _this = this;
            if (this.tipoUsuario == 'mozo' || this.tipoUsuario == 'socio') {
                $('#agregar-pedido-btn').css('display', 'block');
                $('#select-filter').css('display', 'none');
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
            if (newEstado == "En preparación") {
                var tiempoEstimado = void 0;
                do {
                    tiempoEstimado = prompt("¿Cuantos minutos va a tardar?", "");
                } while (!tiempoEstimado.match(/^-{0,1}\d+$/));
                this.pedidosHand.pedidos.filter(function (p) { return p.id == id; })[0].elementos[index].tiempoEstimado = tiempoEstimado;
            }
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
            var newHtml = "\n                <thead>\n                    <tr>\n                        <th scope=\"col col-2\">Mesa</th>\n                        <th scope=\"col col-7\">Estado</th>\n                        <th scope=\"col col-3\">Detalles</th>\n                    </tr>\n                </thead>\n                <tbody>";
            this.mesas.mesas.forEach(function (m) {
                var espEst = m.estado == "Con cliente esperando pedido" ? 'selected' : '';
                var comEst = m.estado == "Con clientes comiendo" ? 'selected' : '';
                var pagEst = m.estado == "Con clientes pagando" ? 'selected' : '';
                var cerrEst = m.estado == "Cerrada" ? 'selected' : '';
                newHtml += "\n                    <tr>\n                        <th>" + m.numero + "</th>\n                        <th>\n                            <select onchange=\"cambiarEstadoMesa('" + m.numero + "')\" \n                            class=\"form-control\" id=\"estado-mesa-" + m.numero + "\">\n                                <option " + espEst + ">Con cliente esperando pedido</option>\n                                <option " + comEst + ">Con clientes comiendo</option>\n                                <option " + pagEst + ">Con clientes pagando</option>\n                                <option " + cerrEst + ">Cerrada</option>\n                            </select>\n                        </th>\n                        <th>\n                            <button class=\"btn btn-secondary\" data-toggle=\"modal\" data-target=\"#mesaModal\"\n                            onclick=\"loadMesaModalData('" + m.numero + "')\">\n                                Ver\n                            </button>\n                        </th>\n                    </tr>";
            });
            newHtml += '</tbody>';
            $("#tabla-pedidos").html(newHtml);
        };
        grillaHandler.prototype.cambiarEstadoMesa = function (numero) {
            var _this = this;
            var newEstado = $("#estado-mesa-" + numero).val();
            if (newEstado == "Cerrada" && this.tipoUsuario != "socio") {
                alert('Solo los socios pueden cerrar la mesa');
            }
            else {
                this.mesas.mesas.filter(function (m) { return m.numero == numero; })[0].estado = newEstado;
                if (newEstado == "Cerrada") {
                    this.pedidosHand.pedidos.filter(function (p) { return p.numeroMesa.toString() == numero; }).forEach(function (p) {
                        p.estado = "Cerrado";
                    });
                    this.server.setPedidos(JSON.stringify(this.pedidosHand), function () {
                        _this.getPedidos();
                    });
                }
                this.server.setMesas(JSON.stringify(this.mesas), function () { });
            }
        };
        grillaHandler.prototype.loadMesaModalData = function (numero) {
            var _this = this;
            var newHtml = '';
            var total = 0;
            this.pedidosHand.pedidos
                .filter(function (p) { return p.numeroMesa.toString() == numero; })
                .filter(function (p) { return p.estado != "Cerrado"; })
                .forEach(function (p) {
                var precioTotal = 0;
                p.elementos.forEach(function (e) { return precioTotal += _this.getPrecioElemento(e.nombre, e.cantidad); });
                total += precioTotal;
                newHtml += "\n                <table id=\"tabla-modal\" class=\"table mt-3\">\n                <h3>Pedido " + p.id + " ($" + precioTotal + ")</h3>\n                <thead>\n                    <tr>\n                        <th scope=\"col\">Pedido</th>\n                        <th scope=\"col\">Estado</th>\n                        <th scope=\"col\">Tomado por</th>\n                        <th scope=\"col\">Precio</th>\n                    </tr>\n                </thead>\n                <tbody>";
                p.elementos.forEach(function (e) {
                    console.log(e.tomadoPor);
                    newHtml += "\n                        <tr>\n                            <th>" + e.nombre + " (" + e.cantidad + ")</th>\n                            <th>" + e.estado + "</th>\n                            <th>" + e.tomadoPor + "</th>\n                            <th>$" + _this.getPrecioElemento(e.nombre, e.cantidad) + "</th>\n                        </tr>";
                });
                newHtml += '</tbody>';
            });
            newHtml += '</table>';
            newHtml += 'Total: $' + total;
            $("#modal-tables").html(newHtml);
        };
        grillaHandler.prototype.getPrecioElemento = function (nombre, cantidad) {
            var precioUnidad = 0;
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
            return precioUnidad * cantidad;
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
