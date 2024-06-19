let allUsers = [];

function init(){
    animate();
    loadUsers();
}
function animate(){

if (window.innerWidth > 550) {
setTimeout(() => {
    document.getElementById('logo-container').classList.add('animate');
    document.getElementById('login-site').classList.add('animate-login-site');
    setTimeout(() => {
        document.getElementById('signUp-Container').style.opacity = "1";
        document.getElementById('login-container').style.opacity = "1";
        document.getElementById('imprint-container').style.opacity = "1";
    }, 500);
}, 500);
}else{
    document.getElementById('logo').src ="./assets/img/join_logo_WHT.svg";
    setTimeout(() => {
        document.getElementById('logo-container').classList.add('animate');
        document.getElementById('login-site').classList.add('animate-login-site');
        setTimeout(() => {
            document.getElementById('signUp-Container').style.opacity = "1";
            document.getElementById('login-container').style.opacity = "1";
            document.getElementById('imprint-container').style.opacity = "1";
            document.getElementById('logo').src ="./assets/img/join_logo_DARK.svg";
        }, 500);
    }, 500);
}
}

function goToSignupSite() {
    document.getElementById('signUp-Container').style.opacity = "0";
    document.getElementById('login-container').style.display = "none";
    document.getElementById('signup-site-container').style.display = "flex";

    let signupSite = document.getElementById('signup-site-container');
    signupSite.style.opacity = "1";
    signupSite.innerHTML = `
     <form action="" onsubmit="return false" id="signupForm">
        <div onclick="goToLoginSite()" class="arrow-left-container">
          <img src="./assets/img/back_icon.svg">
          <div class="h1-container">
            <h1>Sign up</h1>
            <div class="line"></div>
          </div>
        </div>

        <div class="inputs-container flex-col-just-center">
            <input id="username" type="text" required placeholder="Name" class="input0">
            <input id="email" type="email" required placeholder="Email" class="input1">
            <input id="password" type="text" required placeholder="Password" class="input2">
            <input id="password" type="text" required placeholder="Confirm Password" class="input2">
            <div class="checkbox-signup-site">
                <input type="checkbox">
                <span>I accept <a href="#">Privacy Policy</a></span>
            </div>
        </div>
        <div class="login-buttons-container">
            <button type="submit" class="login-button" onclick="signupNeuUser()">Sign up</button>
        </div>
    </form>`;
}

function goToLoginSite() {
    document.getElementById('signUp-Container').style.opacity = "1";
    document.getElementById('login-container').style.display = "flex";
    document.getElementById('signup-site-container').style.display = "none";
}



function loadUsers() {
    let database = firebase.database();
    let usersEntries = database.ref("users");
  
    usersEntries.on("value", function (snapshot) {
   
      allUsers = [];
      snapshot.forEach(function (childSnapshot) {
        let user = childSnapshot.val();
        allUsers.push(user);
  
      });
    });
  }
function logIn(){
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;
}

// function signupNeuUser(){
//     let loginForm = document.getElementById("loginForm");
//     loginForm.addEventListener("submit", (e) => {
//         e.preventDefault();
      
//         let username = document.getElementById("username");
//         let password = document.getElementById("password");

//   if (username.value == "" || password.value == "") {
//     alert("Ensure you input a value in both fields!");
//   } else {
//     // perform operation with form input
//     alert("This form has been successfully submitted!");
//     console.log(
//       `This form has a username of ${username.value} and password of ${password.value}`
//     );

//     username.value = "";
//     password.value = "";
//   }
// });
// }