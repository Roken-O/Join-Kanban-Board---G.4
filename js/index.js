let allUsers = [];

function init() {
    animate();
    loadUsers();
}

function signup() {
    let checkEmailSignup = true;
    let emailSignup = document.getElementById("email-signup").value;
    let passwordSignup = document.getElementById("password-signup").value;
    let confirmPasswordSignup = document.getElementById("confirmPassword-signup").value;

    if (passwordSignup != confirmPasswordSignup) {
        checkPassword();
    }
    else {
        const checkUser = allUsers.find(user => user.email === emailSignup);
        if (checkUser) {
            checkEmailSignupFunk(checkUser['email']);
        } else {
            showMessageAlert();
            setTimeout(() => {
                allUsers.push({ email: emailSignup, password: passwordSignup, registered: true });
                saveNewUser(emailSignup, passwordSignup);
                loadUsers();
                window.location.href = 'index.html';
            }, 2250);
        }
    }
}


function checkEmailSignupFunk(checkEmail) {
    let emailSignup = document.getElementById("email-signup").value;

    document.getElementById('existing-email').style.display = (emailSignup == checkEmail) ? "flex" : "none";
    // if (emailSignup == checkEmail) {
    //     document.getElementById('existing-email').style.display = "flex";
    // } else {
    //     document.getElementById('existing-email').style.display = "none";
    // }
}



function checkPassword() {
    let passwordSignup = document.getElementById("password-signup").value;
    let confirmPasswordSignup = document.getElementById("confirmPassword-signup").value;

    document.getElementById('wrong-password').style.display = (passwordSignup != confirmPasswordSignup) ? "flex" : "none";

    // if (passwordSignup != confirmPasswordSignup) {
    //     document.getElementById('wrong-password').style.display = "flex";
    // } else {
    //     document.getElementById('wrong-password').style.display = "none";
    // }
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

function saveNewUser(emailSignup, passwordSignup) {
    let user = {
        email: emailSignup,
        password: passwordSignup,
        registered: false
    };
    let database = firebase.database();
    let usersLength = allUsers.length - 1;
    let userEntry = database.ref("users/" + usersLength);
    userEntry.set(user);
}

function showMessageAlert() {
    document.getElementById('alertMessage').style.display = "flex";
    let alertMessage = document.getElementById("popup-message");

    setTimeout(() => {
        alertMessage.classList.add('animate-popup-message');
        setTimeout(() => {
            alertMessage.classList.remove('animate-popup-message');
            document.getElementById('alertMessage').style.display = "none";
        }, 2000);
    }, 250);
}

function login(event) {
    event.preventDefault();
    let email = document.getElementById("email");
    let password = document.getElementById("password");
    let user = allUsers.find(u => u.email == email.value && u.password == password.value);
    console.log(user);
    if (user) {
        user['registered'] = true;
        window.location.href = 'summary.html';
    }
}

function goToSummarySite() {
    let email = document.getElementById("email");
    let password = document.getElementById("password");
    email.value = "Guest";
    password.value = "123456";
    window.location.href = 'summary.html';
}

function animate() {
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
    } else {
        document.getElementById('logo').src = "./assets/img/join_logo_WHT.svg";
        setTimeout(() => {
            document.getElementById('logo-container').classList.add('animate');
            document.getElementById('login-site').classList.add('animate-login-site');
            setTimeout(() => {
                document.getElementById('signUp-Container').style.opacity = "1";
                document.getElementById('login-container').style.opacity = "1";
                document.getElementById('imprint-container').style.opacity = "1";
                document.getElementById('logo').src = "./assets/img/join_logo_DARK.svg";
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
     <form onsubmit="signup(); return false;">
        <div onclick="goToLoginSite()" class="arrow-left-container">
          <img src="./assets/img/back_icon.svg">
          <div class="h1-container">
            <h1>Sign up</h1>
            <div class="line"></div>
          </div>
        </div>

        <div class="inputs-container flex-col-just-center">
            <input id="username" type="text" required placeholder="Name" class="input0">
            <input oninput="checkEmailSignupFunk()" id="email-signup" type="email" required placeholder="Email" class="input1">
             <div id="existing-email" class="wrong-password-container d-none">This email address already exists!</div>
            <input oninput="checkPassword()" type="password" id="password-signup" type="text" required placeholder="Password" class="input2">
            <input oninput="checkPassword()" type="password" id="confirmPassword-signup" type="text" required placeholder="Confirm Password" class="input2">
            <div id="wrong-password" class="wrong-password-container d-none">Ups! your password doesn't match</div>
            <div class="checkbox-signup-site">
                <input oninvalid="this.setCustomValidity('You must accept the Privacy Policy')" oninput="this.setCustomValidity('')" type="checkbox" required>
                <span>I accept <a href="#">Privacy Policy</a></span>
            </div>
        </div>
        <div class="login-buttons-container">
            <button id="signup-button">signup</button>
        </div>
    </form>`;
}

function goToLoginSite() {
    document.getElementById('signUp-Container').style.opacity = "1";
    document.getElementById('login-container').style.display = "flex";
    document.getElementById('signup-site-container').style.display = "none";
}