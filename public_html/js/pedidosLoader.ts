"use strict";
///<reference path="../node_modules/@types/jquery/index.d.ts"/>
///<reference path="./model/pedidosHandler.ts"/>
///<reference path="./model/grillaHandler.ts"/>
///<reference path="./server.ts"/>

namespace laComanda {

    export class pedidosLoader {

        private server : server;
        private pedidosHand: pedidosHandler;
        private elementsIndex: number;
        public username: string;

        public constructor() {
            this.server = new server();
            this.elementsIndex = 1;
            this.pedidosHand = new pedidosHandler();
            this.username = localStorage.getItem('tipoUser') as string;
            this.getPedidos();
        }

        public addElemento(): void {
            let newElement = '';
            newElement += '<div class="form-row pedido-elemento mt-1" id="form-row-'+ this.elementsIndex +'">';
            newElement += '<div class="col-7">';
            newElement += '<select class="form-control" id="select-'+ this.elementsIndex +'" onchange="setPrecio()">';
            newElement += '<option>Vino tinto</option>';
            newElement += '<option>Vino blanco</option>';
            newElement += '<option>Cerveza rubia</option>';
            newElement += '<option>Cerveza negra</option>';
            newElement += '<option>Empanada</option>';
            newElement += '<option>Tarta</option>';
            newElement += '<option>Alfajor</option>';
            newElement += '<option>Torta</option>';
            newElement += '</select>';
            newElement += '<div class="invalid-feedback" id="errorEl-'+ this.elementsIndex +'">El tipo de elemento seleccionado es invalid</div>';
            newElement += '</div>';
            newElement += '<div class="col-3">';
            newElement += '<input type="number" id="num-'+ this.elementsIndex +'" required class="form-control" placeholder="Cantidad" oninput="setPrecio()">';
            newElement += '<div class="invalid-feedback" id="errorNum-'+ this.elementsIndex +'">Indique el número</div>';
            newElement += '</div>';
            newElement += '<div class="col col-2">';
            newElement += '<button type="button" class="btn btn-secondary" onclick="removeElemento('+ this.elementsIndex +')">X</button>';
            newElement += '</div>';
            newElement += '</div>';
            $('#lista-elementos').append(newElement);
            this.elementsIndex++;
        }

        public removeElemento(index:number): void {
            $('#form-row-'+index).remove();
        }

        public setPrecio(): void {
            let newPrecio = this.getPrecio().toString();
            $('#precio-form').html(newPrecio);
        }

        private getPrecio(): number {
            let precio = 0;
            let htmlElementos = $('.pedido-elemento');
            for(let i=0; i < htmlElementos.length; i++) {
                let index = htmlElementos[i].id.replace('form-row-', '');
                let nombre = $('#select-'+index).val() as string;
                let cantidad = $('#num-'+index).val() as number;
                let precioUnidad: number = 0;
                if(cantidad != null && cantidad != 0) {
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
                    precio += precioUnidad*Number(cantidad);
                }
            }
            return precio;
        }

        public cargarPedido(): void {
            if(this.validatePedido()) {
                let htmlElementos = $('.pedido-elemento');
                let elementos = new Array<elemento>();
                for(let i=0; i < htmlElementos.length; i++) {
                    let index = htmlElementos[i].id.replace('form-row-', '');
                    let nombre = $('#select-'+index).val() as string;
                    let cantidad = $('#num-'+index).val() as number;
                    elementos.push(new elemento(nombre, cantidad));
                    elementos[elementos.length-1].tomadoPor = 'Sin tomar';
                }
                let nroMesa = $('#numeroMesa').val() as number;
                let nombreCliente = $('#nombreCliente').val() as string;
                this.pedidosHand.agregarPedido(nroMesa, nombreCliente, this.getPrecio(), elementos);
                let pedidosJson = JSON.stringify(this.pedidosHand);
                this.server.setPedidos(pedidosJson, (rt: any) => {
                    $("#pedidos-modal").modal('toggle');
                    this.resetForm();
                });
            }
        }

        private validatePedido(): boolean {
            let isValid = true;
            let nroMesa = $('#numeroMesa').val();
            if(nroMesa == null || nroMesa == '') {
                isValid = false;
                $('#numeroMesaError').css('display', 'block');
            } else {
                $('#numeroMesaError').css('display', 'none');
            }

            let nombreCliente = $('#nombreCliente').val();
            if(nombreCliente == null || nombreCliente == '') {
                isValid = false;
                $('#nombreClienteError').css('display', 'block');
            } else {
                $('#nombreClienteError').css('display', 'none');
            }

            let elementos = $('.pedido-elemento');
            for(let i=0; i < elementos.length; i++) {
                let index = elementos[i].id.replace('form-row-', '');
                let select = $('#select-'+index).val();
                if(select == null || select == '') {
                    isValid = false;
                    $('#errorEl-'+index).css('display', 'block');
                } else {
                    $('#errorEl-'+index).css('display', 'none');
                }
                let cantidad = $('#num-'+index).val();
                if(cantidad == null || cantidad == '' || Number(cantidad) <= 0) {
                    isValid = false;
                    $('#errorNum-'+index).css('display', 'block');
                } else {
                    $('#errorNum-'+index).css('display', 'none');
                }
            }
            return isValid;
        }

        public resetForm(): void {
            this.elementsIndex = 0;
            let elementos = $('.pedido-elemento');
            for(let i=0; i < elementos.length; i++) {
                elementos[i].remove();
            }
            this.addElemento();
            $('#numeroMesa').val('1');
            $('#numeroMesaError').css('display', 'none');
            $('#nombreCliente').val('');
            $('#nombreClienteError').css('display', 'none');
        }

        private getPedidos() {
            this.server.getPedidos((ped: string) => { 
                this.pedidosHand = pedidosHandler.parse(JSON.parse(ped));
            });
        }

    }

}

var plObj: laComanda.pedidosLoader;
var grillaObj: laComanda.grillaHandler;

window.onload = function() {
    plObj = new laComanda.pedidosLoader();
    grillaObj = new laComanda.grillaHandler();
};

function setPrecio() {
    plObj.setPrecio();
}

function addElemento() { 
    plObj.addElemento(); 
}

function removeElemento(index: number) {
    plObj.removeElemento(index);
}

function cargarPedido() {
    plObj.cargarPedido(); 
}

function resetForm() {
    plObj.resetForm();
}
