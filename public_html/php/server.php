<?php 

$action = $_POST["action"];
switch($action) {
    case "login":
        echo login($_POST["user"], $_POST["pass"]);
        break;
    case "getPedidos":
        echo getPedidos();
        break;
    case "setPedidos":
        echo setPedidos($_POST["pedidos"]);
        break; 
}

function getPedidos() {
    $pedidosFile = fopen("archivos/pedidos.txt", "r") or die("No se puede abrir el archivo");
    $fileContent = fread($pedidosFile,filesize("archivos/pedidos.txt"));
    fclose($pedidosFile);
    return $fileContent;
}

function setPedidos($pedidos) {
    $pedidosFile = fopen("archivos/pedidos.txt", "w") or die("No se puede abrir el archivo");
    fwrite($pedidosFile, $pedidos);
    fclose($pedidosFile);
}

function login($usr, $pass) {
    if($usr == "bartender") {
        return $pass == "bartender" ? "ok" : "pass";
    } else if($usr == "cerveceros") {
        return $pass == "cerveceros" ? "ok" : "pass";
    } else if($usr == "cocineroCocina") {
        return $pass == "cocineroCocina" ? "ok" : "pass";
    } else if($usr == "cocineroPostres") {
        return $pass == "cocineroPostres" ? "ok" : "pass";
    } else if($usr == "mozo") {
        return $pass == "mozo" ? "ok" : "pass";
    } else if($usr == "socio") {
        return $pass == "socio" ? "ok" : "pass";
    } else {
        return "user";
    }
}

?>