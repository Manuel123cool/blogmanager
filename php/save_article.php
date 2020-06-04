<?php

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "save_article";

function conn() {
    $servername = "localhost";
    $username = "root";
    $password = "";
    $dbname = "save_article";

    $conn = new mysqli($servername, $username, $password, $dbname);

    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }
    return $conn;
}
$conn = new mysqli($servername, $username, $password);

$sql = "CREATE DATABASE IF NOT EXISTS $dbname";
if ($conn->query($sql) === TRUE) {
  //echo "Database created successfully";
} else {
  echo "Error creating database: " . $conn->error;
}
$conn->close();

$sql = "CREATE TABLE IF NOT EXISTS save_articles (
    id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    header VARCHAR(100),
    article VARCHAR(5000) 
)";

$conn = conn();
if ($conn->query($sql) === true) {
    //echo "Table pages_data created successfully";
} else {
   echo "Error creating table: " . $conn->error;
}
$conn->close();


function addArticleDB($header, $article) {
    $sql = "INSERT INTO save_articles (header, article)
                 VALUES (?, ?)";
    $conn = conn();
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ss", $header, $article);
    $stmt->execute();
 
}

function getArticleDB() {
    $sql = "select * from save_articles";    
    $conn = conn();
    $result = $conn->query($sql);
    $array = array();
    if ($result->num_rows > 0) {
        $count = 0;
        while ($row = $result->fetch_assoc()) {
            $array[$count] = array($row["header"], $row["article"]);
            $count++;
        }

    }
    return $array;
}

function myreset() {
    $conn = conn();
    $sql = "DROP TABLE save_articles";
    
    if ($conn->query($sql)) {
        //echo "Table deleted succesfull";
    } else {
        echo "Error by deleting: " . $conn->error;
    }
}

if (isset($_GET["getArticle"])) {
    echo json_encode(getArticleDB()); 
}

if (isset($_POST["header"], $_POST["article"])) {
    $header = json_decode($_POST["header"]);
    $article = json_decode($_POST["article"]);
    
    for ($i = 0; $i < count($header); $i++) {
        addArticleDB($header[$i], $article[$i]); 
    } 
    echo "Data send succesfully";
}

if (isset($_GET["reset"])) {
    myreset();
    echo "Reset succesfull";
}
