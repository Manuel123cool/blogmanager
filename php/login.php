<?php

if ($_POST["name"] == "Manuel" && $_POST["password"] == "Password") {
    setcookie("myname", "Manuel", NULL, NULL, NULL, TRUE, TRUE); 
    setcookie("mypassword", "Password", NULL, NULL, NULL, TRUE, TRUE); 
    echo "went fine";
} else {
    echo "somenthing went wrong";
}

