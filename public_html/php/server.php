<?php 

$action = $_POST["action"];
switch($action) {
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

?>