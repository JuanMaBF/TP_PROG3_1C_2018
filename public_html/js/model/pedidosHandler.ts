namespace laComanda {

    export class pedidosHandler {

        public pedidos: Array<pedido>;

        public constructor() {
            this.pedidos = new Array<pedido>();
        }

        public agregarPedido(numeroMesa: number, nombreCliente: string, precio: number,  elementos?: Array<elemento> ): void {
            let id = '';
            let caracteres = this.pedidos.length.toString().length;
            for(let i = 0; i < 5-caracteres; i++) {
                id = id + '0';
            }
            id += this.pedidos.length.toString();
            let newPedido = new pedido(id, numeroMesa, nombreCliente, 'Pendiente', precio, elementos);
            this.pedidos.push(newPedido);
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
            let numeroMesa = json['id'] as number;
            let nombreCliente = json['id'] as string;
            let estado = json['id'] as string;
            let precio = json['id'] as number;
            let elementos = new Array<elemento>();
            json['elementos'].forEach((el: any) => {
                elementos.push(elemento.parse(el));
            });
            ped = new pedido(id, numeroMesa, nombreCliente, estado, precio, elementos);
            return ped;
        }

    }

    export class elemento {
        public nombre: string;
        public cantidad: number;
        public estado: string;

        public constructor(nombre: string, cantidad: number) {
            this.nombre = nombre;
            this.cantidad = cantidad;
            this.estado = 'Pendiente';
        }

        public static parse(json: any): elemento {
            let el: elemento;
            let nombre = json['nombre'] as string;
            let cantidad = json['cantidad'] as number;
            el = new elemento(nombre, cantidad);
            el.estado = json['estado'] as string;
            return el;
        }
    }
}