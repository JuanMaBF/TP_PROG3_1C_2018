
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

        private connection(data: any, callback: Function): void {
            $("#spinner-modal").modal('toggle');
            $.ajax({
                url: "./php/server.php",
                type: "post",
                data: data,
                success: (response) => {
                    setTimeout(() => {
                        $("#spinner-modal").modal('toggle');
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