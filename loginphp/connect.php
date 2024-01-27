<?php
$HOSTNAME='localhost';
$EMAIL='root';
$PASSWORD='';
$DATABASE='signup';


$con=mysqli_connect($HOSTNAME, $EMAIL, $PASSWORD, $DATABASE);

if(!$con){
    die(mysqli_error($con));
}

?>