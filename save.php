<?php

$input = file_get_contents("php://input");
$data = json_decode($input, true);

$host = "sql210.infinityfree.com";
$user = "if0_40501589";
$pass = "***";
$db   = "if0_40501589_FitVibe";

try {
    $conn = new PDO("mysql:host=$host;dbname=$db;charset=utf8mb4", $user, $pass);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $conn->exec("DELETE FROM tabs");

    $stmt = $conn->prepare("INSERT INTO tabs (title, description) VALUES (?, ?)");

    foreach ($data as $tab) {
        $stmt->execute([$tab['title'], $tab['desc']]);
    }

    echo "OK";

} catch (PDOException $e) {
    echo "ERROR: " . $e->getMessage();

}
