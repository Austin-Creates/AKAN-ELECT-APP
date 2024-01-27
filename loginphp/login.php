<?php
error_reporting(E_ALL);
ini_set('display_errors', '1');

$login=0;
$invalid=0;

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    include 'connect.php';
    $email = $_POST['email'];
    $password = $_POST['password'];

    $sql = "select * from `registration` where email = '$email' and password = '$password'";
    $result = mysqli_query($con, $sql);
    if ($result) {
        $num = mysqli_num_rows($result);
        if ($num > 0) {
            $login=1;
            session_start();
            $_SESSION['email'] = $email;
            header("Location: http://127.0.0.1:3000/nav%20page/nav.html");
            exit;
        } else {
            $invalid=1;
        }
    }

}

?>

<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>LOG-IN|AKAN-ELECT</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-4bw+/aepP/YC94hEpVNVgiZdgIC5+VKNBQNGCHeKRQN+PtmoHDEXuppvnDJzQIu9" crossorigin="anonymous">
    <link rel="stylesheet" href="login.css">

</head>
<body>
    <?php
        if($login){
            echo '<div class="alert alert-success alert-dismissible fade show toplayer" role="alert">
            <strong>Success</strong> You are successfully logged in!
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
          </div>';
        }
    ?>

    <?php
        if($invalid){
            echo '<div class="alert alert-danger alert-dismissible fade show toplayer" role="alert">
            <strong>Error</strong> Invalid credentials!
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
          </div>';
        }
    ?>

    <div class="form-container">
        <div class="fluid-container">
            <img src="akanlogogreen.png" id="fluid" class="fluid-1">
        </div>
    

    <!-- Login Container -->
        <div class="login-container">
            <div class="form-icon">
                <i class="bx bx log-in-circle icon-1"></i>
                <i class="bx bx log-in-circle icon-2"></i>
            </div>
            <h1 class="text-center">AKAN-ELECT</h1>
            
            <form action="login.php" method="post">
                <div class="mb-3">
                    <label for="exampleInputEmail1" class="form-label">Email address</label>
                    <input type="email" class="form-control" placeholder="Enter Your Email Address" name="email">
                </div>
                <div class="mb-3">
                    <label for="exampleInputPassword1" class="form-label">Password</label>
                    <input type="password" class="form-control" placeholder="Enter Your Password" name="password">
                </div>
                <button type="submit" class="btn btn-primary w-100">Login</button>

                <small>Dont have an account? Sign up <a href="sign.php">here</a></small>
            </form>
               
            </div>
        </div>
    </div>


    <!-- <script src="login.js"></script> -->
</body>
</html>
