
namespace laComanda {

    export class server {

        public login(user: string, pass: string, callback: Function): void {
            let data = {
                "user": user,
                "pass": pass,
                "action": "login"
            }
            this.connection(data, callback);
        }

        public getPedidos(callback: Function): void {
            let data = {
                "action": "getPedidos"
            };
            this.connection(data, callback);
        }

        public setPedidos(pedidos: any, callback: Function) {
            let data = {
                "action": "setPedidos",
                "pedidos": pedidos
            }
            this.connection(data, callback);
        }

        public getMesas(callback: Function) {
            let data = {
                "action": "getMesas"
            };
            this.connection(data, callback);
        }

        public setMesas(mesas: any, callback: Function) {
            let data = {
                "action": "setMesas",
                "mesas": mesas
            }
            this.connection(data, callback);
        }

        private connection(data: any, callback: Function): void {
            if(data.action != "getMesas" && data.action != "setMesas") {
                $("#spinner-modal").modal('toggle');
            }
            $.ajax({
                url: "./php/server.php",
                type: "post",
                data: data,
                success: (response) => {
                    setTimeout(() => {
                        if(data.action != "getMesas" && data.action != "setMesas") {
                            $("#spinner-modal").modal('toggle');
                        }
                        callback(response);
                    }, 500);
                },
                error: (jqXHR, textStatus, errorThrown) => {
                   console.log(textStatus, errorThrown);
                }
            });
        }
    }

}