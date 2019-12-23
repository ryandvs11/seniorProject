<?php
mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
$mysqli = new mysqli("localhost","root","");
$mysqli->select_db("fitlink");

$task = $_POST["task"];
$password = $_POST["password"];
$username = $_POST["username"];

if($task == "register"){

$firstName = $_POST["firstName"];
$lastName = $_POST["lastName"];
$email = $_POST["email"];
$phoneNumber = $_POST["phoneNumber"];
$query = $mysqli->query("SELECT * FROM users WHERE email='$email'");
$numrows = $query->num_rows;
	if($numrows > 0){
		echo "email error";
		return;
	}//if
$query = $mysqli->query("SELECT * FROM users WHERE username='$username'");
$numrows = $query->num_rows;
	if($numrows > 0){
		echo "username error";
		return;
	}//if
$time = time();
$salt = rand();
$code = rand(100000,999999);
$hashPassword = hash("sha256", $salt.$password, FALSE);
$mysqli->query("INSERT INTO users VALUES ('','$firstName','$lastName','$username','$email','$phoneNumber','$hashPassword','$salt','$time','$code','0')");

echo "success";

}//if $task = "register"

elseif($task == "login"){

$code = $_POST["code"];
$query = $mysqli->query("SELECT * FROM users WHERE username='$username'");
$numrows = $query->num_rows;
$get = $query->fetch_assoc();
$salt = $get["salt"];
$storedCode = $get["code1"];
$hashPassword = hash("sha256", $salt.$password, FALSE);

	if($hashPassword != $get["password"] || $numrows < 1){
	echo "wrong";
	return;
	}//if

	if(!$code){
	echo "get code";
	return;
	}//if

	if($code != $storedCode){
	echo "wrong code";
	return;
	}//if

$code = rand(100000,999999);
$mysqli->query("UPDATE users SET code1='$code' WHERE username='$username'");
echo "success";

}//if $task = "login"

?>