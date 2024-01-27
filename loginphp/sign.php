<?php
$success = 0;
$user = 0;

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    include 'connect.php';
    $email = mysqli_real_escape_string($con, $_POST['email']); // Prevent SQL injection
    $password = mysqli_real_escape_string($con, $_POST['password']); // Prevent SQL injection

    // Check if the email address has the desired domain
    if (strpos($email, '@student.akesk.org') !== false) {
        // Email has the allowed domain, proceed with registration
        $sql = "SELECT * FROM `registration` WHERE email = '$email'";
        $result = mysqli_query($con, $sql);

        if ($result) {
            $num = mysqli_num_rows($result);

            if ($num > 0) {
                $user = 1; // Email already exists
            } else {
                // Insert the user's data into the database
                $sql = "INSERT INTO `registration` (email, password) VALUES ('$email', '$password')";
                $result = mysqli_query($con, $sql);

                if ($result) {
                    $success = 1; // Registration successful
                } else {
                    die(mysqli_error($con));
                }
            }
        } else {
            die(mysqli_error($con));
        }
    } else {
        $user = 1; // Invalid email domain
    }
}
?>


<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>SIGN-UP|AKAN-ELECT</title> 
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-4bw+/aepP/YC94hEpVNVgiZdgIC5+VKNBQNGCHeKRQN+PtmoHDEXuppvnDJzQIu9" crossorigin="anonymous">
    <link rel="stylesheet" href="login.css">
</head>
<body>
    <?php
    if ($user) {
        echo '<div class="alert alert-danger alert-dismissible fade show toplayer" role="alert">
        <strong>Kindly Try Again!</strong> Email already exists.
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>';
    }
    if ($success) {
        echo '<div class="alert alert-success alert-dismissible fade show toplayer" role="alert">
        <strong>Success</strong> You are successfully signed up!
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>';
    }
    
    ?>
    <div class="form-container">
        <div class="fluid-container">
            <img src="akanlogogreen.png" id="fluid" class="fluid-1">
        </div>
    

    <!-- Sign-in Container -->
        <div class="login-container">
            <div class="form-icon">
                <i class="bx bx log-in-circle icon-1"></i>
                <i class="bx bx log-in-circle icon-2"></i>
            </div>
            <h1 class="text-center">AKAN-ELECT</h1>
            <div class="container mt-5">
                <form action="sign.php" method="post">
                    <div class="mb-3">
                        <label for="exampleInputEmail1" class="form-label">Email address</label>
                        <input type="email" class="form-control" placeholder="Enter Your Email Address" name="email" required> <!-- Add required attribute -->
                    </div>
                    <div class="mb-3">
                        <label for="exampleInputPassword1" class="form-label">Password</label>
                        <input type="password" class="form-control" placeholder="Enter Your Password" name="password" required> <!-- Add required attribute -->
                    </div>
                    <button type="submit" class="btn btn-primary w-100">Sign Up</button>

                    <small>Have an account? Login <a href="login.php">here</a></small>
                </form>
            </div>
        </div>
    </div>
</body>
</html>
