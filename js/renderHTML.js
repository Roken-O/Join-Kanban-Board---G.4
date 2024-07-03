function getSignupSite() {
    return `
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
                <span>I accept <a onclick="goToPrivacyOrImprintOrHelp()" href="#">Privacy Policy</a></span>
            </div>
        </div>
        <div class="login-buttons-container">
            <button id="signup-button">signup</button>
        </div>
    </form>`;
}

function renderContactHTML(contact, i){
    return `
        <div
          id="contact-border${i}"
          onclick="showContactInfo('${contact.email}');showContactResponsive('${contact.email}','${i}');closePopUpEditDelete();changeBackground(${i});"
          class="flex-align-center contact-entry contact-border"
        >
        <div class="initial-name-email-container">
          <div style="background: ${contact.color}" class="first-letters-name-contactlist-bg">
            <span class="first-letters-name-contactlist">${getInitials(contact.name)}</span>
          </div>
          <div class="contact-name-email-contactlist">
            <span class="contact-name-contactlist">${contact.name}</span>
            <span class="email-contactlist">${contact.email}</span>
          </div>
        </div>
        </div>
      `;
}

function renderLine(initial){
    return `
          <div>
            <div class="initial-letter">${initial}</div>
            <div class="breakline-contactlist" id="contacts-without-breakline">
        `;
}