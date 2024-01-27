<?php
session_start();
if(!isset($_SESSION['email'])){
    header('location:login.php'); //This prevents users from entering the app without logging in.
}
?>




<!doctype html>
<html lang="en">
  <head>
    <!-- Required meta tags -->
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

    <!-- Bootstrap CSS -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.3.1/dist/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">

    <title>AKAN-ELECT</title>
  </head>
  <body>
    <h1 class="text-center text-success mt-5">Welcome
        <?php echo $_SESSION['email'];?>
    </h1>

    <div class="container">
        <a href="logout.php" class="btn btn-primary mt-5">Logout</a>
    </div>

  </body>
</html>