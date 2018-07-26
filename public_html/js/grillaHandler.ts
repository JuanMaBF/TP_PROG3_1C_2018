"use strict";
///<reference path="../node_modules/@types/jquery/index.d.ts"/>
///<reference path="./model/pedidosHandler.ts"/>
///<reference path="./server.ts"/>

namespace laComanda {
    export class grillaHandler {

        private server : server;
        private pedidosHand: pedidosHandler;

        public constructor() {
            this.server = new server();
            this.pedidosHand = new pedidosHandler();
            this.getPedidos();
        }

        private getPedidos() {
            this.server.getPedidos((ped: string) => { 
                this.pedidosHand = pedidosHandler.parse(JSON.parse(ped));
            });
        }

    }
}