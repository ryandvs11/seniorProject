<?php
mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
$mysqli = new mysqli("localhost","root","");
$mysqli->select_db("fitlink");
$task = $_POST["task"];

$zip1 = 0;
$zip2 = 0;

if($task == "register" || $task == "login"){
$password = $_POST["password"];
$username = $_POST["username"];
}

if($task == "register"){

$firstName = $_POST["firstName"];
$lastName = $_POST["lastName"];
$birthday = $_POST["birthday"];
$gender = $_POST["gender"];
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
$mysqli->query("INSERT INTO users_info VALUES ('','$username','$birthday','$gender','','')");

echo $code;

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
echo $code;

}//if $task = "login"

elseif(isset($_FILES["profile-pic"])){
	$code = $_POST["code"];
	$query = $mysqli->query("SELECT * FROM users WHERE code1='$code'");
	$get = $query->fetch_assoc();
	$username = $get["username"];
	$imageName = $_FILES["profile-pic"]["name"];
	$imagePath = "images/uploads/".$imageName;
	$check = getimagesize($_FILES["profile-pic"]["tmp_name"]);
	if($check===false) return;
	move_uploaded_file($_FILES["profile-pic"]["tmp_name"],$imagePath);
	$mysqli->query("UPDATE users_info SET profile_pic='$imageName' WHERE username='$username'");
	
}//if $_FILES["profile-pic"]

elseif($task == "get profile pic"){
	$sessionToken = $_POST["sessionToken"];
	$query = $mysqli->query("SELECT * FROM users WHERE code1='$sessionToken'");
	$get = $query->fetch_assoc();
	$username = $get["username"];
	$query = $mysqli->query("SELECT * FROM users_info WHERE username='$username'");
	$get = $query->fetch_assoc();
	$profilePic = $get["profile_pic"];
	$picturePath = "images/uploads/".$profilePic;
	$hasPic = ($profilePic)? "true":"false";
	$return["hasPic"] = $hasPic;
	$return["pic"] = $picturePath;
	echo json_encode($return);
}//$task == "get profile pic"

elseif(isset($_POST["formValues"])){
	$sessionToken = $_POST["sessToken"];
	$formValues = str_replace("+"," ",$_POST["formValues"]);//remove + that serialize adds
	$formValues = $mysqli->real_escape_string($formValues);
	$query = $mysqli->query("SELECT * FROM users WHERE code1='$sessionToken'");
	$get = $query->fetch_assoc();
	$username = $get["username"];
	$query = $mysqli->query("UPDATE users_info SET info='$formValues' WHERE username='$username'");
}//elseif 

elseif($task == "loadinfo"){

	$sessionToken = $_POST["sessToken"];
	$query = $mysqli->query("SELECT * FROM users WHERE code1='$sessionToken'");
	$get = $query->fetch_assoc();
	$username = $get["username"];
	$query = $mysqli->query("SELECT * FROM users_info WHERE username='$username'");
	$get = $query->fetch_assoc();
	
	/*
	$userInfo = str_replace("=",",",$get["info"]);
	$infoArray = explode("&",$userInfo);
		*/
	$returnArray = array();
	$x = 0;	
	$infoArray = explode("&",$get["info"]);	
	foreach($infoArray as $item){
		$returnArray[$x] = explode("=",$item);
		$x++;
	}
		
	$return["returnArray"] = $returnArray;
	
	echo json_encode($return);
}//elseif

elseif($task == "loadusers"){
	
	$sessionToken = $_POST["sessToken"];
	$query = $mysqli->query("SELECT * FROM users WHERE code1='".$sessionToken."'");
	$get = $query->fetch_assoc();
	$username = $get["username"];
	
	$query = $mysqli->query("SELECT * FROM users");
	
	$return["list"] = "";
	
	while($get = $query->fetch_array()){
		
		$usernameInList = $get["username"];
		$fName = $get["first_name"];
		$lName = $get["last_name"];
		
		
		$query2 = $mysqli->query("SELECT * FROM users_info WHERE username='".$usernameInList."'");
		$get2 = $query2->fetch_assoc();
		$profile_pic = $get2["profile_pic"];
		$userInfo = $get2["info"];
		if($userInfo){
			$zip = explode("zip=",$userInfo);
			$zip = explode("&",$zip[1]);
			$zip1 = $zip[0];
		}//if
		
		//get 'about me' from user info
		if($userInfo){
			$aboutMe = explode("=",$userInfo);
			if($aboutMe[0] == "about-me"){
				$aboutMe = $aboutMe[1];
				$aboutMe = explode("&",$aboutMe);
				$aboutMe = $aboutMe[0];
			}//if
			else $aboutMe = "";
		}//if
		else $aboutMe = "";
		
		if(!$profile_pic) $profile_pic = "profile-placeholder.png";
		else $profile_pic = "uploads/".$profile_pic;
		
		if($username != $usernameInList) $chatLink = "<a href='chat.html?".$usernameInList."'>Chat</a>";
		else $chatLink = "";
		
		//get distance between user and other users
		$query2 = $mysqli->query("SELECT * FROM users_info WHERE username='".$username."'");
		$get2 = $query2->fetch_assoc();
		$userInfo = $get2["info"];
		if($userInfo){
			$zip = explode("zip=",$userInfo);
			$zip = explode("&",$zip[1]);
			$zip2 = $zip[0];
		}//if
		
		$url = "https://www.zipcodeapi.com/rest/BM0FVUG0xYdAHz99MFWrWzv9yvR3w0QWwds5x6dOqNE35OryNsbCvVqIHCHFPYFJ/distance.json/".$zip1."/".$zip2."/mile";
		$contents = file_get_contents($url);
		$distance = json_decode($contents,true);
		$distance = round($distance["distance"]);
		
		$return["list"] .= "
		<div class='user-div text-small' style='text-align:left'>
		
		<div class='profile-pic-list inline-top' style='background-image:url(\"images/".$profile_pic."\")'></div>
		
		<div class='inline-top' style='position:relative;width:100%;max-width:290px;height:100%;'>
		".$fName." ".$lName."
		<p>
		".$aboutMe."
		<div style='text-align:left;position:absolute;bottom:5px;left:0px'>
		".$distance." miles away
		</div>
		<div style='text-align:right;position:absolute;bottom:5px;right:0px'>
		".$chatLink."
		</div>
		</div> 
		</div>";
	}//while
	
	echo json_encode($return);
}

elseif($task == "loadchat"){
	
	
	$sessionToken = $_POST["sessToken"];
	$query = $mysqli->query("SELECT * FROM users WHERE code1='".$sessionToken."'");
	$get = $query->fetch_assoc();
	$username = $get["username"];
	$chatWithUser = $_POST["chatWithUser"];
	$query = $mysqli->query("SELECT * FROM chat WHERE from_user='".$username."' AND to_user='".$chatWithUser."' OR
	to_user='".$username."' AND from_user='".$chatWithUser."' ORDER BY time ASC");
	
	$return["messages"] = "";
	
	while($get = $query->fetch_array()){
		$fromUser = $get["from_user"];
		if($fromUser == $username) $class = "message1";
		else $class = "message2";
		$return["messages"] .= "<div class='".$class."'>".$get["message"]."</div>";
	}//while
	
	echo json_encode($return);
}

elseif($task == "postchat"){
	
	$sessionToken = $_POST["sessToken"];
	
	$query = $mysqli->query("SELECT * FROM users WHERE code1='".$sessionToken."'");
	$get = $query->fetch_assoc();
	$username = $get["username"];
	
	$chatWithUser = $_POST["chatWithUser"];
	$message = $_POST["message"];
	$time = time();
	
	if(!$username || !$chatWithUser) return;
	$query = $mysqli->query("INSERT INTO chat VALUES('','".$chatWithUser."','".$username."','".$message."','".$time."')");
	
	$return["message"] = $message;
	
	echo json_encode($return);
	
}

?>