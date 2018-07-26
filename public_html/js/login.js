"use strict";
var laComanda;
(function (laComanda) {
    var login = /** @class */ (function () {
        function login() {
            this.server = new laComanda.server();
        }
        login.prototype.doLogin = function () {
            if (this.validateLogin()) {
                var username = $('#usr-txt').val();
                var password = $('#pass-txt').val();
                this.server.login(username, password, function (rt) {
                    if (rt == 'user') {
                        $('#contraError').css('display', 'none');
                        $('#usuarioError').css('display', 'block');
                    }
                    else if (rt == 'pass') {
                        $('#usuarioError').css('display', 'none');
                        $('#contraError').css('display', 'block');
                    }
                    else if (rt == 'ok') {
                        $('#usuarioError').css('display', 'none');
                        $('#contraError').css('display', 'none');
                    }
                    console.log(rt);
                    //localStorage.setItem('testObject', JSON.stringify(testObject));
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
        return login;
    }());
    laComanda.login = login;
})(laComanda || (laComanda = {}));
function doLogin() {
    loginObj.doLogin();
}
