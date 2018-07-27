"use strict";
///<reference path="../node_modules/@types/jquery/index.d.ts"/>
///<reference path="./server.ts"/>

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
                    localStorage.setItem('user', password);
                    $(location).attr('href', './index.html');
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

        public setTestValue(value: any): void {
            $('#usr-txt').val(value);
            $('#pass-txt').val(value);
        }

    }
}

var loginObj: laComanda.login;

window.onload = function() {
    loginObj = new laComanda.login();
};

function doLogin() {
    loginObj.doLogin();
}

function setTestValue(value: string) {
    loginObj.setTestValue(value);
}
