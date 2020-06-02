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
    header VARCHAR(100) 
)";

$conn = conn();
if ($conn->query($sql) === true) {
    //echo "Table pages_data created successfully";
} else {
   echo "Error creating table: " . $conn->error;
}
$conn->close();


function addArticleDB($header) {
    $sql = "INSERT INTO save_articles (header)
                 VALUES (?)";
    $conn = conn();
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $header);
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
            $array[$count] = array($row["header"]);
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

if (isset($_POST["header"])) {
    echo $_POST["header"];
    addArticleDB($_POST["header"]); 
}

if (isset($_GET["reset"])) {
    myreset();
    echo "Reset succesfull";
}
