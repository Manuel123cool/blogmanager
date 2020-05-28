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
                    utf8_encode($row["comment"]), utf8_encode($row['date']), 
                        $row['reply_num'], $row['into_div']); 
                $count++;
            }

        }
        $this->dataArray = $array;
    }

    function mkTableAndInsert($array) {
        if (!is_array($array)) {
            return -1; 
        }

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
        //echo "<pre>"; print_r($dummyArray); echo "</pre>"; 
        $addIndexVar = null;
        foreach ($arrayOfIntoDiv as $value) {
            $addIndex1 = 0;
            $count3 = 0;
            $noSameElemNum = true;
            while ($noSameElemNum) {
                if ($dummyArray[$count3][3] == $value[3] && 
                    $dummyArray[$count3][4] == "false") {
                    $noSameElemNum = false; 
                } 
                if ($dummyArray[$count3][3] != 0) {
                    $addIndex1++; 
                } 
                $count3++;
            }

            $addIndex1 += $addIndexVar;
            $dummyArray = $this->insertArray(
                        $dummyArray, $value, $addIndex1 + $value[3]);
            $addIndexVar++; 
        } 
        $this->newArray = $dummyArray;
    }

    function testUntilZero($array, $start) {
        if (!is_array($array)) {
            return -1; 
        }
        for ($i = $start; $i < count($array); $i++) {
            if ($array[$i][3] == 0 && $array[$i][4] == "false") {
                return $i;
            }
        }
        return -1;
    }

    function reUntilIndex($array) {
        if (!is_array($array)) {
            return -1; 
        }

        $splitAt = 1000;
        $pointsCounter = 0;
        $tooSmall = true;
        foreach ($array as $key => $value) {
            $pointsCounter += 100;
            $stringLength = strlen($value[1]);
            if ($stringLength > 100) {
                $pointsCounter += ($stringLength / 100) * 20;
            } else {
                $pointsCounter += 20;
            }
            if ($pointsCounter > $splitAt) {
                $tooSmall = false;
                if ($value[3] == 0 && $value[4] == "false") {
                    return $key; 
                } else {
                    return $this->testUntilZero($array, $key); 
                }
            }
        } 
        if ($tooSmall) {
            return 0;
        }
    }
    
    function reInsertArray($array, $untilIndex) {
        $reArray = Array();    
        foreach ($array as $key => $value) {
            if ($key == $untilIndex) {
                break;
            }
            $reArray[$key] = $value;
        }
        return $reArray;
    }

    function reDelPortion($array, $untilIndex) {
        $reArray = Array();    
        $count = 0;
        for ($i = $untilIndex; $i < count($array); $i++) {
            $reArray[$count] = $array[$i]; 
            $count++;
        }

        return $reArray;
    }

    function split() {
        $split = true; 
        $dummyArray = $this->newArray;
        $count = 0;
        while ($split) {
            $untilIndex = $this->reUntilIndex($dummyArray); 
            if ($untilIndex == 0) {
                $this->mkTAbleAndInsert($dummyArray);
                $split = false;
            } elseif  ($untilIndex != -1) {
                $insertArray = $this->reInsertArray($dummyArray, $untilIndex); 
                $this->mkTAbleAndInsert($insertArray);
                $dummyArray = $this->reDelPortion($dummyArray, $untilIndex);
            } else  {
                $this->mkTAbleAndInsert($dummyArray);
                $split = false; 
            }
        }
    }

    function deleteTables() {
        $count = 0;
        $table = true;
        while ($table) {
            $conn = $this->conn();
            if ($conn->connect_error) {
              die("Connection failed: " . $conn->connect_error);
            }

            $sql = "select 1 from comments$count LIMIT 1";
            $result = $conn->query($sql);

            if($result !== FALSE) {
                $conn = $this->conn();

                $result = $conn->query("DROP TABLE comments$count");

                if($result !== FALSE)
                {
                   //echo("This table has been deleted.");
                }else{
                   echo("This table has not been deleted.");
                }
            } else {
                $table = false;
            }
            $count++;
        }
    }
}

$split = new Split();
