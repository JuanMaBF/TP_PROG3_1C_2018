namespace laComanda {
    export class login {

        private server : server;

        public constructor() {
            this.server = new server();
        }

        public doLogin(): void {
            if(this.validateLogin()) {
                let username = $('#usr-txt').val() as string;
                let password = $('#pass-txt').val() as string;
                this.server.login(username, password, (rt: any)=> {
                    if(rt == 'user') {
                        $('#contraError').css('display', 'none');
                        $('#usuarioError').css('display', 'block');
                    } else if (rt == 'pass') {
                        $('#usuarioError').css('display', 'none');
                        $('#contraError').css('display', 'block');
                    } else if (rt == 'ok') {
                        $('#usuarioError').css('display', 'none');
                        $('#contraError').css('display', 'none');
                    }
                    console.log(rt);
                    //localStorage.setItem('testObject', JSON.stringify(testObject));
                });
            }
        }

        public validateLogin(): boolean {
            let isValid = true;
            let username = $('#usr-txt').val();
            let password = $('#pass-txt').val();
            if(username == null || username == '') {
                isValid = false;
                $('#usuarioError').css('display', 'block');
            } else {
                $('#usuarioError').css('display', 'none');
            }
            if(password == null || password == '') {
                isValid = false;
                $('#contraError').css('display', 'block');
            } else {
                $('#contraError').css('display', 'none');
            }
            return isValid;
        }

    }
}

function doLogin() {
    loginObj.doLogin();
}
