<?php
session_start();
include 'functions.php';
echo '<div class="jumbotron">';
echo '<h1>Contact Form</h1>';

if (isset($_GET['msg']) && $_GET['msg'] == "success") {
    echo '<div class="alert alert-success alert-dismissable">';
    echo '<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>';
    echo 'Contact info successfully entered into database!</div>';
}

if (isset($_POST['submit'])) {
    $errStatus = [];
    $name = $_POST['name'] ?? '';
    $phone = $_POST['phone'] ?? '';
    $email = $_POST['email'] ?? '';
    $comments = $_POST['message'] ?? '';

    if (empty($name)) {
        $errStatus[] = "name=nameNull";
    }
    if (!empty($phone) && !preg_match("/^\d{10}$/", $phone)) {
        $errStatus[] = "phone=phoneInvalid";
    }
    if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errStatus[] = "email=emailInvalid";
    }

    if (empty($errStatus)) {
        $dblink = db_connect("contact");
        $nameClean = mysqli_real_escape_string($dblink, $name);
        $phoneClean = mysqli_real_escape_string($dblink, $phone);
        $emailClean = mysqli_real_escape_string($dblink, $email);
        $commentsClean = mysqli_real_escape_string($dblink, $comments);
        $sql = "INSERT INTO `contact_info` (`name`, `phone`, `email`, `comments`) 
                VALUES ('$nameClean', '$phoneClean', '$emailClean', '$commentsClean')";
        if ($dblink->query($sql)) {
            header("Location: index.html?msg=success");
            exit;
        } else {
            echo "<p>Something went wrong with the database query.</p>";
            echo "<p>Error: " . $dblink->error . "</p>";
        }
    } else {
        foreach ($errStatus as $error) {
            echo "<p class='alert-danger'>$error</p>";
        }
    }
}

echo '</div>';
?>
