let allUsers = [];
let clickState = 0;

// document.addEventListener("DOMContentLoaded", initIndex);

async function initIndex() {
    await checkLoadUsers();
    animate();
    checkInputs();
    usersSettoFalse();
}

function loadUsers() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            let database = firebase.database();
            let usersEntries = database.ref("users");
            usersEntries.on("value", function (snapshot) {
                allUsers = [];
                snapshot.forEach(function (childSnapshot) {
                    let user = childSnapshot.val();
                    user.id = childSnapshot.key;
                    allUsers.push(user);
                });
                resolve('hat geklappt!');
            }, () => {
                reject('hat nicht geklappt!');
            });
        }, 10);
    });
}

async function checkLoadUsers() {
    let prom = await loadUsers();
    console.log(prom);
}

function checkInputs() {
    document.getElementById("email").value = '';
    document.getElementById("password").value = '';

    let rememberedEmail = localStorage.getItem('rememberedEmail');
    let rememberedPassword = localStorage.getItem('rememberedPassword');
    if (rememberedEmail) {
        document.getElementById("email").value = rememberedEmail;
        document.getElementById("password").value = rememberedPassword;
        document.getElementById("rememberMe").checked = true;
    }
}

async function signup() {
    let nameSignup = document.getElementById("username").value;
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
            if (passwordSignup.length > 5) {
                showMessageAlert();
                setTimeout(() => {
                    allUsers.push({ email: emailSignup, password: passwordSignup, name: nameSignup });
                    saveNewUser(emailSignup, passwordSignup, nameSignup);
                    checkLoadUsers();
                    window.location.href = 'index.html';
                }, 2250);
            }
            else {
                document.getElementById('wrong-password').innerHTML = `Password must be at least 6 characters!`;
                document.getElementById('wrong-password').style.display = (passwordSignup.length <= 5) ? "flex" : "none";
            }
        }
    }
}

function checkEmailSignupFunk(checkEmail) {
    let emailSignup = document.getElementById("email-signup").value;
    document.getElementById('existing-email').style.display = (emailSignup == checkEmail) ? "flex" : "none";
}

function checkPassword() {
    let passwordSignup = document.getElementById("password-signup").value;
    let confirmPasswordSignup = document.getElementById("confirmPassword-signup").value;
    document.getElementById('wrong-password').style.display = (passwordSignup != confirmPasswordSignup) ? "flex" : "none";
}

function saveNewUser(emailSignup, passwordSignup, nameSignup) {
    let initialName = getInitials(nameSignup);
    let user = {
        email: emailSignup,
        password: passwordSignup,
        name: nameSignup,
        initial: initialName,
        registered: false
    };
    let database = firebase.database();
    let usersLength = allUsers.length;
    let userEntry = database.ref("users/" + usersLength);
    userEntry.set(user);
}

let getInitials = function (string) {
    let name = string.split(" "),
        initials = name[0].substring(0, 1).toUpperCase();

    if (name.length > 1) {
        initials += name[name.length - 1].substring(0, 1).toUpperCase();
    }
    return initials;
};

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
    document.getElementById('wrong-email').classList.add('d-none');
    document.getElementById('wrong-password-login').style.display = "none";
    let email = document.getElementById("email");
    let password = document.getElementById("password");
    let rememberMe = document.getElementById("rememberMe").checked;
    let user = allUsers.find(u => u.email == email.value);
    if (user) {
        if (user['password'] == password.value) {
            let userID = user['id'];
            userRegisterd(userID);
            if (rememberMe) {
                localStorage.setItem('rememberedEmail', email.value);
                localStorage.setItem('rememberedPassword', password.value);
            } else {
                localStorage.removeItem('rememberedEmail');
                localStorage.removeItem('rememberedPassword');
            }
            window.location.href = 'summary.html';
        }
        else {
            checkPasswordLogin(user['password'], password.value);
            document.getElementById('password').value = '';
        }
    }
    else {
        document.getElementById('wrong-email').classList.remove('d-none');
    }
}

function userRegisterd(userID) {
    let database = firebase.database();
    for (let i = 0; i < allUsers.length; i++) {
        let notLoged = allUsers[i]['id'];
        if (userID != notLoged) {
            let userEntry = database.ref("users/" + notLoged + "/registered/");
            userEntry.set(false);
        }
    }
    let userEntry = database.ref("users/" + userID + "/registered/");
    userEntry.set(true);
}

function checkPasswordLogin(userPassword, loginPassword) {
    document.getElementById('wrong-password-login').style.display = (userPassword == loginPassword) ? "none" : "flex";
}

function togglePasswordVisibility(password) {
    let passwordInput = document.getElementById(password);
    if (clickState > 0) {
        passwordInput.type = (passwordInput.type == 'password') ? 'text' : 'password';
    }
    clickState++;
}

function goToSummarySite() {
    let email = document.getElementById("email");
    let password = document.getElementById("password");
    email.value = "guest@gmail.com";
    password.value = "123456";
    let user = allUsers.find(u => u.email == email.value);
    let userID = user['id'];
    userRegisterd(userID);
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

function goToLoginSite() {
    document.getElementById('signUp-Container').style.opacity = "1";
    document.getElementById('login-container').style.display = "flex";
    document.getElementById('signup-site-container').style.display = "none";
}

function goToSignupSite() {
    document.getElementById('signUp-Container').style.opacity = "0";
    document.getElementById('login-container').style.display = "none";
    document.getElementById('signup-site-container').style.display = "flex";

    let signupSite = document.getElementById('signup-site-container');
    signupSite.style.opacity = "1";
    signupSite.innerHTML = `
     <form onsubmit="signup(); return false;">
        <div class="arrow-left-container">
          <div onclick="goToLoginSite()" class="back-icon"> <img src="./assets/img/back_icon.svg"> </div>
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

async function usersSettoFalse() {
    let database = firebase.database();
    for (let i = 0; i < allUsers.length; i++) {
        let registeredID = allUsers[i]['id'];
        let userEntry = database.ref("users/" + registeredID + "/registered/");
        await userEntry.set(false);
    }
}
