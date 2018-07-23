namespace pedidosHandler {

    export class pedidosHandler {

        public pedidos: Array<pedido>;

        public constructor() {
            this.pedidos = new Array<pedido>();
        }

        public addPedido(numeroMesa: number, nombreCliente: string, precio: number): void {
            let id = '';
            let caracteres = this.pedidos.length.toString().length;
            for(let i = 0; i < 5-caracteres; i++) {
                id = id + '0';
            }
            id += this.pedidos.length.toString();
            let newPedido = new pedido(id, numeroMesa, nombreCliente, 'Pendiente', precio);
            this.pedidos.push(newPedido);
        }

    }

    export class pedido {
        public id: string;
        public numeroMesa: number;
        public nombreCliente: string;
        public estado: string;
        public precio: number;
        public elementos: Array<elemento>;

        public constructor(id: string, numeroMesa: number, nombreCliente: string, estado: string, precio: number) {
            this.id = id;
            this.numeroMesa = numeroMesa;
            this.nombreCliente = nombreCliente;
            this.estado = estado;
            this.precio = precio;
            this.elementos = new Array<elemento>();
        }

        public addElemento(nombre: string) {
            this.elementos.push(new elemento(nombre, 'Pendiente'));
        }

    }

    export class elemento {
        public nombre: string;
        public estado: string;

        public constructor(nombre: string, estado: string) {
            this.nombre = nombre;
            this.estado = estado;
        }
    }
}