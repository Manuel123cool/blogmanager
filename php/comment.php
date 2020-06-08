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

function insertData($name, $comment, $date, $reply_num, $into_div, $site_index) {
    global $split; 
    $sql = "INSERT INTO my_comments$site_index (comment, name, date, reply_num, into_div)
                 VALUES (?, ?, ?, ?, ?)";
    $conn = conn();
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("sssis", $comment, $name, $date, $reply_num, $into_div);
    $stmt->execute();
    
    $split->deleteTables($site_index);
    $split->setdata($site_index);
    $split->arrangedata();
    $split->my_split($site_index);
}

function getdata($index, $site_index) {
    $sql = "select * from " . $site_index . "comments$index";    
    $conn = conn();
    $result = $conn->query($sql);
    $array = array();
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

if (isset($_POST['name'], $_POST['comment'], $_POST['date'], 
            $_POST['reply_num'], $_POST['into_div'], $_POST["site_index"])) {

    insertdata($_POST['name'], $_POST['comment'], $_POST['date'], 
                    $_POST['reply_num'], $_POST['into_div'], $_POST["site_index"]);    
    echo "data arrived";
}

if (isset($_GET['wantData'], $_GET['index'], $_GET["site_index"])) {
    echo json_encode(getdata($_GET['index'], $_GET["site_index"]));  
}

function getlength($site_index) {
    $count = 0;
    $table = true;
    $length = 0;
    while ($table) {
        $conn = conn();
        if ($conn->connect_error) {
          die("connection failed: " . $conn->connect_error);
        }

        $sql = "select 1 from " . $site_index . "comments$count LIMIT 1";
        $result = $conn->query($sql);

        if($result !== FALSE) {
            $length++; 
        } else {
            $table = false;
        }
        $count++;
    }
    return $length;
}

if (isset($_GET['wantLength'], $_GET["site_index"])) {
    echo getLength($_GET["site_index"]);
}

function getIndexPlus($index, $site_index) {
    if ($index > getLength($site_index)) {
        return "something is wrong <br>";
    }
    
    $indexPlus = 0;
    for ($i = 0; $i < $index; ++$i) {
        $array = getData($i, $site_index);
        foreach ($array as $value) {
            if ($value[3] == 0) {
                $indexPlus++;
            }
        }
    }
    return $indexPlus;
}

if (isset($_GET['wantIndexPlus'], $_GET['indexForPlus'], $_GET["site_index"])) {
    echo getIndexPlus($_GET['indexForPlus'], $_GET["site_index"]);
}
