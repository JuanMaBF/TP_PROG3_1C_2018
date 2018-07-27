"use strict";
///<reference path="../node_modules/@types/jquery/index.d.ts"/>
///<reference path="./server.ts"/>
var laComanda;
(function (laComanda) {
    var login = /** @class */ (function () {
        function login() {
            this.server = new laComanda.server();
        }
        login.prototype.doLogin = function () {
            if (this.validateLogin()) {
                var username_1 = $('#usr-txt').val();
                var password = $('#pass-txt').val();
                this.server.login(username_1, password, function (rt) {
                    if (rt == 'user') {
                        $('#contraError').css('display', 'none');
                        $('#usuarioError').css('display', 'block');
                    }
                    else if (rt == 'pass') {
                        $('#usuarioError').css('display', 'none');
                        $('#contraError').css('display', 'block');
                    }
                    else {
                        $('#usuarioError').css('display', 'none');
                        $('#contraError').css('display', 'none');
                        localStorage.setItem('tipoUser', rt);
                        localStorage.setItem('username', username_1);
                        $(location).attr('href', './index.html');
                    }
                });
            }
        };
        login.prototype.validateLogin = function () {
            var isValid = true;
            var username = $('#usr-txt').val();
            var password = $('#pass-txt').val();
            if (username == null || username == '') {
                isValid = false;
                $('#usuarioError').css('display', 'block');
            }
            else {
                $('#usuarioError').css('display', 'none');
            }
            if (password == null || password == '') {
                isValid = false;
                $('#contraError').css('display', 'block');
            }
            else {
                $('#contraError').css('display', 'none');
            }
            return isValid;
        };
        login.prototype.setTestValue = function (value) {
            $('#usr-txt').val(value);
            $('#pass-txt').val(value.substring(0, value.length - 1));
        };
        return login;
    }());
    laComanda.login = login;
})(laComanda || (laComanda = {}));
var loginObj;
window.onload = function () {
    loginObj = new laComanda.login();
};
function doLogin() {
    loginObj.doLogin();
}
function setTestValue(value) {
    loginObj.setTestValue(value);
}
