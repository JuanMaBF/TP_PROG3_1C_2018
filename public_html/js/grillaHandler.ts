"use strict";
///<reference path="../node_modules/@types/jquery/index.d.ts"/>
///<reference path="./model/pedidosHandler.ts"/>
///<reference path="./server.ts"/>

namespace laComanda {
    export class grillaHandler {

        private server : server;
        private pedidosHand: pedidosHandler;
        public tipoUsuario: string;

        public constructor() {
            this.server = new server();
            this.pedidosHand = new pedidosHandler();
            this.tipoUsuario = localStorage.getItem('user') as string;
            this.getPedidos();
            this.initGrilla();
        }

        private getPedidos() {
            this.server.getPedidos((ped: string) => { 
                this.pedidosHand = pedidosHandler.parse(JSON.parse(ped));
            });
        }

        private initGrilla() {
            if(this.tipoUsuario == 'mozo' || this.tipoUsuario == 'socio') {
                $('#agregar-pedido-btn').css('display', 'block');
            } else {
                if(this.tipoUsuario == 'bartender' || this.tipoUsuario == 'cerveceros') {
                    $('.cocina-only').css('display', 'none');
                }
                this.loadGrillaCocineros();
            }
        }

        public reloadGrilla(): void {
            if(this.tipoUsuario == 'mozo' || this.tipoUsuario == 'socio') {

            } else {
                this.loadGrillaCocineros();
            }
        }

        public loadGrillaCocineros(): void {
            let elementos = this.getFiltredElementos().filter(e => e.estado != 'Terminado');
            let newHtml = `
                <thead>
                    <tr>
                    <th scope="col">Pedido</th>
                    <th scope="col">Cantidad</th>
                    <th scope="col">Estado</th>
                    </tr>
                </thead>
                <tbody>`;
            elementos.forEach(el => {
                let pendienteSel = el.estado == "Pendiente" ? 'selected' : '';
                let preparacionSel = el.estado == "En preparación" ? 'selected' : '';
                let listoSel = el.estado == "Listo para servir" ? 'selected' : '';
                let terminasoSel = el.estado == "Terminado" ? 'selected' : '';
                newHtml += `
                    <tr>
                        <td>` + el.nombre + `</td>
                        <td>` + el.cantidad + `</td>
                        <td>
                            <select class="form-control">
                                <option `+pendienteSel+`>Pendiente</option>
                                <option `+preparacionSel+` class="enPreparacion">En preparación</option>
                                <option `+listoSel+`>Listo para servir</option>
                                <option `+terminasoSel+`>Terminado</option>
                            </select>
                        </td>
                    </tr>`;
            });
            newHtml += "</tbody>";
            $("#tabla-pedidos").html(newHtml);
            if(this.tipoUsuario == 'bartender' || this.tipoUsuario == 'cerveceros') {
                $('.enPreparacion').css('display', 'none');
            }
        }

        public getFiltredElementos(): Array<elemento> {
            let elementosList = new Array<elemento>();
            let listaNombres = new Array<string>();
            if(this.tipoUsuario = 'bartender') {
                listaNombres.push('Vino tinto');
                listaNombres.push('Vino blanco');
            } else if (this.tipoUsuario = 'cerveceros') { 
                listaNombres.push('Cerveza rubia');
                listaNombres.push('Cerveza negra');
            } else if (this.tipoUsuario = 'cocineroCocina') { 
                listaNombres.push('Tarta');
                listaNombres.push('Empanada');
            } else if (this.tipoUsuario = 'cocineroPostres') { 
                listaNombres.push('Torta');
                listaNombres.push('Alfajor');
            }
            this.pedidosHand.pedidos.forEach(ped => {
                ped.elementos.filter(el => listaNombres.indexOf(el.nombre) > -1).forEach(e => {
                    elementosList.push(e);
                });
            });
            return elementosList;
        }

    }
}