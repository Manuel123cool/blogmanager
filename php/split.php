<?php

class Split {
    private $dataArray = null;
    private $tableNumLength = 0;
    public $newArray = null;

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

    function setData() {
        $sql = "SELECT * FROM my_comments";    
        $conn = $this->conn();
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
        $this->dataArray = $array;
    }

    function mkTableAndInsert($array) {
        $sql = "CREATE TABLE IF NOT EXISTS comments$this->tableNumLength (
            id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            comment VARCHAR(1000),
            name VARCHAR(30),
            date VARCHAR(30),
            reply_num INT,
            into_div VARCHAR(30) 
        )";

        $conn = $this->conn();
        if ($conn->query($sql) === true) {
           //echo "Table comments$this->tableNumLength created successfully";
        } else {
           echo "Error creating table: " . $conn->error;
        }
        $conn->close();
    
        foreach ($array as $value) {
            $this->insertData($value[0], $value[1], $value[2], $value[3], $value[4]);
        }

        $this->tableNumLength++;
    } 

    function insertData($name, $comment, $date, $reply_num, $into_div) {
        $sql = "INSERT INTO comments$this->tableNumLength   
            (comment, name, date, reply_num, into_div)
                     VALUES (?, ?, ?, ?, ?)";
        $conn = $this->conn();
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("sssis", $comment, $name, $date, $reply_num, $into_div);
        $stmt->execute();
    }

    function bubbleSort($array) {
        $n = count($array);
        do {
            $swapped = false;
            for ($i = 0; $i < $n - 1; ++$i) {
                if ($array[$i][3] > $array[$i + 1][3]) {
                    $tempArray = $array[$i];
                    $array[$i] = $array[$i + 1];
                    $array[$i + 1] = $tempArray;
                    $swapped = true;
                }
            }
        } while ($swapped);
        return $array;
    }
        
    function insertArray($array, $insert, $index) {
        $length = count($array);
        $newArray = Array();
        for ($i = 0; $i < $index; $i++) {
            $newArray[$i] = $array[$i]; 
        }
        $newArray[$index] = $insert;
        for ($i = $index + 1; $i < $length + 1; ++$i) {
            $newArray[$i] = $array[$i - 1]; 
        }
        return $newArray;
    }
   
    function arrangeData() {
        $dummyArray = Array(); 
        $count = 0;
        foreach ($this->dataArray as $value) {
            if ($value[3] == 0 && $value[4] == "false") {
                $dummyArray[$count] = $value;
                $count++;
            }
        }
        unset($value);

        $arrayOfReply_num = Array();
        $count1 = 0;
        foreach ($this->dataArray as $value) {
            if ($value[3] != 0 && $value[4] == "false") {
                $arrayOfReply_num[$count1] = $value;
                $count1++;
            }
        }
        unset($value);
        $arrayOfReply_num = $this->bubbleSort($arrayOfReply_num);
        $addIndex = 0;
        foreach ($arrayOfReply_num as $value) {
            $dummyArray = $this->insertArray(
                        $dummyArray, $value, $addIndex + $value[3]);
            $addIndex++;
        } 

        $arrayOfIntoDiv = Array();
        $count2 = 0;
        foreach ($this->dataArray as $value) {
            if ($value[3] != 0 && $value[4] == "true") {
                $arrayOfIntoDiv[$count2] = $value;
                $count2++;
            }
        }
        unset($value);
        $arrayOfIntoDiv = $this->bubbleSort($arrayOfIntoDiv);
        $addIndex1 = 1;
        foreach ($arrayOfIntoDiv as $value) {
            $dummyArray = $this->insertArray(
                        $dummyArray, $value, $addIndex + $value[3]);
            $addIndex1++;
        } 
        echo "<pre>"; print_r($dummyArray); echo "</pre>";
 
        $this->newArray = $dummyArray;
    }

}

$split = new Split();
$split->setData();
$split->arrangeData();
$split->mkTableAndInsert($split->newArray);
