namespace laComanda {

    export class pedidosHandler {

        public pedidos: Array<pedido>;

        public constructor() {
            this.pedidos = new Array<pedido>();
        }

        public getNew(): pedidosHandler {
            return new pedidosHandler();
        }

        public agregarPedido(numeroMesa: number, nombreCliente: string, precio: number,  elementos?: Array<elemento> ): void {
            let id = '';
            if(this != null) {            
                let caracteres = this.pedidos.length.toString().length;
                for(let i = 0; i < 5-caracteres; i++) {
                    id = id + '0';
                }
                id += this.pedidos.length.toString();
                let newPedido = new pedido(id, numeroMesa, nombreCliente, 'Pendiente', precio, elementos);
                if(elementos != null) {
                    elementos.forEach(el => el.pedidoId = id);
                }
                this.pedidos.push(newPedido);
            }
        }

        public static parse(json: any): pedidosHandler {
            let pedHan: pedidosHandler;
            let pedidos = new Array <pedido>();
            json['pedidos'].forEach((ped: any) => {
                pedidos.push(pedido.parse(ped));
            });
            pedHan = new pedidosHandler();
            pedHan.pedidos = pedidos;
            return pedHan;
        }

    }

    export class pedido {
        public id: string;
        public numeroMesa: number;
        public nombreCliente: string;
        public estado: string;
        public precio: number;
        public elementos: Array<elemento>;
        public puntos: any;

        public constructor(id: string, numeroMesa: number, nombreCliente: string, estado: string, precio: number, elementos?: Array<elemento> ) {
            this.id = id;
            this.numeroMesa = numeroMesa;
            this.nombreCliente = nombreCliente;
            this.estado = estado;
            this.precio = precio;
            this.elementos = elementos != null ? elementos : new Array<elemento>();
        }

        public static parse(json: any): pedido {
            let ped: pedido;
            let id = json['id'] as string;
            let numeroMesa = json['numeroMesa'] as number;
            let nombreCliente = json['nombreCliente'] as string;
            let estado = json['estado'] as string;
            let precio = json['precio'] as number;
            let elementos = new Array<elemento>();
            json['elementos'].forEach((el: any) => {
                elementos.push(elemento.parse(el));
            });
            ped = new pedido(id, numeroMesa, nombreCliente, estado, precio, elementos);
            ped.puntos = json['puntos'];
            elementos.forEach(el => el.pedidoId = id);
            return ped;
        }

    }

    export class elemento {
        public nombre: string;
        public cantidad: number;
        public estado: string;
        public pedidoId: string;
        public index: number;
        public tomadoPor: string;
        public tiempoEstimado: string;
        public hora: number;
        public minutos: number;

        public constructor(nombre: string, cantidad: number) {
            this.nombre = nombre;
            this.cantidad = cantidad;
            this.estado = 'Pendiente';
            this.pedidoId = '';
            this.index = 0
            this.tomadoPor = '';
            this.tiempoEstimado = '';
            this.hora = 0;
            this.minutos = 0;
        }

        public static parse(json: any): elemento {
            let el: elemento;
            let nombre = json['nombre'] as string;
            let cantidad = json['cantidad'] as number;
            el = new elemento(nombre, cantidad);
            el.estado = json['estado'] as string;
            el.tomadoPor = json['tomadoPor'] as string;
            el.tiempoEstimado = json['tiempoEstimado'] as string;
            el.hora = json['hora'] as number;
            el.minutos = json['minutos'] as number;
            return el;
        }
    }

    export class lasMesas {
        public mesas: Array<mesa>;

        constructor() {
            this.mesas = new Array<mesa>();
            this.mesas.push(new mesa('1'));
            this.mesas.push(new mesa('2'));
            this.mesas.push(new mesa('3'));
            this.mesas.push(new mesa('4'));
            this.mesas.push(new mesa('5'));
        }

        public static parse(json: any): lasMesas {
            let lm = new lasMesas();
            lm.mesas = new Array<mesa>();
            json['mesas'].forEach((mes: any) => {
                lm.mesas.push(mesa.parse(mes));
            });
            return lm;
        }

    }

    export class mesa {
        public numero: string;
        public estado: string;

        constructor(numero: string) {
            this.numero = numero;
            this.estado = 'Con cliente esperando pedido';
        }

        public static parse(json: any): mesa {
            let mes = new mesa(json['numero']);
            mes.estado = json['estado']
            return mes;
        }

    }

}