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
    case "getMesas":
        echo getLasMesas();
        break;
    case "setMesas":
        echo setLasMesas($_POST["mesas"]);
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

function getLasMesas() {
    $mesasFile = fopen("archivos/mesas.txt", "r") or die("No se puede abrir el archivo");
    $fileContent = fread($mesasFile,filesize("archivos/mesas.txt"));
    fclose($mesasFile);
    return $fileContent;
}

function setLasMesas($mesas) {
    $mesasFile = fopen("archivos/mesas.txt", "w") or die("No se puede abrir el archivo");
    fwrite($mesasFile, $mesas);
    fclose($mesasFile);
}

function login($usr, $pass) {
    if($usr == "bartender1" || $usr == "bartender2") {
        return $pass == "bartender" ? $pass : "pass";
    } else if($usr == "cerveceros1" || $usr == "cerveceros2") {
        return $pass == "cerveceros" ? $pass : "pass";
    } else if($usr == "cocineroCocina1" || $usr == "cocineroCocina2") {
        return $pass == "cocineroCocina" ?$pass : "pass";
    } else if($usr == "cocineroPostres1" || $usr == "cocineroPostres2") {
        return $pass == "cocineroPostres" ? $pass : "pass";
    } else if($usr == "mozo1" || $usr == "mozo2" ) {
        return $pass == "mozo" ? $pass : "pass";
    } else if($usr == "socio1" || $usr == "socio2") {
        return $pass == "socio" ? $pass : "pass";
    } else {
        return "user";
    }
}

?>