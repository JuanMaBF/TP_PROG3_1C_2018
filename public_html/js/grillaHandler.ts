"use strict";
///<reference path="../node_modules/@types/jquery/index.d.ts"/>
///<reference path="./model/pedidosHandler.ts"/>
///<reference path="./server.ts"/>

namespace laComanda {
    export class grillaHandler {

        private server : server;
        private pedidosHand: pedidosHandler;
        public tipoUsuario: string;
        public username: string;
        public mesas: lasMesas;

        public constructor() {
            this.server = new server();
            this.tipoUsuario = localStorage.getItem('tipoUser') as string;
            this.username = localStorage.getItem('tipoUser') as string;
            this.pedidosHand = new pedidosHandler();
            this.mesas = new lasMesas();
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
                this.server.getMesas((mes: string) => { 
                    this.mesas = lasMesas.parse(JSON.parse(mes));                    
                    this.loadGrillaMesas();
                });
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
                                <option `+preparacionSel+`>En preparación</option>
                                <option `+listoSel+`>Listo para servir</option>
                                <option `+terminasoSel+`>Terminado</option>
                            </select>
                        </td>
                    </tr>`;
            });
            newHtml += "</tbody>";
            $("#tabla-pedidos").html(newHtml);
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
            this.pedidosHand.pedidos.filter(p => p.id == id)[0].elementos[index].tomadoPor = this.username;
            this.updateEstadoPedido(this.pedidosHand.pedidos.filter(p => p.id == id)[0]);
            this.server.setPedidos(JSON.stringify(this.pedidosHand), () => {});
        }

        public updateEstadoPedido(ped: pedido) {
            let isPendiente = !ped.elementos.some(e => e.estado != 'Pendiente');
            let isEnPrep = !ped.elementos.some(e => e.estado != 'En preparación');
            let isListo = !ped.elementos.some(e => e.estado != 'Listo para servir');
            let isTer = !ped.elementos.some(e => e.estado != 'Terminado');
            if(isPendiente) {
                ped.estado = 'Pendiente';
            } else if (isEnPrep) {
                ped.estado = 'En preparación';
            } else if (isListo) {
                ped.estado = 'Listo para servir';
            } else if (isTer) {
                ped.estado = 'Terminado';
            }
        }

        public loadGrillaMesas(): void {
            let newHtml = `
                <thead>
                    <tr>
                        <th scope="col col-2">Mesa</th>
                        <th scope="col col-7">Estado</th>
                        <th scope="col col-3">Detalles</th>
                    </tr>
                </thead>
                <tbody>`;
            this.mesas.mesas.forEach(m => {
                let espEst = m.estado == "Con cliente esperando pedido" ? 'selected' : '';
                let comEst = m.estado == "Con clientes comiendo" ? 'selected' : '';
                let pagEst = m.estado == "Con clientes pagando" ? 'selected' : '';
                let cerrEst = m.estado == "Cerrada" ? 'selected' : '';
                newHtml += `
                    <tr>
                        <th>`+m.numero+`</th>
                        <th>
                            <select onchange="cambiarEstadoMesa('`+m.numero+`')" 
                            class="form-control" id="estado-mesa-`+m.numero+`">
                                <option `+espEst+`>Con cliente esperando pedido</option>
                                <option `+comEst+`>Con clientes comiendo</option>
                                <option `+pagEst+`>Con clientes pagando</option>
                                <option `+cerrEst+`>Cerrada</option>
                            </select>
                        </th>
                        <th>
                            <button class="btn btn-secondary" data-toggle="modal" data-target="#mesaModal"
                            onclick="loadMesaModalData('`+m.numero+`')">
                                Ver
                            </button>
                        </th>
                    </tr>`;
            });
            newHtml += '</tbody>';       
            $("#tabla-pedidos").html(newHtml);                 
        }

        public cambiarEstadoMesa(numero: string): void {
            let newEstado = $("#estado-mesa-"+numero).val() as string;
            this.mesas.mesas.filter(m => m.numero == numero)[0].estado = newEstado;
            this.server.setMesas(JSON.stringify(this.mesas), () => {});
        }

        public loadMesaModalData(numero: string): void {
            let newHtml = '';
            this.pedidosHand.pedidos.filter(p => p.numeroMesa.toString() == numero).forEach(p => {
                let precioTotal = 0;
                p.elementos.forEach(e => precioTotal += this.getPrecioElemento(e.nombre, e.cantidad));
                newHtml += `
                <h3>Pedido `+p.id+` ($`+precioTotal+`)</h3>
                <table id="tabla-modal" class="table mt-3">
                <thead>
                    <tr>
                        <th scope="col">Pedido</th>
                        <th scope="col">Estado</th>
                        <th scope="col">Tomado por</th>
                        <th scope="col">Precio</th>
                    </tr>
                </thead>
                <tbody>`;

                p.elementos.forEach(e => {
                    newHtml += `
                        <tr>
                            <th>`+e.nombre+` (`+e.cantidad+`)</th>
                            <th>`+e.estado+`</th>
                            <th>`+e.tomadoPor+`</th>
                            <th>$`+this.getPrecioElemento(e.nombre, e.cantidad)+`</th>
                        </tr>`
                });
                newHtml += '</tbody>';
            });
            newHtml += '</table>';
            $("#modal-tables").html(newHtml);
        }

        public getPrecioElemento(nombre: string, cantidad: number) {
            let precioUnidad = 0;
            switch(nombre) {
                case 'Vino tinto':
                    precioUnidad = 25;
                    break
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
            return precioUnidad*cantidad;
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

function loadMesaModalData(numero: string) {
    grillaObj.loadMesaModalData(numero);
}

function cambiarEstadoMesa(numero: string) {
    grillaObj.cambiarEstadoMesa(numero);
}
