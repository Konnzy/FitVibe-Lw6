<?php
$host = "sql210.infinityfree.com"; 
$user = "if0_40501589"; 
$pass = "***";
$db   = "if0_40501589_FitVibe";

$conn = new PDO("mysql:host=$host;dbname=$db;charset=utf8", $user, $pass);

$stmt = $conn->query("SELECT title, description FROM tabs");
$result = $stmt->fetchAll(PDO::FETCH_ASSOC);

header('Content-Type: application/json; charset=utf-8');
echo json_encode($result);
