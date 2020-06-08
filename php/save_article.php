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
    article VARCHAR(5000), 
    db_id INT
)";

$conn = conn();
if ($conn->query($sql) === true) {
    //echo "Table pages_data created successfully";
} else {
   echo "Error creating table: " . $conn->error;
}
$conn->close();


function addArticleDB($header, $article, $db_id) {
    $sql = "INSERT INTO save_articles (header, article, db_id)
                 VALUES (?, ?, ?)";
    $conn = conn();
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ssi", $header, $article, $db_id);
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
            $array[$count] = array($row["header"], $row["article"], $row["db_id"]);
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

function createComTable($db_id) {
    $servername = "localhost";
    $username = "root";
    $password = "";
    $dbname = "comments";

    $conn = new mysqli($servername, $username, $password, $dbname);

    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }
 
    $sql = "CREATE TABLE IF NOT EXISTS my_comments$db_id (
        id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        comment VARCHAR(1000),
        name VARCHAR(30),
        date VARCHAR(30),
        reply_num INT,
        into_div VARCHAR(30) 
    )";
    if ($conn->query($sql) === true) {
        //echo "Table pages_data created successfully";
    } else {
       echo "Error creating table: " . $conn->error;
    }
    $conn->close();
}

function delTables($db_ids) {
    $pdo = new PDO('mysql:host=localhost;dbname=comments', "root", "");
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $query = $pdo->prepare('show tables');
    $query->execute();

    $allTableArray = Array();
    $count = 0;
    while($rows = $query->fetch(PDO::FETCH_ASSOC)){
        $allTableArray[$count] = $rows["Tables_in_comments"]; 
        $count++;
    }
    
    $tableForDel = Array();
    $count2 = 0;
    foreach ($allTableArray as $value) {
        $oneIsIn = false;
        foreach ($db_ids as $value1) {
            if ("my_comments$value1" == $value) {
                $oneIsIn = true;
            } 
        }
        if (!$oneIsIn) {
            $tableForDel[$count2] = $value;
            $count2++;
        }
    }
    
    foreach ($tableForDel as $delTable) {
        $sql = "DROP TABLE $delTable";
        $pdo->query($sql);
    } 
}

function tableExists($pdo, $table) {
    try {
        $result = $pdo->query("SELECT 1 FROM $table LIMIT 1");
    } catch (Exception $e) {
        return FALSE;
    }

    return $result !== FALSE;
}

function delOneTable($id) {
    $pdo = new PDO('mysql:host=localhost;dbname=comments', "root", "");
    $tableExists = tableExists($pdo, "my_comments$id");
    if ($tableExists) {
        try {
            $sql = "DROP TABLE my_comments$id";
            $pdo->query($sql);    
        } catch (PDOException $e) {
            echo "drop table error ". $e->getMessage();
        }
    }
}

if (isset($_GET["getArticle"])) {
    echo json_encode(getArticleDB()); 
}

if (isset($_COOKIE["myname"], $_COOKIE["mypassword"])) {
    if ($_COOKIE["myname"] == "Manuel" && 
            password_verify("Password", $_COOKIE["mypassword"])) {

        if (isset($_POST["deleteOneTable"], $_POST["table_id"])) {
            delOneTable($_POST["table_id"]);
            echo "deleted succesfull";
        }

        if (isset($_POST["header"], $_POST["article"], $_POST["db_id"])) {
            $header = json_decode($_POST["header"]);
            $article = json_decode($_POST["article"]);
            $db_id = json_decode($_POST["db_id"]);

            for ($i = 0; $i < count($header); $i++) {
                addArticleDB($header[$i], $article[$i], $db_id[$i]); 
                createComTable($db_id[$i]);
            } 
            delTables($db_id);
            echo "Data send succesfully";
        }

        if (isset($_GET["reset"])) {
            myreset();
            echo "Reset succesfull";
        }
    }
}
