
namespace server {

    export class server {

        public connection(data: any, callback: Function): void {
            $.ajax({
                url: "./php/server.php",
                type: "post",
                data: data,
                success: (response) => {
                    callback(this.deserializeData(response));
                },
                error: (jqXHR, textStatus, errorThrown) => {
                   console.log(textStatus, errorThrown);
                }
            });
        }

        private deserializeData(data: string) {
            return data;
        }

    }

}