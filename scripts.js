(function(){
	
	var form = document.getElementById("form");
	localStorage.removeItem('username',username);
	
	form.onsubmit = function(e){
	e.preventDefault();
	var task = form.getAttribute("task");
	
	//registration
	if(task == "register"){
	var firstName = document.getElementById("first-name").value;
	var lastName = document.getElementById("last-name").value;
	var username = document.getElementById("username").value;
	var email = document.getElementById("email").value;
	var phoneNumber = document.getElementById("phone-number").value;
	var password = document.getElementById("password").value;
	var repPassword = document.getElementById("rep-password").value;
	
	if(!firstName ||!lastName || !username || !email || !phoneNumber || !password || !repPassword) return;
	if(password.length < 6){
		alert("Password must be at least 6 characters");
		return;
	};
	if(password != repPassword) alert("Passwords don't match");
	
	var postData = {"firstName":firstName, "lastName":lastName, "username":username, "phoneNumber":phoneNumber, "email":email, "password":password, "task":task};
	
	$.post("scripts.php", postData, function(data){
	
		if(data == "username error"){
			alert("That username is taken");
			return;
		}//if
		if(data == "email error"){
			alert("That email is taken");
			return;
		}//if
		window.location.replace("login.html");
	});//post
	}//task == "register"
	
	//login
	if(task == "login"){
		var username = document.getElementById("username").value;
		var password = document.getElementById("password").value;
		var code = document.getElementById("code").value;
		var postData = {"username":username, "password":password, "code":code, "task":task};
		if(!username || !password) return;
		
		$.post("scripts.php", postData, function(data){
		
			if(data == "wrong"){
				alert("Incorrect login credentials");
				return;
			}//if data == "wrong"
			
			if(data == "get code"){
				$("#username-div").addClass("hide");
				$("#password-div").addClass("hide");
				$("#code-div").removeClass("hide");
				setTimeout(function(){
   					alert("Please enter code that was texted");
				}, 5);
			}//if
			if(data == "wrong code"){
				alert("Incorrect code");
			}//if
			if(data == "success"){
				localStorage.setItem('username',username);
				window.location.replace("index.html");
			}//if
			
		})//post
	}//task == "login"
	
	}
	
})();