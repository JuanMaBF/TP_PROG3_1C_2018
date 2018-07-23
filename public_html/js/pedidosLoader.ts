"use strict";
///<reference path="../node_modules/@types/jquery/index.d.ts"/>
///<reference path="./server.ts"/>

namespace pedidosLoader {

    export class pedidosLoader {

        private server : server.server;
        private elementsIndex: number;

        public constructor() {
            this.server = new server.server();
            this.elementsIndex = 1;
        }

        public addElemento(): void {
            let newElement = '';
            newElement += '<div class="form-row pedido-elemento mt-1" id="form-row-'+ this.elementsIndex +'">';
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
            newElement += '<button type="button" class="btn btn-secondary" onclick="removeElemento('+ this.elementsIndex +')">X</button>';
            newElement += '</div>';
            newElement += '</div>';
            $('#lista-elementos').append(newElement);
            this.elementsIndex++;
        }

        public removeElemento(index:number): void {
            $('#form-row-'+index).remove();
        }

        public cargarPedido(): void {
            if(this.validatePedido()) {
                let data = {
                    "action": "test"
                }
                this.server.connection(data, (rta: any) => {
                    alert(rta);
                });
                this.elementsIndex = 0;
                let elementos = $('.pedido-elemento');
                for(let i=0; i < elementos.length; i++) {
                    elementos[i].remove();
                }
                this.addElemento();
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
                elementos[i].remove();
            }

            return isValid;
        }

    }

}

var plObj: pedidosLoader.pedidosLoader;

window.onload = function() {
    plObj = new pedidosLoader.pedidosLoader();
};

function cargarPedido() {
     plObj.cargarPedido(); 
}
function addElemento() { 
    plObj.addElemento(); 
}
function removeElemento(index: number) {
    plObj.removeElemento(index);
}
