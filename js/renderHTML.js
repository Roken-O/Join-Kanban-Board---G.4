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


//  Render functions Contacts

function renderContactHTML(contact, i){
    return `
        <div
          id="contact-border${i}"
          onclick="showContactInfo('${contact.email}');showContactResponsive('${contact.email}',${i});closePopUpEditDelete();changeBackground(${i});"
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

function renderContactResponisveHTML(j, currentColor, currentName, currentEmail, currentPhone ){
  return`
  <div class="flex-align-center contact-pic-name-container-mobil">
          <div style="background-color: ${currentColor}"  class="first-letters-name-bg-mobil">
            <span class="first-letters-name-mobil">${getInitials(currentName)}</span>
          </div>
          <div id="contact-name">
            <h2>${currentName}</h2>
            <div class="flex-align-center" id="contact-edit-delete">
              <div
                onclick="editContactPopUp();editContact('${currentEmail}')"
                class="flex-align-center"
                id="contact-edit"
              >
                <img
                  class="contact-pen-delete-img"
                  src="assets/img/pen_DARK.svg"
                  alt=""
                />
                <span>Edit</span>
              </div>
              <div class="flex-align-center" id="contact-delete">
                <img
                  class="contact-pen-delete-img"
                  src="/assets/img/delete_icon.svg"
                  alt=""
                />
                <span> Delete</span>
              </div>
            </div>
          </div>
        </div>
        <span id="span-contact-information">Contact Information</span>
        <div class="flex-col-just-center" id="email-telefon-contact">
          <div class="flex-col-just-center" id="email-contact">
            <span>Email</span>
            <a href="">${currentEmail}</a>
          </div>
          <div class="flex-col-just-center" id="phone-contact">
            <span>Phone</span>
            <a href="">${currentPhone}</a>
          </div>
        </div>
        <img
          onclick="openPopUpEditDelete()"
          class="button-more-options"
          src="./assets/img/button_more_options_dark_blue.svg"
          alt=""
        />
        <div
          onclick="closePopUpEditDelete()"
          id="PopUp-edit-delete-bg"
          class="PopUp-edit-delete-bg"
        >
          <div id="PopUp-edit-delete" class="PopUp-edit-delete">
            <div onclick="editContactPopUp();editContact('${currentEmail}')" class="PopUp-edit-pen">
              <img
                class="PopUp-edit-pen-img"
                src="./assets/img/pen_DARK.svg"
                alt=""
              />
              <span>Edit</span>
            </div>
            <div onclick="deleteContact('${currentEmail}');closeContact(${j});"  class="PopUp-delete">
              <img
                class="PopUp-delete-img"
                src="./assets/img/delete_icon.svg"
                alt=""
              />
              <span>Delete</span>
            </div>
          </div>
        </div>
      `;
}

function renderShowContactInfo(currentColor, currentName, currentEmail, currentPhone){
  return `
  <div class="flex-align-center contact-pic-name-container">
        <div style="background-color: ${currentColor}"  class="first-letters-name-bg">
          <span class="first-letters-name">${getInitials(currentName)}</span>
        </div>
        <div id="contact-name">
          <h2>${currentName}</h2>
          <div class="flex-align-center" id="contact-edit-delete">
            <div
              onclick="editContactPopUp();editContact('${currentEmail}')"
              class="flex-align-center"
              id="contact-edit"
            >
              <img
                class="contact-pen-delete-img"
                src="assets/img/pen_DARK.svg"
                alt=""
              />
              <span>Edit</span>
            </div>
            <div onclick="deleteContact('${currentEmail}')" class="flex-align-center" id="contact-delete">
              <img
                class="contact-pen-delete-img"
                src="/assets/img/delete_icon.svg"
                alt=""
              />
              <span> Delete</span>
            </div>
          </div>
        </div>
      </div>
      <span id="span-contact-information">Contact Information</span>
      <div class="flex-col-just-center" id="email-telefon-contact">
        <div class="flex-col-just-center" id="email-contact">
          <span>Email</span>
          <a href="">${currentEmail}</a>
        </div>
        <div class="flex-col-just-center" id="phone-contact">
          <span>Phone</span>
          <a href="">${currentPhone}</a>
        </div>
      </div>
      `;
}

function renderPopupEditAddMiddleHTML(currentColor, currentName ){
  return `
  <div  style="background-color: ${currentColor}" id="first-letters-name-bg" class="first-letters-name-bg margin-top-60px">
            <span class="first-letters-name">${getInitials(currentName)}</span>
          </div>
  `;
}

function renderFormEditContactHTML(currentEmail){
  return `
  <form onsubmit="saveEditedContact('${currentEmail}');return false;" class="form-add-new-contact" id="form-edit-contact" action="">
  <input
    placeholder="Name"
    class="input-text-email-number-contact input-text-contact"
    id="input-edit-name-contact"
    type="text"
    required
  />
  <input
    placeholder="Email"
    class="input-text-email-number-contact input-email-contact"
    id="input-edit-email-contact"
    type="email"
    required
  />
  <input
    placeholder="Phone"
    class="input-text-email-number-contact input-number-contact"
    id="input-edit-phone-contact"
    type="text"
    required
  />
  <div class="button-container-edit">
    <img
      onclick="deleteContact('${currentEmail}'); closePupUpaddNewOrEdditContact();closeContact()"
      class="button_delete"
      src="./assets/img/button_delete.svg"
      alt=""
    />
    <button type="submit" style="background: transparent; border: none;">
      <img
        onclick="validateAndClosePopup()"
        class="button_save_contact"
        src="./assets/img/button_save.svg"
        alt=""
      />
    </button>
  </div>
</form>
    `;
}

function renderLogout(registeredID){
    return `
   <div class="popout-showlogout">
      <a href="imprint.html">Legal Notice</a>
      <a href="privacy.html">Privacy Policy</a>
      <a onclick="logout('${registeredID}')" href="#">Log Out</a>
    </div>`;
}