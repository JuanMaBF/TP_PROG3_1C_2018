"use strict";
///<reference path="../node_modules/@types/jquery/index.d.ts"/>
///<reference path="./server.ts"/>
///<reference path="./model/pedidosHandler.ts"/>

namespace laComanda {
    
    export class usuario {

        private server: server;
        private pedidosHand: pedidosHandler;

        constructor() {
            this.server = new server();
            this.pedidosHand = new pedidosHandler();
            this.getPedidos();
        }

        public showParte(numero: string) {
            let numeros = new Array<string>();
            numeros.push("1");
            numeros.push("2");
            numeros.push("3");
            numeros.splice(numeros.indexOf(numero), 1);
            $("#card-parte-"+numero).css("display", "block");
            numeros.forEach(n => {
                $("#card-parte-"+n).css("display", "none");
            })
        }

        public validateDatosMesa() {
            let numeroMesa = $("#numeroMesa").val();
            let codigo = $("#codigo-txt").val()  as string;
            if(numeroMesa != "" && codigo != "") {
                if(this.pedidosHand.pedidos.some(p => p.numeroMesa.toString() == numeroMesa && p.id == codigo)) {
                    this.mostrarPedido(codigo);
                    this.showParte("2");
                }
            }
        }

        private mostrarPedido(codigo: string) {
            let newHtml = ``;
            this.pedidosHand.pedidos.filter(p => p.id == codigo)[0].elementos.forEach(e => {
                newHtml += `
                    <tr>
                        <th>`+e.nombre+` (`+e.cantidad+`)</th>
                        <th>`+e.estado+`</th>
                        <th>`+this.getTiempoRestante(e)+`</th>
                    </tr>
                `;
            });
            $("#tbody-pedidos").html(newHtml);
        }

        private getTiempoRestante(e:elemento): string {
            let d = new Date();
            let minutos = d.getMinutes() + (d.getHours()*60);
            let minutosEl = e.minutos + (e.hora*60);
            let dif = minutos - minutosEl;
            let horasFal = 0;
            while(dif > 59) {
                horasFal++;
                dif = dif-60;
            }
            return "Faltan "+horasFal+" horas y "+dif+" minutos";
        }

        private getPedidos() {
            this.server.getPedidos((ped: string) => { 
                this.pedidosHand = pedidosHandler.parse(JSON.parse(ped));
            });
        }

    }
}

var usrObj: laComanda.usuario;

window.onload = function() {
    usrObj = new laComanda.usuario();
};

function validateDatosMesa() {
    usrObj.validateDatosMesa();
}

//
