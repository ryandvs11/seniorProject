(function(){

	var sessToken = localStorage.getItem("sessionToken");
	var firstName; 
	var lastName;
	var birthdayMonth;
	var birthdayDay;
	var birthdayYear;
	var birthday;
	var email;
	var phoneNumber;
	var username;
	var password;
	var repPassword;
	
	function getProfilePic(){
		var imageFound = false;
		$.post("scripts.php",{"sessionToken":sessToken,"task":"get profile pic"},function(data){
				if(data.hasPic == "false") return;
				imageFound = true;
				document.getElementById("profile-image-border").style= "background-image:url('"+data.pic+"')"
			},"json");
			return imageFound;
	}//function getProfilePic()
	
	function loadAboutMe(){
		document.getElementById("about-me-div").innerHTML = document.getElementById("about-me-textarea").value;
	}
	
	var pageTask = document.getElementById("page").getAttribute("task");
	
	if(pageTask == "register"){
	
	var formDivs = document.getElementsByClassName("form-div");
	
	document.getElementById("back1").onclick = function(){
		formDivs[0].classList.remove("hide");
		formDivs[1].classList.add("hide");
	}//back1
	
	document.getElementById("back2").onclick = function(){
		formDivs[1].classList.remove("hide");
		formDivs[2].classList.add("hide");
	}//back1
	
	document.getElementById("back3").onclick = function(){
		formDivs[2].classList.remove("hide");
		formDivs[3].classList.add("hide");
	}//back1
	
	document.getElementById("next1").onclick = function(){
		firstName = document.getElementById("first-name").value;
		lastName = document.getElementById("last-name").value;
		// birthdayMonth = document.getElementById("birthday-month").value;
		// birthdayDay = document.getElementById("birthday-day").value;
		// birthdayYear = document.getElementById("birthday-year").value;
		birthday = document.getElementById("birthday").value;
		if(!firstName || !lastName || !birthday) return;
		// birthday = birthdayYear+"-"+birthdayMonth+"-"+birthdayDay;//format birthday
		formDivs[0].classList.add("hide");
		formDivs[1].classList.remove("hide");
	}//function
	
	//make it so when typing birthday the cursor jumps to next input
	// document.getElementById("birthday-day").addEventListener("keyup", function(){
	// 	var number = this.value.toString();
	// 	if(number.length == 2){
	// 		document.getElementById("birthday-month").focus();
	// 		document.getElementById("birthday-month").select();
	// 	}//if
	// });
	// document.getElementById("birthday-month").addEventListener("keyup", function(){
	// 	var number = this.value.toString();
	// 	if(number.length == 2){
	// 		document.getElementById("birthday-year").focus();
	// 		document.getElementById("birthday-year").select();
	// 	}//if
	// });
	// //make sure the year isn't more than 4 digits
	// document.getElementById("birthday-year").addEventListener("keydown",function(e){
	// 	var value = this.value;
	// 	var valueString = value.toString();
	// 	if(valueString.length >= 4 && e.keyCode!=8){
	// 		e.preventDefault();
	// 	}//if
	// });

	document.getElementById("next2").onclick = function(){
		if(!gender) return;
		formDivs[1].classList.add("hide");
		formDivs[2].classList.remove("hide");
		
	}//function
		document.getElementById("male-img").onclick = function(){
			this.classList.add("border1");
			gender="male";
			document.getElementById("female-img").classList.remove("border1");
		}
		document.getElementById("female-img").onclick = function(){
			this.classList.add("border1");
			gender="female";
			document.getElementById("male-img").classList.remove("border1");
		}
	document.getElementById("next3").onclick = function(){
		email = document.getElementById("email").value;
		phoneNumber = document.getElementById("phone-number").value;
		if(!email || !phoneNumber) return;
		formDivs[2].classList.add("hide");
		formDivs[3].classList.remove("hide");
	}//function
	}//if(pageTaks == "register")
	
	if(pageTask == "register" || pageTask == "login"){
	var form = document.getElementById("form");
	localStorage.removeItem('username',username);
	
	form.onsubmit = function(e){
	e.preventDefault();
	var task = form.getAttribute("task");
	
	//registration
	if(task == "register"){
	
	username = document.getElementById("username").value;
	password = document.getElementById("password").value;
	repPassword = document.getElementById("rep-password").value;
	
	if(!firstName ||!lastName || !username || !email || !phoneNumber || !password || !repPassword || !gender || !birthday) return;
	if(password.length < 6){
		alert("Password must be at least 6 characters");
		return;
	};
	if(password != repPassword){ 
		alert("Passwords don't match");
		return;
	}
	
	var postData = {"firstName":firstName, "lastName":lastName, 
	"username":username, "phoneNumber":phoneNumber, "email":email, 
	"password":password, "task":task, "gender":gender, "birthday":birthday};
	
	$.post("scripts.php", postData, function(data){
	
		if(data == "username error"){
			alert("That username is taken");
			return;
		}//if
		if(data == "email error"){
			alert("That email is taken");
			return;
		}//if
		window.location.replace("index.html");
		localStorage.setItem("sessionToken",data);
	});//post
	}//task == "register"
	
	//login
	if(pageTask == "login") localStorage.removeItem("sessionToken");
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
				return;
			}//if
			if(data == "wrong code"){
				alert("Incorrect code");
				return;
			}//if
			
				localStorage.setItem('username',username);
				window.location.replace("index.html");
				localStorage.setItem("sessionToken",data);
		})//post
	}//task == "login"
	
	}//on form submit
	}//if(pageTask == "register" || pageTask == "login")
	
	//User is on profile page
	if(document.getElementById("profile-pic-form")){
		
		getProfilePic();
		
		document.getElementById("profile-pic-hidden").value = sessToken;
		//When changing profile image, submit form once image is selected
		document.getElementById("profile-pic-input").onchange = function(){
			document.getElementById("profile-pic-form").submit();
			document.getElementById("profile-image-border").innerHTML = "<img class='loading-image' src='images/gears.gif'>"
			getProfilePic();
			var getPicInterval = setInterval(function(){
				if(!getProfilePic()){
					clearInterval(getPicInterval);
					document.getElementById("profile-image-border").innerHTML = "";
				}
			},500);
			
		}
		
		//handle edit about-me toggle
		document.getElementById("edit-toggle").onclick = function(){
			document.getElementById("about-me-textarea").classList.remove("hide");
			document.getElementById("about-me-div").classList.add("hide");
		}
		
		//submit user info
		document.getElementById("user-info-form").onsubmit = function(e){
			e.preventDefault();
			var formValues = $("#user-info-form").serialize();
			$.post("scripts.php",{"sessToken":sessToken,"formValues":formValues},function(data){
				document.getElementById("submit-feedback").innerHTML = "";
				alert("Update!");
			});
			
			//handle edit about-me toggle after submit
			loadAboutMe()
			document.getElementById("about-me-textarea").classList.add("hide");
			document.getElementById("about-me-div").classList.remove("hide");
			
		}//onsubmit
		
		//get user info
		$.post("scripts.php",{"sessToken":sessToken,"task":"loadinfo"},function(data){
			
			for(var i=0; i < data.returnArray.length; i++){
				var formElements = document.getElementsByName(data.returnArray[i][0]);
				for(var y=0; y < formElements.length; y++){
					if(formElements[y].type=="checkbox" || formElements[y].type=="radio"){
						if(formElements[y].value == data.returnArray[i][1]){
							formElements[y].checked = true;
						}//if
					}//if
					else{
						formElements[y].value = data.returnArray[i][1]
					}//else
				}//for
			}//for
			
			loadAboutMe()
		},"json");
		
	}//if document.getElementById("profile-pic-form"
	
	
	//Page that loads users when searching for partners
	if(pageTask == "user-search"){
	
		$.post("scripts.php",{"sessToken":sessToken,"task":"loadusers"},function(data){
			
			document.getElementById("user-list-div").innerHTML = data.list;
			
		},"json");
	
	}//user-list-div
	
	//Chat.html
	if(pageTask == "chat"){
		alert()
	}//if
	
})();


(function ($) {
    "use strict";


    /*==================================================================
    [ Validate ]*/
    var input = $('.validate-input .input100');

    $('.validate-form').on('submit',function(){
        var check = true;

        for(var i=0; i<input.length; i++) {
            if(validate(input[i]) == false){
                showValidate(input[i]);
                check=false;
            }
        }

        return check;
    });


    $('.validate-form .input100').each(function(){
        $(this).focus(function(){
           hideValidate(this);
        });
    });

    function validate (input) {
        if($(input).attr('type') == 'email' || $(input).attr('name') == 'email') {
            if($(input).val().trim().match(/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/) == null) {
                return false;
            }
        }
        else {
            if($(input).val().trim() == ''){
                return false;
            }
        }
    }

    function showValidate(input) {
        var thisAlert = $(input).parent();

        $(thisAlert).addClass('alert-validate');
    }

    function hideValidate(input) {
        var thisAlert = $(input).parent();

        $(thisAlert).removeClass('alert-validate');
    }
    
    /*==================================================================
    [ Show pass ]*/
    var showPass = 0;
    $('.btn-show-pass').on('click', function(){
        if(showPass == 0) {
            $(this).next('input').attr('type','text');
            $(this).find('i').removeClass('fa-eye');
            $(this).find('i').addClass('fa-eye-slash');
            showPass = 1;
        }
        else {
            $(this).next('input').attr('type','password');
            $(this).find('i').removeClass('fa-eye-slash');
            $(this).find('i').addClass('fa-eye');
            showPass = 0;
        }
        
    });
    

})(jQuery);