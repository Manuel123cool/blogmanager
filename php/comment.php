<?php
include "split.php";

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "comments";

function conn() {
    $servername = "localhost";
    $username = "root";
    $password = "";
    $dbname = "comments";

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

$sql = "CREATE TABLE IF NOT EXISTS my_comments (
    id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    comment VARCHAR(1000),
    name VARCHAR(30),
    date VARCHAR(30),
    reply_num INT,
    into_div VARCHAR(30) 
)";
$conn = conn();
if ($conn->query($sql) === true) {
    //echo "Table pages_data created successfully";
} else {
   echo "Error creating table: " . $conn->error;
}
$conn->close();

function insertData($name, $comment, $date, $reply_num, $into_div) {
    global $split; 
    $sql = "INSERT INTO my_comments (comment, name, date, reply_num, into_div)
                 VALUES (?, ?, ?, ?, ?)";
    $conn = conn();
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("sssis", $comment, $name, $date, $reply_num, $into_div);
    $stmt->execute();
    
    $split->deleteTables();
    $split->setData();
    $split->arrangeData();
    $split->split();
}

function getData($index) {
    $sql = "SELECT * FROM comments$index";    
    $conn = conn();
    $result = $conn->query($sql);
    $array = Array();
    if ($result->num_rows > 0) {
        $count = 0;
        while ($row = $result->fetch_assoc()) {
            $array[$count] = array(utf8_encode($row["name"]), 
                utf8_encode($row["comment"]), 
                    utf8_encode($row['date']), $row['reply_num'], $row['into_div']); 
            $count++;
        }

    }
    return $array;
}

if (isset($_GET['name'], $_GET['comment'], $_GET['date'], 
            $_GET['reply_num'], $_GET['into_div'])) {
    insertData($_GET['name'], $_GET['comment'], $_GET['date'], 
                    $_GET['reply_num'], $_GET['into_div']);    
    echo "Data arrived";
}

if (isset($_GET['wantData'], $_GET['index'])) {
    echo json_encode(getData($_GET['index']));  
}

if (isset($_GET['wantLength'])) {
        $count = 0;
        $table = true;
        $length = 0;
        while ($table) {
            $conn = conn();
            if ($conn->connect_error) {
              die("Connection failed: " . $conn->connect_error);
            }

            $sql = "select 1 from comments$count LIMIT 1";
            $result = $conn->query($sql);

            if($result !== FALSE) {
                $length++; 
            } else {
                $table = false;
            }
            $count++;
        }
    echo $length;
}


