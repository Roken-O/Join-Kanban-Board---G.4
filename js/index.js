
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
     <form onsubmit="signupNeuUser()">
        <div onclick="goToLoginSite()" class="arrow-left-container">
          <img src="./assets/img/back_icon.svg">
          <div class="h1-container">
            <h1>Sign up</h1>
            <div class="line"></div>
          </div>
        </div>

        <div class="inputs-container flex-col-just-center">
            <input type="text" required placeholder="Name" class="input0">
            <input type="email" required placeholder="Email" class="input1">
            <input type="text" required placeholder="Password" class="input2">
            <input type="text" required placeholder="Confirm Password" class="input2">
            <div class="checkbox-signup-site">
                <input type="checkbox">
                <span>I accept <a href="#">Privacy Policy</a></span>
            </div>
        </div>
        <div class="login-buttons-container">
            <button class="login-button">Sign up</button>
        </div>
    </form>`;
}

function goToLoginSite() {
    document.getElementById('signUp-Container').style.opacity = "1";
    document.getElementById('login-container').style.display = "flex";
    document.getElementById('signup-site-container').style.display = "none";
}