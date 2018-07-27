"use strict";
///<reference path="../node_modules/@types/jquery/index.d.ts"/>
///<reference path="./server.ts"/>
///<reference path="./model/pedidosHandler.ts"/>

namespace laComanda {
    
    export class usuario {

        private server: server;
        private pedidosHand: pedidosHandler;
        private currentPedido: string;

        constructor() {
            this.server = new server();
            this.pedidosHand = new pedidosHandler();
            this.currentPedido = '';
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
                    this.currentPedido = codigo;
                    this.showParte("2");
                } else {
                    alert("Informacion incorrecta. Chequee sus datos o consulte con el mozo");   
                }
            } else {
                alert("Informacion incorrecta. Chequee sus datos o consulte con el mozo");
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
            let tiempoTranscurrido = minutos - minutosEl;
            let dif = parseInt(e.tiempoEstimado) - tiempoTranscurrido;
            let horasFal = 0;
            while(dif > 59) {
                horasFal++;
                dif = dif-60;
            }
            return "Faltan "+horasFal+" horas y "+dif+" minutos";
        }

        private getPedidos(callback?: Function) {
            this.server.getPedidos((ped: string) => { 
                this.pedidosHand = pedidosHandler.parse(JSON.parse(ped));
                if(callback != undefined) {
                    callback(this.currentPedido);
                    if(this.pedidosHand.pedidos.filter(p => p.id == this.currentPedido)[0].estado == "Cerrado") {
                        this.showParte("3");
                    }
                }
            });
        }

        public actualizar(): void {
            this.getPedidos(this.mostrarPedido.bind(this));
        }

        public subirEncuesta(): void {
            let puntMesa = $("#puntMesa").val();
            let puntRestaurante = $("#puntRestaurante").val();
            let puntCocinero = $("#puntCocinero").val();
            let puntMozo = $("#puntMozo").val();
            let puntos = {
                "puntMesa": puntMesa,
                "puntRestaurante": puntRestaurante,
                "puntCocinero": puntCocinero,
                "puntMozo": puntMozo,
            };
            this.pedidosHand.pedidos.filter(p => p.id == this.currentPedido)[0].puntos = puntos;
            this.server.setPedidos(JSON.stringify(this.pedidosHand), (rt: any) => {});
            alert("Gracias! Vuelva prontoS");
            $(location).attr('href', './usuario.html');
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

function actualizar() {
    usrObj.actualizar();
}

function subirEncuesta() {
    usrObj.subirEncuesta();
}
