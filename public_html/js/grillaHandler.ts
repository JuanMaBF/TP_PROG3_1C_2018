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
        }

        public getPedidos() {
            this.server.getPedidos((ped: string) => { 
                this.pedidosHand = pedidosHandler.parse(JSON.parse(ped));
                this.initGrilla();
            });
        }

        public initGrilla() {
            if(this.tipoUsuario == 'mozo' || this.tipoUsuario == 'socio') {
                $('#agregar-pedido-btn').css('display', 'block');
            } else {
                if(this.tipoUsuario == 'bartender' || this.tipoUsuario == 'cerveceros') {
                    $('.cocina-only').css('display', 'none');
                }
                this.loadGrillaCocineros();
            }
        }

        public loadGrillaCocineros(): void {
            let filter = $("#select-filter").val();
            let elementos = this.getFiltredElementos();
            if(filter == "Activos") {
                elementos = elementos.filter(e => e.estado != "Terminado");
            } else if (filter != "Todos") {
                elementos = elementos.filter(e => e.estado == filter);
            }
            
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
                            <select id="select-`+el.pedidoId+`-`+el.index+`" class="form-control" 
                            onchange="updateEstado('`+el.pedidoId+`', `+el.index+`)">
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
                    e.index = ped.elementos.indexOf(e);
                    elementosList.push(e);
                });
            });
            return elementosList;
        }

        public updateEstado(id: string, index: number) {
            let newEstado = $("#select-"+id+"-"+index).val() as string;
            this.pedidosHand.pedidos.filter(p => p.id == id)[0].elementos[index].estado = newEstado;
            this.server.setPedidos(JSON.stringify(this.pedidosHand), () => {
                //this.reloadGrilla();
            });
        }

    }
}

function updateEstado(id: string, index: number) {
    grillaObj.updateEstado(id, index);
}

function initGrilla() {
    grillaObj.initGrilla();
}

function getPedidos() {
    grillaObj.getPedidos();
}
