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
    realId INT 
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

function setArticleId($index = -1) {
    $conn = conn();
    $sql = "SELECT id FROM save_articles LIMIT 1";
    $result = $conn->query($sql);
    $startId = -1;
    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $startId = $row["id"]; 
        }
    } else {
        echo "0 results";
    }
     
    $conn = conn();
    $sql = "SELECT count(*) as total from save_articles";
    $result = $conn->query($sql);
    $data = $result->fetch_assoc();
    
    $conn = conn();
    $once = false;
    
    if ($index == 0) {
        $once = true;
    }

    for ($i = 0; $i < $data["total"]; ++$i) {
        if ($index != -1) {
            if ($i == $index && !$once) {
                $startId++;
                $once = true;
            }
        }
        echo "StartId: " . $startId .  "b"; 
        $sql = "UPDATE save_articles SET realId=$i WHERE id=$startId"; 
        if ($conn->query($sql) == true) {
            //echo "Updating sucessfull";
        } else {
            echo "Error updating record: " . $conn->error;
        }
        $startId++;
    }
}

function deleteArticle($index) {
    setArticleId();     
    $conn = conn(); 
    $sql = "DELETE FROM save_articles WHERE realId=$index";
    
    if ($conn->query($sql) === true) {
        //echo "Deleted successful data"; 
    } else {
        echo "Error deleting data: " . $conn->error();
    }
    setArticleId($index);
}

if (isset($_GET["delete"], $_GET["index"])) {
    deleteArticle($_GET["index"]);
}

if (isset($_POST["header"])) {
    echo $_POST["header"];
    addArticleDB($_POST["header"]); 
}

if (isset($_GET["getArticle"])) {
    echo json_encode(getArticleDB()); 
}
