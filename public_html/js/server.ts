
namespace server {

    export class server {

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
            $.ajax({
                url: "./php/server.php",
                type: "post",
                data: data,
                success: (response) => {
                    callback(response);
                },
                error: (jqXHR, textStatus, errorThrown) => {
                   console.log(textStatus, errorThrown);
                }
            });
        }
    }

}